const { string } = require('joi');
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true, 
        required : [true, 'Please provide product name'], 
        maxLength : [100, 'Name can not be than 100 characters'],
    },
    price : {
        type : Number,
        required : [true, "Please provide product price"], 
        default : 0, 
    },
    description : {
        type: String, 
        required : [true, "Please provide Description"], 
        maxLength : [1000, "Description cannot be more than 1000 characters"], 
    },
    image : {
        type : String, 
        default : "/upload/example.jpeg",
    },
    category : {
        type: String, 
        required : [true, "Please Provide product category"],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company : {
        type: String, 
        required : [true, "Please Provide company"],
        enum: {
            values : ['ikea', 'liddy', 'marcos'],
            message : '{VALUE} is not supported', 
        },
    },

    colors: {
        type: [String],
        required : [true, "Please provide Colors"], 
        default : ['#222'],
    },

    featured : {
        type: Boolean, 
        default : false, 
    },
    freeShipping : {
        type: Boolean, 
        default : false,
    },
    inventory : {
        type: Number, 
        required : true, 
        default : 15,
    },
    averageRating : {
        type: Number, 
        default : 0,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref : 'User', 
        required : true, 

    }
},{timestamps : true, toJSON:{virtuals:true}, toObject:{virtuals:true}}
);

ProductSchema.virtual('reviews', {
    ref : 'Review',
    localField : '_id',
    foreignField : 'product',
    justOne : false, 
});


ProductSchema.pre('remove', async function(next){
    await this.model('Review').deleteMany({product:this._id});
})

module.exports = mongoose.model('Product', ProductSchema);