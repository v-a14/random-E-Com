const User = require('../models/User'); 
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');

const {attachCookiesToResponse, createTokenUser} = require('../utils/index');


const register = async (req, res) => {
    const {email, name, password} = req.body;
    const emailAlreadyExists = await User.findOne({email});

    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('Email Already Exists'); 
    }

    // // This will count all the users in databse
    // // setting first user as a admin 
    
    const isFirstAccount = (await  User.countDocuments({})) === 0; 
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({email, name, password, role});

    const tokenUser = createTokenUser(user);
   

    attachCookiesToResponse({res, user: tokenUser})

    // Token get's attached to the cookies. 
    res.status(StatusCodes.CREATED).json({ user:tokenUser});
}

const login = async (req, res) => {
    const {email, password} = req.body; 
    if(!email || !password) 
        throw new CustomError.BadRequestError("Please Provide email and password");

    const user = await User.findOne({email});


    if(!user)
        throw new CustomError.UnauthenticatedError("Invalid Credentials");

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect)
        throw new CustomError.UnauthenticatedError("Invalid Credentials");


    const tokenUser = createTokenUser(user);
   

    attachCookiesToResponse({res, user: tokenUser})

    // Token get's attached to the cookies. 
    res.status(StatusCodes.OK).json({ user:tokenUser});
}

const logout = async(req, res) => {
    res.cookie('token', 'logout', {
        httpOnly : true, 
        expires : new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({msg: "User Logged Out!"});
};


// humne yha pr jo functions banaye, usko humne export kr diya, 

module.exports = {
    register, 
    login, 
    logout,
}