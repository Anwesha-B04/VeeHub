// Seed script to create sample users and listings
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Listing = require('./models/Listing');

const run = async () => {
  await connectDB();
  await User.deleteMany();
  await Listing.deleteMany();

  const seller = new User({name: 'Demo Seller', email: 'seller@veehub.test', password: 'password', role: 'seller'});
  const buyer = new User({name: 'Demo Buyer', email: 'buyer@veehub.test', password: 'password', role: 'buyer'});
  await seller.save();
  await buyer.save();

  const sample = [
    {make:'Toyota', model:'Corolla', year:2019, price:800000, mileage:45000, fuelType:'Petrol', location:'Mumbai', seller: seller._id, images:[
        {url:'/uploads/toyota_corolla_front.jpg', alt:'Toyota Corolla front'},
        {url:'/uploads/toyota_corolla_interior.jpg', alt:'Toyota Corolla interior'},
        {url:'/uploads/toyota_corolla_side.svg', alt:'Toyota Corolla side'},
        {url:'/uploads/toyota_corolla_rear.svg', alt:'Toyota Corolla rear'}
      ], condition:'good'},
    {make:'Honda', model:'Civic', year:2020, price:500000, mileage:45000, fuelType:'Petrol', location:'Bengaluru', seller: seller._id, images:[
        {url:'/uploads/honda_civic_front.jpg', alt:'Honda Civic front'},
        {url:'/uploads/honda_civic_side.jpg', alt:'Honda Civic side'}
      ], condition:'good'},
    {make:'Hyundai', model:'Creta', year:2020, price:1200000, mileage:30000, fuelType:'Diesel', location:'Delhi', seller: seller._id, images:[
        {url:'/uploads/hyundai_creta_front.jpg', alt:'Hyundai Creta front'},
        {url:'/uploads/hyundai_creta_side.jpg', alt:'Hyundai Creta side'},
        {url:'/uploads/hyundai_creta_interior.jpg', alt:'Hyundai Creta interior'}
      ], condition:'excellent'},
      {make:'Hyundai', model:'Verna', year:2022, price:1560000, mileage:45000, fuelType:'Petrol', location:'Gujrat', seller: seller._id, images:[
        {url:'/uploads/hyundai_verna_front.jpg', alt:'Hyundai Verna front'},
        {url:'/uploads/hyundai_verna_back.jpg', alt:'Hyundai Verna back'},
        {url:'/uploads/hyundai_verna_interior.jpg', alt:'Hyundai Verna interior'}
      ], condition:'excellent'},
      {make:'Tata', model:'Tigor', year:2018, price:895000, mileage:36000, fuelType:'Electric', location:'Kolkata', seller: seller._id, images:[
        {url:'/uploads/tata_tigor_front.jpg', alt:'Tata Tigor front'},
        {url:'/uploads/tata_tigor_side.jpg', alt:'Tata Tigor side'}
      ], condition:'good'},
      {make:'Volkswagen', model:'Polo', year:2015, price:100000, mileage:50000, fuelType:'Petrol', location:'Chennai', seller: seller._id, images:[
        {url:'/uploads/volkswagen_polo_front.jpg', alt:'Volkswagen Polo front'},
        {url:'/uploads/volkswagen_polo_back.jpg', alt:'Volkswagen Polo back'},
        {url:'/uploads/volkswagen_polo_side.jpg', alt:'Volkswagen Polo side'},
        {url:'/uploads/volkswagen_polo_interior.jpg', alt:'Volkswagen Polo interior'}
      ], condition:'excellent'}
  ];

  for(const s of sample){
    const l = new Listing(s);
    await l.save();
  }

  console.log('Seed complete');
  process.exit(0);
};

run().catch(e=>{console.error(e);process.exit(1)});
