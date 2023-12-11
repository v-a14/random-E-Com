const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const { STATES } = require('mongoose');
const {createTokenUser, attachCookiesToResponse, checkPermission} = require('../utils/index') 


const getAllUsers = async(req, res) => {
    console.log(req.user);
    const users = await User.find({role : 'user'}).select('-password');
    res.status(StatusCodes.OK).json({users}); 
}
const getSingleUser = async(req, res) => {
    // console.log(req.params)
    const user = await User.findOne({_id : req.params.id}).select('-password');
    if(!user) 
        throw new CustomError.NotFoundError(`No user with id ${req.params.id}`);

    // console.log(req.user)
    checkPermission(req.user, user._id)
    res.status(StatusCodes.OK).json({user}); 

}

const showCurrentUSer = async(req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
    res.send("show current User");
}

// another function to update, the user details.  
const updateUser = async(req, res) => {
    const {email, name} = req.body;
    if(!email || !name){
        throw new CustomError.BadRequestError("Please Provide All Values");
    }
    const user = await User.findOne({_id:req.user.userId});
    user.email = email;
    user.name = name;

    await user.save(); 
}

// it is the code of updateuser with findOneAndUpdate
// const updateUser = async(req, res) => {
//     const {email, name} = req.body;
//     if(!email || !name){
//         throw new CustomError.BadRequestError("Please Provide all values");
//     }
//     const user = await User.findOneAndUpdate(
//         {_id: req.user.userId}, 
//         {email, name}, 
//         {new : true, runValidators:true}
//     );
    
//     const tokenUser = createTokenUser(user); 
//     attachCookiesToResponse({res, user:tokenUser});
//     res.status(StatusCodes.OK).json({user:tokenUser}); 

// }

const updateUserPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError("Please provide both values"); 
    }
    const user = await User.findOne({_id:req.user.userId});
    
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){Vaibhav
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    user.password = newPassword; 
    await user.save(); 
    res.status(StatusCodes.OK).json({msg: "Success! Password Updated"})
}


module.exports = {
    getAllUsers, 
    getSingleUser, 
    showCurrentUSer, 
    updateUser, 
    updateUserPassword,
};