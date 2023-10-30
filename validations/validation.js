// Import the joi library for data validation
const joi = require('joi');

// Function to validate the registration data
const registerValidation = (data) => {
    // Define validation schema for registration data
    const schemaValidation = joi.object({
        // Username should be a string, required, and have a length between 3 and 256 characters
        username: joi.string().required().min(3).max(256),

        // Email should be a string, required, in proper email format, and have a length between 6 and 256 characters
        email: joi.string().required().min(6).max(256).email(),

        // Password should be a string, required, and have a length between 6 and 1024 characters
        password: joi.string().required().min(6).max(1024)
    });

    // Validate the provided data against the schema and return the result
    return schemaValidation.validate(data);
};

// Function to validate the login data
const loginValidation = (data) => {
    // Define validation schema for login data
    const schemaValidation = joi.object({
        // Email should be a string, required, in proper email format, and have a length between 6 and 256 characters
        email: joi.string().required().min(6).max(256).email(),

        // Password should be a string, required, and have a length between 6 and 1024 characters
        password: joi.string().required().min(6).max(1024)
    });

    // Validate the provided data against the schema and return the result
    return schemaValidation.validate(data);
}

// Export the validation functions to be used in other parts of the application
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
