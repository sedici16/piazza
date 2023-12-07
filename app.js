//the main part of the app where requested are handled, diverted to the posts, auth or homepage, also connect to the DB.
// Import necessary libraries and modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const expirePostsTask = require('./tasks/expirePostsCron');

//cors policies libraries, used to handle Cross-Origin Resource Sharing (CORS) policies.
//used this as the front end and backend requests have different origins.
const cors = require('cors');

// Import routes
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth'); // Authentication route (currently commented out)



// Initialize Express app
const app = express();


//Initialised the cron job
expirePostsTask();

//use cors
app.use(cors({ origin: 'http://localhost:3001' }));//listen for front end on port 3001

// Middleware
app.use(bodyParser.json()); // Use body-parser to parse incoming JSON requests

// Define the routes for the application
app.use('/api/posts', postsRoute); // API route for posts
app.use('/api/user', authRoute); // API route for user authentication (currently commented out)

// Homepage route
app.get('/', (req, res) => {
    res.send('Homepage');
});

// Connect to the database
mongoose.connect(process.env.BD_Connector, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('DB is now connected'); // Log on successful DB connection
})
.catch(err => {
    console.error('DB connection error:', err.stack); // Log any DB connection errors
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is up and running');
});
