const Joi = require('joi');
const allowedCategories = [
    "mountains", "arctic", "domes", "boats", "farms",
    "camping", "amazing pools", "castles",
    "iconic cities", "rooms", "trending"
];

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object().allow("",null),
        category: Joi.string().valid(...allowedCategories).required()
    }).required()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})