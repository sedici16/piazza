// expirePostsCron.js

const cron = require('node-cron');
const Post = require('../models/model_of_db'); // Update with the correct path to your Post model

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
