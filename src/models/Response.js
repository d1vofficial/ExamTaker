const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    student_id: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    
    answer: [{
        type: String
    }]

}, {
    timestamps: true
});

var Response = mongoose.model('Response', responseSchema);
module.exports = Response;

// delete mongoose.connection.models['Response']; //testing purpose
