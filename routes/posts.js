// Import required modules and libraries

const express = require('express');
const router = express.Router();
const Post = require('../models/model_of_db');
const req = require('express/lib/request');
const { ConnectionStates } = require('mongoose');
const { verify } = require('jsonwebtoken')
const verifyToken = require('../verifyToken')

// Route to get all posts from the database
// Protected by verifyToken middleware to ensure only authenticated users can access
router.get('/', verifyToken, async (req, res) => {
    try {
        const getPosts = await Post.find();
        res.send(getPosts);
    } catch (err) {
        res.send({ Message: err });
    }
});

// Route to get a specific post by its ID from the database
// Protected by verifyToken middleware
router.get('/:postId', verifyToken, async (req, res) => {
    try {
        const getPostById = await Post.findById(req.params.postId);
        res.send(getPostById);
    } catch (err) {
        res.send({ Message: err });
    }
});

// Route to create a new post and save it to the database
// Protected by verifyToken middleware
router.post('/',verifyToken , async(req, res) => {
    const postData = new Post({
        user: req.body.user,
        title: req.body.title,
        text: req.body.text,
        hashtag: req.body.hashtag,
        location: req.body.location,
        url: req.body.url
    });

    try {
        const postToSave = await postData.save();
        res.send(postToSave);
    } catch(err) {
        res.send({ Message: err });
    }
});


// Route to update (PATCH) a specific post by its ID
// Protected by verifyToken middleware

router.patch('/:postId', verifyToken, async(req,res)=>{

    try{

        const updatePostById = await Post.updateOne(
        {_id:req.params.postId},//this finds the record by parameter entered in the url
        {$set:{ //set everything to the new data
            user: req.body.user,
            title: req.body.title,
            text: req.body.text,
            hashtag: req.body.hashtag,
            location: req.body.location,
            url: req.body.url
            }
        });

    res.send(updatePostById);//this send the data back to the user

    } catch(err){

        res.send({Message:err})
    }

})

// Route to delete a specific post by its ID
// Protected by verifyToken middleware

router.delete('/:postId', verifyToken,  async (req, res) => {
    try {
        const deletePostById = await Post.deleteOne({ _id: req.params.postId });
        res.send(deletePostById);
    } catch (err) {
        res.send({ Message: err });
    }
});

// Export the router to be used in other parts of the application
module.exports = router;
