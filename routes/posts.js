const express = require('express');
const router = express.Router();

// Corrected this to use 'Post' instead of 'Posts' for consistent naming
const Post = require('./models/model_of_db');
const req = require('express/lib/request');
const { ConnectionStates } = require('mongoose');

// Get all the data from the DB
router.get('/', async (req, res) => {
    try {
        const getPosts = await Post.find();
        res.send(getPosts);
    } catch (err) {
        res.send({ Message: err });
    }
});

// Get the post by id - corrected the route parameter
router.get('/:postId', async (req, res) => {
    try {
        const getPostById = await Post.findById(req.params.postId);
        res.send(getPostById);
    } catch (err) {
        res.send({ Message: err });
    }
});

///MODEL///
// Define a POST route, this saves the data into the DB
router.post('/', async(req, res) => {
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


//patch means modify the post.

router.patch('/:postId', async(req,res)=>{

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

// delete data

router.delete('/:postId', async (req, res) => {
    try {
        const deletePostById = await Post.deleteOne({ _id: req.params.postId });
        res.send(deletePostById);
    } catch (err) {
        res.send({ Message: err });
    }
});


module.exports = router;
