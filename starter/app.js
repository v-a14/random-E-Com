require('dotenv').config();
// instead of adding try catch to every controller, when we use this package, it automatically gets 
// added to every controller 
require('express-async-errors');
const express = require('express');
const app = express();


// rest of the packages, 
// morgan is basically used to log the information, on the terminal. 
const morgan = require('morgan');
const cookieParser = require('cookie-parser'); 
const fileupload = require('express-fileupload');


const port = process.env.PORT || 5000;

// database 
const connectDB = require('./db/connect');

  



// middleware 
// importing our middleware. 
// this order is also important, 404, before error handler
const notFoundMiddleware = require('./middleware/not-found');

// this error handler middleware is always invoked from the successful route, not from any other route. 
const errorHandlerMiddleware = require('./middleware/error-handler');


// Since its the middleware we are placing it above the route 
// after using this middleware, we have access to json object, in req.body. 
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileupload()); 

// routers 
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes'); 

app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/user', userRouter);
app.use('/api/v1/products', productRouter); 
app.use('/api/v1/reviews', reviewRouter);


app.get('/', (req, res)=>{
    console.log(req.signedCookies);
    res.send("E-commerce-API");
})

// Since this is error handler middleware, it needs to be the last one. 
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); 

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is listening to ${port}`));

    }catch(error){
        console.log(error);

    }
};

start();