const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dairyEntrySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    mood: {
        type: String,
        enum: ['Happy', 'Sad', 'Excited', 'Calm', 'Anxious', 'Grateful', 'Other'],
        default: 'Other'
    },
    weather: {
        type: String,
        trim: true,
        maxlength: 50
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: 20
    }],
    isPrivate: {
        type: Boolean,
        default: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for better query performance
dairyEntrySchema.index({ author: 1, createdAt: -1 });
dairyEntrySchema.index({ tags: 1 });

module.exports = mongoose.model('DairyEntry', dairyEntrySchema);
