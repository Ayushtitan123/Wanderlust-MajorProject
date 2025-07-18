const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const { required } = require("joi");


const listingSchema = new Schema({
    title: {
        type: String,
        required : true,
    },
    description: String,
    image: {
        filename: {
          type: String,
          default: 'listingimage',
        },
        url: {
          type: String,
          default: 'https://unsplash.com/photos/body-of-water-near-trees-and-mountain-cliff-during-daytime-TWoL-QCZubY',
          set: (v) =>
            v === ''
              ? 'https://unsplash.com/photos/body-of-water-near-trees-and-mountain-cliff-during-daytime-TWoL-QCZubY'
              : v,
        },
      },
      
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      }
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User"
    },
    geometry:{
      type:{
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates:{
        type:[Number],
        required: true
      }
    },
    category:{
      type: String,
      enum: ["mountains","arctic","domes","boats","farms","camping","amazing pools","castles","iconic cities","rooms","trending"]
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if (listing) {
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;