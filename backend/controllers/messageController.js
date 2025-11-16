const Message = require('../models/Message');
const Listing = require('../models/Listing');

exports.createMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId, toUserId, text } = req.body;
    if(!listingId || !toUserId || !text) return res.status(400).json({ msg: 'listingId, toUserId and text are required' });

    // verify listing exists
    const listing = await Listing.findById(listingId);
    if(!listing) return res.status(404).json({ msg: 'Listing not found' });

    // allow messages if either: recipient is the listing seller (buyer->seller),
    // or the sender is the listing seller (seller replying to a buyer)
    const sellerId = (listing.seller && listing.seller.toString) ? listing.seller.toString() : String(listing.seller);
    const senderId = String(userId);
    if(String(toUserId) !== String(sellerId) && senderId !== String(sellerId)){
      return res.status(403).json({ msg: 'Messages can only be sent to the listing seller or sent by the listing seller' });
    }

    // validate recipient exists
    const User = require('../models/User');
    const recipient = await User.findById(toUserId).select('_id');
    if(!recipient) return res.status(400).json({ msg: 'Recipient user not found' });

    const msg = new Message({ listing: listingId, from: userId, to: toUserId, text });
    await msg.save();
    return res.json(msg);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
}

exports.getMessagesForListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const listingId = req.params.listingId;
    // verify listing exists
    const listing = await Listing.findById(listingId);
    if(!listing) return res.status(404).json({ msg: 'Listing not found' });

    // mark messages sent to this user as read
    await Message.updateMany({ listing: listingId, to: userId, read: false }, { $set: { read: true, readAt: new Date() } });

    // return messages where user is either sender or receiver and belong to this listing
    const messages = await Message.find({ listing: listingId, $or: [{from: userId}, {to: userId}] }).populate('from to', 'name email').sort('createdAt');
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
}

exports.getUnreadCount = async (req, res) => {
  try{
    const userId = req.user.id;
    const count = await Message.countDocuments({ to: userId, read: false });
    return res.json({ count });
  }catch(err){
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
}

// Conversations grouped by listing + other participant
exports.getConversations = async (req, res) => {
  try{
    const userId = req.user.id;
    // fetch messages involving this user, newest first
    const msgs = await Message.find({ $or: [{from: userId}, {to: userId}] })
      .populate('from to', 'name email')
      .populate('listing', 'make model year title')
      .sort({ createdAt: -1 });

    const map = new Map();
    for(const m of msgs){
      const listingId = String(m.listing?._id || m.listing);
      const fromId = m.from && (m.from._id || m.from.id || m.from);
      const toId = m.to && (m.to._id || m.to.id || m.to);
      const otherId = String(fromId) === String(userId) ? String(toId) : String(fromId);
      const key = `${listingId}::${otherId}`;
      if(!map.has(key)){
        map.set(key, {
          listing: m.listing || { _id: listingId },
          participant: (String(fromId) === String(userId)) ? m.to : m.from,
          lastMessage: m,
          unreadCount: 0
        });
      }
      // increment unread if message is to this user and unread
      if(String(m.to && (m.to._id || m.to.id || m.to)) === String(userId) && !m.read){
        const entry = map.get(key);
        entry.unreadCount = (entry.unreadCount || 0) + 1;
        map.set(key, entry);
      }
    }

    const conversations = Array.from(map.values());
    return res.json(conversations);
  }catch(err){
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
}
