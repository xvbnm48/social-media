const router = require('express').Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// updater user

router.put("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }catch(err){
                return res.status(500).json({"message": "error"})
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body});
            res.status(200).json("account has been updated")
        }catch(err) {
            return res.status(500).json({"message": "error"})
        }
    } else {
        res.status(403).json({"message": "You are not allowed to update this user"})
    }
})

//delete
router.delete("/:id" , async (req,res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({"message":"user has been deleted"})
        }catch(err){
            return res.status(500).json({"message": "error"})
        }
    } else {
        return res.status(500).json({"message": "you can delete only your account"})
    }
})

module.exports = router;

