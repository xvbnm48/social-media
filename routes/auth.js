const router = require('express').Router();
const mongoose = require('mongoose');
const User = require("../models/User");

//register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    try{
        const user = await newUser.save();
        res.status(200).json(user)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})


module.exports = router;

