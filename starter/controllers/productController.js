const Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors/index');
const path = require('path');

const createProduct = async(req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product})
};

const getAllProduct = async(req, res) => {
    const products = await Product.find({});

    res.status(StatusCodes.CREATED).json({products, count:products.length});

};

const getSingleProduct = async(req, res) => {
    const {id : productId} = req.params; 
    const product = await Product.findOne({_id:productId}).populate('reviews');

    if(!product){
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    res.status(StatusCodes.OK).json({product}); 

};

const updateProduct = async(req, res) => {
    const {id : productId} = req.params;
    const product = await Product.findOneAndUpdate({_id:productId}, req.body, {
        new : true, 
        runValidators : true,
    }); 

    if(!product){
        throw new CustomError.NotFoundError(`No Product with id : ${productId}`);
    }

};

const deleteProduct = async(req, res) => {
    const {id : productId} = req.params;
    const product = await Product.findOne({_id:productId});

    if(!product)
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    await product.remove();
    res.status(StatusCodes.OK).json({msg: 'Success! Produce Remove'});
};

const uploadImage = async(req, res) => {
    if(!req.files){
        throw new CustomError.BadRequestError("No File uploaded");
    }
    const productImage = req.files.image; 

    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError("Please Upload Image"); 
    }

    const maxSize = 1024 * 1024;

    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError("Please Upload image smaller than 1MB");
    }

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);

    res.status(StatusCodes.OK).json({image : `/uploads/${productImage.name}`});
};

module.exports = {
    createProduct, 
    getAllProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage
}