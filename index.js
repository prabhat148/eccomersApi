const express = require("express");
const app = express();
const mongoose =require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); //alfter requiring dotenv setting configration and use itby --process.env.fileName--example in line 12//
const userRouter =require("./routes/user");
const authRouter =require("./routes/auth");
const productRouter =require("./routes/product");
const cartRouter =require("./routes/cart");
const orderRouter =require("./routes/order");
const paymentRouter =require("./routes/payment");
const cors  =require('cors')




// for connection to db we need to add mongo url which comes from mongo cloud cluster //
// for securing the url to be miss used we use dotenv pkg..//

mongoose.connect(process.env.MONGOOSE_URL)
.then(()=>{console.log("db connection is scussesful")})
.catch((err)=>{
    console.log(err)
})

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/payment",paymentRouter)

app.listen(process.env.PORT_NO ||4000, ()=>{
    console.log("your server is running inport 4000")
});