// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first');
    res.redirect('/login');
}

// Middleware to check if user is the author of a dairy entry
async function isAuthor(req, res, next) {
    try {
        const { id } = req.params;
        const DairyEntry = require('../models/dairyEntry');
        const dairyEntry = await DairyEntry.findById(id);
        
        if (!dairyEntry) {
            req.flash('error', 'Dairy entry not found');
            return res.redirect('/blogs');
        }
        
        if (!dairyEntry.author.equals(req.user._id)) {
            req.flash('error', 'You can only edit your own dairy entries');
            return res.redirect('/blogs');
        }
        
        next();
    } catch (error) {
        req.flash('error', 'Error checking authorization');
        res.redirect('/blogs');
    }
}

module.exports = { isLoggedIn, isAuthor };
