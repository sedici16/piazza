// Import required modules and libraries
// the main backbone of the app, containing all the major routes

//File imports
const express = require('express');
const router = express.Router();
const Post = require('../models/model_of_db');
const req = require('express/lib/request');
const { ConnectionStates } = require('mongoose');
const { verify } = require('jsonwebtoken')
const verifyToken = require('../verifyToken');
const { getRounds } = require('bcryptjs');

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


//browse expired posts
router.get('/expired-posts-history', verifyToken, async (req, res) => {

    try{

        const expiredPostHistory =await Post.find ({status: 'Expired'});
        res.json(expiredPostHistory);
        } catch (err){
            res.status(500).json({error: err.message});

        }
});


// get the posts that are most liked without grouping by topic
router.get('/most-liked-posts', verifyToken, async (req, res) => {
    try {
        const mostLikedPosts = await Post.aggregate([
            { $sort: { likes: -1 } } // sort likes in descending order
            // No group stage, so it will just sort all posts by likes
        ]);

        res.json(mostLikedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// get the posts that are most liked without grouping by topic
router.get('/most-disliked-posts', verifyToken, async (req, res) => {
    try {
        const mostDisLikedPosts = await Post.aggregate([
            { $sort: { dislikes: -1 } } // sort likes in descending order
            // No group stage, so it will just sort all posts by likes
        ]);

        res.json(mostDisLikedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Route to get a specific post by its ID from the database
// Protected by verifyToken middleware
router.get('/:postId', verifyToken, async (req, res) => {
    try {
        const getPostById = await Post.findById(req.params.postId);

        if (!getPostById){
            return res.status(404).json({err: 'post not found'});
        }

     
        res.send(getPostById);
    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Route to create a new post and save it to the database
// Protected by verifyToken middleware
router.post('/',verifyToken , async(req, res) => {
    console.log(req.user);
    //define the allowed topics
    const allowedTopics =['Politics', 'Health', 'Sport', 'Tech'];

    //check if the topic provided by the user is allowed

    if (!allowedTopics.includes(req.body.topic)){

        return res.status(400).json({error: 'Sorry your topic is not allowed: only Politics, Health, Sport, or Tech '})

    }

    const postData = new Post({
        user: req.user.username,//use the username from the log in
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
        res.status(400).send({ Message: err.message });
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

//the route to get the topics under a specifi topic name

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

// the route to like a post by postid
router.patch('/like/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ err: 'Post not found' });
        }


        if (post.status === 'Expired'){

            return res.status(403).json ({error: 'Sorry you cannot like expired post' })
        }

        // Check if the user is trying to like their own post
        if (post.user === req.user.username) {
        return res.status(400).json({ error: 'You cannot like your own post.' });
         }

        const username = req.user.username;

        // Convert ObjectIds to strings for the comparison
        if (post.likedBy.includes(username)) {
            return res.status(400).json({ error: 'You have already liked this post.' });
        }

        post.likes += 1;
        post.likedBy.push(username); // Add the user's ID to the likedBy array
        
        const updatePost = await post.save();
        
        res.json(updatePost);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//the route to dislike a post by postid

router.patch('/dislike/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ err: 'Post not found' });
        }

        const username = req.user.username;

        // Convert ObjectIds to strings for the comparison
        if (post.dislikedBy.includes(username)) {
            return res.status(400).json({ error: 'You have disliked  this post.' });
        }

        
        if (post.status === 'Expired'){

            return res.status(403).json ({error: 'Sorry you cannot dislike expired post' })
        }
        
        ///you cannot dislike your ownn post
        if (post.user === req.user.username) {
            return res.status(400).json({ error: 'You cannot dislike your own post.' });
             }
        //add the dislikes user names to the list
        
        
        post.dislikes += 1;
        post.dislikedBy.push(username); // Add the user's ID to the likedBy array
        
        const updatePost = await post.save();
        
        res.json(updatePost);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});


//the route to comment a post by post id
router.patch('/comment/:postId', verifyToken, async (req,res) =>{

    try{
            const post = await Post.findById(req.params.postId);

            if (!post){
                return res.status(404).json({ err: 'Post not found' });
        
            }

            if (post.status === 'Expired') {
                return res.status(403).json({ error: 'Cannot comment on an expired post' });
            }
            
            const commentText = req.body.text;
            
            const username = req.user.username;

            // Create a new comment object
            const newComment = {
              text: commentText,
              commentedBy: username 
            };
            
            post.comments.push(newComment);

            // Save the updated post
            await post.save();
        
            // Send a success response
            res.status(200).json({ message: 'Comment added successfully', post });
          } catch (error) {
            res.status(500).json({ error: 'something has gone wrong!' });
          }
        });



// Export the router to be used in other parts of the application
module.exports = router
