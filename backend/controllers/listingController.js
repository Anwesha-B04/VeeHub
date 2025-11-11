const Listing = require('../models/Listing');
const User = require('../models/User');

exports.createListing = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const data = req.body;
    const images = (req.files || []).map(f => ({url: `/uploads/${f.filename}`, alt: f.originalname}));
    const listing = new Listing({
      seller: sellerId,
      title: data.title || `${data.make} ${data.model}`,
      make: data.make,
      model: data.model,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      fuelType: data.fuelType,
      location: data.location,
      description: data.description,
      condition: data.condition || 'good',
      images
    });
    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};

// Search with filters and pagination
exports.searchListings = async (req, res) => {
  try {
    const {make, model, yearMin, yearMax, priceMin, priceMax, mileageMax, fuelType, location, page=1, limit=12, sort='-createdAt'} = req.query;
    const q = {};
    if(make) q.make = new RegExp(make, 'i');
    if(model) q.model = new RegExp(model, 'i');
    if(yearMin || yearMax) q.year = {};
    if(yearMin) q.year.$gte = +yearMin;
    if(yearMax) q.year.$lte = +yearMax;
    if(priceMin || priceMax) q.price = {};
    if(priceMin) q.price.$gte = +priceMin;
    if(priceMax) q.price.$lte = +priceMax;
    if(mileageMax) q.mileage = {$lte: +mileageMax};
  if(fuelType) q.fuelType = fuelType;
  if(location) q.location = new RegExp(location, 'i');
  if(req.query.seller) q.seller = req.query.seller;

    const skip = (page-1) * limit;
    const [items, total] = await Promise.all([
      Listing.find(q).sort(sort).skip(skip).limit(+limit),
      Listing.countDocuments(q)
    ]);
    res.json({items, total, page: +page, pages: Math.ceil(total/limit)});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email');
    res.json(listing);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
};

exports.compareListings = async (req, res) => {
  try {
    const {ids} = req.body; // array of ids
    if(!Array.isArray(ids)) return res.status(400).json({msg: 'ids array required'});
    const items = await Listing.find({_id: {$in: ids}}).limit(3);
    res.json({items});
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
};

// Simple trade-in estimator using rough depreciation and comparison with similar listings
exports.tradeInEstimate = async (req, res) => {
  try {
    const {vin, year, mileage, make, model, condition} = req.body;
    // For prototype: estimate based on comparable listings average price and adjustments
    const comps = await Listing.find({make: new RegExp(make,'i'), model: new RegExp(model,'i'), year: {$gte: year-2, $lte: year+2}}).limit(20);
    let avgPrice = 0;
    if(comps.length) avgPrice = comps.reduce((s,i)=>s+i.price,0)/comps.length;
    else avgPrice = 500000; // fallback base

    // Adjust for mileage and condition heuristic
    const mileageFactor = Math.max(0.6, 1 - (mileage/200000));
    const conditionFactor = condition === 'excellent' ? 1.0 : condition === 'good' ? 0.9 : condition === 'fair' ? 0.8 : 0.7;
    const est = avgPrice * mileageFactor * conditionFactor * 0.6; // trade-in is lower than asking
    res.json({min: Math.round(est*0.9), max: Math.round(est*1.1), note: 'Prototype estimate based on nearby comparables (approx)'});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};

// Price suggestion: look for comps and propose price +/- ranges and justification
exports.priceSuggestion = async (req, res) => {
  try {
    const {make, model, year, mileage, condition} = req.body;
    const comps = await Listing.find({make: new RegExp(make,'i'), model: new RegExp(model,'i'), year: {$gte: year-1, $lte: year+1}}).limit(50);
    if(!comps.length) return res.json({suggested: null, comps: [], note: 'No comparables found in dataset'});
    const avg = comps.reduce((s,i)=>s+i.price,0)/comps.length;
    // Adjust by mileage difference
    const avgMileage = comps.reduce((s,i)=>s+i.mileage,0)/comps.length;
    const mileageAdj = mileage < avgMileage ? 1.03 : mileage > avgMileage ? 0.97 : 1.0;
    const conditionFactor = condition === 'excellent' ? 1.05 : condition === 'good' ? 1.0 : condition === 'fair' ? 0.95 : 0.9;
    const suggested = Math.round(avg * mileageAdj * conditionFactor);
    res.json({suggested, avg, compsCount: comps.length, note: 'Prototype suggestion based on local comparables'});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};
