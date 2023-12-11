const CustomError = require('../errors/index');
const {isTokenValid} = require('../utils/jwt');
const authenticateUser = async(req, res, next) => {
    console.log("authenticate user");
    const token = req.signedCookies.token;
    if(!token) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");   
    }
    try {
        const payload = isTokenValid({token});
        req.user = {name : payload.name, userId : payload.userId, role : payload.role}
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");       
    }

}

const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) 
            throw new CustomError.UnauthorizedError("Unauthorized to access this route");
        next();
    };
}

module.exports = {
    authenticateUser,
    authorizePermission
}; 
