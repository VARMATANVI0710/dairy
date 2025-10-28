const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./user');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const Joi = require('joi');
const config = require('./config');

// Import routes
const dairyRoutes = require('./routes/dairy');

const app = express();

// Database connection
mongoose.connect(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('💡 Make sure MongoDB is running on your system');
    console.log('💡 You can start MongoDB with: mongod');
});

// Joi validation schemas
const signupSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.alphanum': 'Username must contain only alphanumeric characters',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 30 characters',
            'any.required': 'Username is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
            'any.required': 'Password is required'
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords must match',
            'any.required': 'Please confirm your password'
        })
});

const loginSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'any.required': 'Username is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Validation middleware
const validateSignup = (req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        req.flash('error', errorMessage);
        return res.redirect('/signup');
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        req.flash('error', errorMessage);
        return res.redirect('/login');
    }
    next();
};

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: config.session.cookie.maxAge
    }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages
app.use(flash());

// Global middleware for user authentication
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// Use blog routes
app.use('/blogs', dairyRoutes);

// Login routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', validateLogin, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password. Please check your credentials and try again.'
}), (req, res) => {
    console.log('✅ User logged in successfully:', { username: req.user.username, userId: req.user._id });
    req.flash('success', `Welcome back, ${req.user.username}!`);
    res.redirect('/dashboard');
});

// Signup routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', validateSignup, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        console.log('🔄 Attempting to create new user:', { username, email });
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser.username === username) {
                req.flash('error', 'Username already exists. Please choose a different one.');
            } else {
                req.flash('error', 'Email already registered. Please use a different email or login.');
            }
            return res.redirect('/signup');
        }

        // Create new user with passport-local-mongoose
        const user = new User({ username, email });
        await User.register(user, password);
        
        console.log('✅ New user created successfully:', { username, email, userId: user._id });
        
        req.flash('success', 'Account created successfully! Please login with your credentials.');
        res.redirect('/login');
    } catch (error) {
        console.error('❌ Error creating user:', error);
        
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            req.flash('error', `Validation error: ${errorMessages.join(', ')}`);
        } else if (error.code === 11000) {
            req.flash('error', 'Username or email already exists. Please choose different credentials.');
        } else {
            req.flash('error', 'Error creating account. Please try again.');
        }
        
        res.redirect('/signup');
    }
});

// Dashboard route (protected)
app.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        const DairyEntry = require('./models/dairyEntry');
        
        // Get total entries for the user
        const totalEntries = await DairyEntry.countDocuments({ author: req.user._id });
        
        // Get entries for this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const thisMonth = await DairyEntry.countDocuments({ 
            author: req.user._id, 
            createdAt: { $gte: startOfMonth } 
        });
        
        // Get unique tags count
        const userEntries = await DairyEntry.find({ author: req.user._id });
        const allTags = userEntries.reduce((tags, entry) => {
            if (entry.tags && entry.tags.length > 0) {
                tags.push(...entry.tags);
            }
            return tags;
        }, []);
        const uniqueTags = [...new Set(allTags)].length;
        
        // Get last entry date
        const lastEntry = await DairyEntry.findOne({ author: req.user._id })
            .sort({ createdAt: -1 })
            .select('createdAt');
        
        const lastEntryDate = lastEntry ? 
            new Date(lastEntry.createdAt).toLocaleDateString() : 
            'Never';
        
        res.render('dashboard', {
            stats: {
                totalEntries,
                thisMonth,
                uniqueTags,
                lastEntry: lastEntryDate
            }
        });
    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        // Render with default values if there's an error
        res.render('dashboard', {
            stats: {
                totalEntries: 0,
                thisMonth: 0,
                uniqueTags: 0,
                lastEntry: 'Never'
            }
        });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first');
    res.redirect('/login');
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { error: 'Page not found' });
});

const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${config.server.env}`);
    console.log(`🗄️ Database: ${config.mongodb.uri}`);
});
