const express = require('express');
const app  =express();
const mongoose = require('mongoose')
require('dotenv/config')

const postsRoute = require ('./routes/posts')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use('/posts',postsRoute)//this is pointing to the routes

app.get('/', (req,res) =>{

 res.send('Homepage')

})

mongoose.connect(process.env.BD_Connector, {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
.then(() => {
 console.log('DB is now connected');
})
.catch(err => {
 console.error('DB connection error:', err.stack);
});


app.listen(3000, ()=>{
  console.log('Server is up and running')


} )

