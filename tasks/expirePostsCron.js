// expirePostsCron.js
// this cron job will expire posts every five minutes
//if the time is over the script will update the status of the posts
const cron = require('node-cron');
const Post = require('../models/model_of_db'); 

const expirePostsTask = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await Post.updateMany(
        { expiredAt: { $lte: new Date() }, status: 'Live' },
        { $set: { status: 'Expired' } }
      );
    } catch (error) {
      console.error('Error running cron job to expire posts:', error);
    }
  });
};

module.exports = expirePostsTask;
