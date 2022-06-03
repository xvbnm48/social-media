const router = require('express').Router();
const mongoose = require('mongoose');
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
    

    try{
        //GEMERATE NEW PASSWORD WITH BCRYPT
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //CREATE NEW USER
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user and response
        const user = await newUser.save();
        res.status(200).json(user)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

//login
router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(400).json({message: "User not found"});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json({message: "Invalid password"});
        res.status(200).json(user);
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }

})

module.exports = router;

