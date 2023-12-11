const { model } = require('mongoose');
const CustomError = require('../errors/index');

const checkPermission = (requestUser, resourceUserId) => {

    // isliye ki agar admin hi request maar rha ho, toh allowed honi chaiye, 
    // agar admin nhi kr rha h, toh phir user match hona chaiye, jo login h usse 
    if(requestUser.role === 'admin') return;
    if(requestUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnauthenticatedError("Not Authorized to access this route"); 
    
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId); 
};

module.exports = checkPermission; 
