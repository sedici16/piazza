//script derived from the lab classes
//The script is a middleware fucntion and it authenticates HTTP requests using JSON webtoken (JWT)
//import the libraries
const jsonwebtoken = require('jsonwebtoken');

function auth(req, res, next) {
 // Extract the JWT token from the request headers.
    const token = req.header('auth-token');
    // If there's no token in the header, deny access.
    if (!token) {
        return res.status(401).send({ message: 'Access denied' });
    }

    try {
     // Verify the JWT token using the secret key.
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();//  continue with other stuff
    } catch (err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}

module.exports = auth;
