const express = require('express');
const router = express.Router();
const DairyEntry = require('../models/dairyEntry');
const User = require('../user');
const { isLoggedIn, isAuthor } = require('../middleware/auth');
const { validateDairyEntry } = require('../middleware/validation');

// Index - Public: Show all public dairy entries (blog posts)
router.get('/', async (req, res) => {
    try {
        const filter = { isPrivate: false };
        const dairyEntries = await DairyEntry.find(filter)
            .sort({ createdAt: -1 })
            .populate('author', 'username');
        res.render('dairy/index', { dairyEntries });
    } catch (error) {
        req.flash('error', 'Error fetching dairy entries');
        res.redirect('/');
    }
});

// New - Show form to create new dairy entry
router.get('/new', isLoggedIn, (req, res) => {
    res.render('dairy/new');
});

// Create - Create new dairy entry
router.post('/', isLoggedIn, validateDairyEntry, async (req, res) => {
    try {
        const dairyEntry = new DairyEntry(req.body);
        dairyEntry.author = req.user._id;
        // Normalize privacy checkbox: 'on' => true, absent => false
        dairyEntry.isPrivate = req.body.isPrivate === 'on';
        
        // Process tags (split by comma and trim)
        if (req.body.tags) {
            dairyEntry.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
        
        await dairyEntry.save();
        
        // Add dairy entry to user's dairyEntries array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { dairyEntries: dairyEntry._id }
        });
        
        req.flash('success', 'Dairy entry created successfully!');
        res.redirect('/blogs');
    } catch (error) {
        req.flash('error', 'Error creating dairy entry');
        res.redirect('/dairy/new');
    }
});

// Show - Public: Show specific dairy entry if public, or if author
router.get('/:id', async (req, res) => {
    try {
        const dairyEntry = await DairyEntry.findById(req.params.id)
            .populate('author', 'username');
        
        if (!dairyEntry) {
            req.flash('error', 'Dairy entry not found');
            return res.redirect('/blogs');
        }
        
        // If private, only the author can view
        const isAuthorViewing = req.user && dairyEntry.author && dairyEntry.author._id.equals(req.user._id);
        if (dairyEntry.isPrivate && !isAuthorViewing) {
            req.flash('error', 'This entry is private');
            return res.redirect('/blogs');
        }
        
        res.render('dairy/show', { dairyEntry });
    } catch (error) {
        req.flash('error', 'Error fetching dairy entry');
        res.redirect('/blogs');
    }
});

// Edit - Show form to edit dairy entry
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    try {
        const dairyEntry = await DairyEntry.findById(req.params.id);
        res.render('dairy/edit', { dairyEntry });
    } catch (error) {
        req.flash('error', 'Error fetching dairy entry');
        res.redirect('/blogs');
    }
});

// Update - Update dairy entry
router.put('/:id', isLoggedIn, isAuthor, validateDairyEntry, async (req, res) => {
    try {
        const { id } = req.params;
        // Normalize privacy checkbox on update as well
        const updateData = { ...req.body };
        updateData.isPrivate = req.body.isPrivate === 'on';
        const dairyEntry = await DairyEntry.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
        
        // Process tags
        if (req.body.tags) {
            dairyEntry.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            await dairyEntry.save();
        }
        
        req.flash('success', 'Dairy entry updated successfully!');
        res.redirect(`/blogs/${dairyEntry._id}`);
    } catch (error) {
        req.flash('error', 'Error updating dairy entry');
        res.redirect(`/blogs/${req.params.id}/edit`);
    }
});

// Delete - Delete dairy entry
router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Remove dairy entry from user's dairyEntries array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { dairyEntries: id }
        });
        
        await DairyEntry.findByIdAndDelete(id);
        
        req.flash('success', 'Dairy entry deleted successfully!');
        res.redirect('/blogs');
    } catch (error) {
        req.flash('error', 'Error deleting dairy entry');
        res.redirect('/blogs');
    }
});

module.exports = router;
