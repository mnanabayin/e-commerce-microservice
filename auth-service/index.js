const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./User")
const mongoose = require("mongoose");
const { MONGO_CONNECTION_STRING_AUTH } = require('../config');


const app = express();
const PORT = process.env.PORT_ONE || 8000;
app.use(express.json());

mongoose.connect(MONGO_CONNECTION_STRING_AUTH,{
    useNewUrlParser: true,
    useUnifiedTopology: true},()=> {
    console.log(`Auth-Service DB Connected`)
});


//Login

app.post("/auth/login",async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email})
    if(!user){
        return res.json({message:"User doesn't exist"})
    }else{
        //check if paswword is valid
        if(password !== user.password)
        {
            res.json({message:"Password Incorrect"})
        }
        const payload ={
            email,
            name: user.name
        }
        jwt.sign(payload, "secret", (err,token) => {
            if(err) console.log(err);
            else{
                return res.json({ token: token})
            }
        })
    }
})

//Register


app.post("/auth/register", async (req, res) => {
    console.log("I am here");
    const {email, password, name} = req.body;
    const userExists =  await User.findOne({email});
    if(userExists){
        return res.json({message : "User already exists"});
    } else {
        const newUser = new User({
            name,
            email,
            password
        })

        newUser.save();
        return res.json(newUser);
    }
});


app.listen(PORT,()=>{
    console.log(`Auth-Service at PORT ${PORT}`)
})