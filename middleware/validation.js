const Joi = require('joi');

// Dairy entry validation schema
const dairyEntrySchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title must be at least 1 character long',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),
    content: Joi.string()
        .trim()
        .min(1)
        .max(5000)
        .required()
        .messages({
            'string.empty': 'Content cannot be empty',
            'string.min': 'Content must be at least 1 character long',
            'string.max': 'Content cannot exceed 5000 characters',
            'any.required': 'Content is required'
        }),
    mood: Joi.string()
        .valid('Happy', 'Sad', 'Excited', 'Calm', 'Anxious', 'Grateful', 'Other')
        .default('Other')
        .messages({
            'any.only': 'Please select a valid mood'
        }),
    weather: Joi.string()
        .trim()
        .max(50)
        .allow('')
        .messages({
            'string.max': 'Weather description cannot exceed 50 characters'
        }),
    tags: Joi.string()
        .trim()
        .max(200)
        .allow('')
        .messages({
            'string.max': 'Tags cannot exceed 200 characters'
        }),
    isPrivate: Joi.any()
        .default(true)
});

// User profile validation schema
const userProfileSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .allow('')
        .messages({
            'string.min': 'First name must be at least 1 character long',
            'string.max': 'First name cannot exceed 50 characters'
        }),
    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .allow('')
        .messages({
            'string.min': 'Last name must be at least 1 character long',
            'string.max': 'Last name cannot exceed 50 characters'
        }),
    bio: Joi.string()
        .trim()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Bio cannot exceed 500 characters'
        }),
    dateOfBirth: Joi.date()
        .max('now')
        .allow('')
        .messages({
            'date.max': 'Date of birth cannot be in the future'
        })
});

// Validation middleware for dairy entries
const validateDairyEntry = (req, res, next) => {
    // Convert isPrivate to boolean before validation
    if (req.body.isPrivate !== undefined) {
        req.body.isPrivate = (req.body.isPrivate === 'on' || req.body.isPrivate === 'true' || req.body.isPrivate === true);
    }
    
    const { error } = dairyEntrySchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        req.flash('error', errorMessage);
        return res.redirect('back');
    }
    next();
};

// Validation middleware for user profile
const validateUserProfile = (req, res, next) => {
    const { error } = userProfileSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        req.flash('error', errorMessage);
        return res.redirect('back');
    }
    next();
};

module.exports = {
    validateDairyEntry,
    validateUserProfile,
    dairyEntrySchema,
    userProfileSchema
};
