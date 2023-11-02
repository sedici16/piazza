const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    hashtag: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    dislikedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }]
    
});

module.exports = mongoose.model('posts', PostSchema);
