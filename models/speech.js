const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpeechSchema = new Schema ({
    user: String,
    speechData: String,
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Speech', SpeechSchema);