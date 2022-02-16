const router = require('express').Router();
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const Post = require('../models/Post');


//create a post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json({message:err});
    }
})
//update a post
router.put("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body})
            res.status(200).json({message: "Post updated"})
        }else {
            res.status(401).json({message:"you can update only your posts"})
        }

    }catch(err){
        res.status(500).json({message:err});
    }
})
//delete a post
router.delete("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json({message: "Post deleted"})
        }else {
            res.status(401).json({message:"you can delete only your posts"})
        }

    }catch(err){
        res.status(500).json({message:err});
    }
})
//like a post
router.put("/:id/like", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json({message: "Post liked"})
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json({message: "Post unliked"})
        }

    }catch(err){
        res.status(500).json({message:err});
    }
    
})
//get a post
router.get("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json({message:err});
    }
})
//get timeline posts 

module.exports = router;