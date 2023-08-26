const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'please provide company name'],
        maxlength: 20
    },
    position: {
        type: String,
        required: [true, 'please provide position'],
        maxlength: 30
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true }
)

module.exports = mongoose.model('Job', jobSchema)

