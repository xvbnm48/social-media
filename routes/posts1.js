const router = require('express').Router();
const Post = require("../models/Post")
const User = require("../models/User")

// create post
router.post("/", async (req,res) => {
  const newPost = new Post(req.bodt);
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost)
  }catch(err){
    res.status(500).json({message: err})
  }
})

//update post
router.put("/:id", async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId){
      await post.updateOne({$set: req.body});
      res.status(200).json({message: "this post has been updated successfully"})
    } else {
      res.status(500).json({message: "you can update only your own post"})
    }
  } catch (err) {
    res.status(500).json({message: err})
  }
})

// delete post from
router.delete("/:id", async (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (post.userId === req.body.userId){
      res.status(200).json({message: "this post has been deleted successfully"})
    } else {
      res.status(404).json({message: "you can delete only your posts"})
    }
  } catch (err) {
    res.status(404).json(err)
  }
})

// like dislike post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({$push: {likes: req.body.userId}});
      res.status(200).json("this post has been liked")
    } else {
      await post.updateOne({$pull: {likes: req.body.userId}});
      res.status(200).json("this post has been dislike")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

// get a post with id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.staus(200).json(post);
  }catch (err) {
    res.status(500).json(err)
  }
})

//get timeline post
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId: currentUser._id})
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({userId: friendId})
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router;
