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
        url: req.body.url,
        topic:req.body.topic
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


router.get('/topics/:topicName', verifyToken, async (req, res) => {
    try {
        // Get the topic from the URL parameters
        const topicQuery = req.params.topicName;

        // Find posts that match the specified topic
        const postsByTopic = await Post.find({ topic: topicQuery });

        if (postsByTopic.length === 0) {
            return res.status(404).send({ Message: `No posts found for topic: ${topicQuery}` });
        }

        res.send(postsByTopic);
    } catch (err) {
        res.send({ Message: err });
    }
});

router.patch('/like/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ err: 'Post not found' });
        }

        const userId = String(req.user._id);

        // Convert ObjectIds to strings for the comparison
        if (post.likedBy.map(id => String(id)).includes(userId)) {
            return res.status(400).json({ error: 'You have already liked this post.' });
        }

        post.likes += 1;
        post.likedBy.push(req.user._id); // Add the user's ID to the likedBy array
        
        const updatePost = await post.save();
        
        res.json(updatePost);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.patch('/dislike/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ err: 'Post not found' });
        }

        const userId = String(req.user._id);

        // Convert ObjectIds to strings for the comparison
        if (post.dislikedBy.map(id => String(id)).includes(userId)) {
            return res.status(400).json({ error: 'You have disliked  this post.' });
        }

        post.dislikes += 1;
        post.dislikedBy.push(req.user._id); // Add the user's ID to the likedBy array
        
        const updatePost = await post.save();
        
        res.json(updatePost);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});






// Export the router to be used in other parts of the application
module.exports = router;
