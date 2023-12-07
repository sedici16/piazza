//imports and defintion of variables
const { date } = require('joi');
const mongoose = require('mongoose');
const LIFE_IN_MINUTES = 5

// the Post Schema used to push, delete and create posts in the mongodb
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
        required: true,
        enum:['Politics', 'Health', 'Sport', 'Tech'],
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
 
    likedBy: [{ type: String }],

    dislikedBy: [{ type: String }],


  comments: [{
    text: {
      type: String,
      required: false // Allowing comments to be added without text.
    },
    commentedBy: {
      type: String,
      ref: 'User',
      required: true 
    }
  }],

  ///expired and not expired posts part of the schema

  status : {

    type: String,
    required: true,
    default:'Live',
    enum:['Live', 'Expired']

  },

  createdAt:{
    type: Date,
    default:Date.now
    
  },

  expiredAt:{
    type: Date,
    default: () => new Date(Date.now() + LIFE_IN_MINUTES * 60 * 1000)


  }, 


// get the time to expiry but do not store in the DB
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
    

    
});

PostSchema.virtual('timeLeft').get(function(){
  const now= new Date();
  const expiry = this.expiredAt.getTime();
  const timeLeft = expiry - now

  // if expired return zero
  if (timeLeft < 0 ){
    return 0;
  }
  
  //convert milliseconds to minutes and return
return Math.floor(timeLeft/(1000*60));

});

module.exports = mongoose.model('posts', PostSchema);
