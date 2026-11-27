const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true
    },

    studentName: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    institution: {
        type: String,
        required: true
    },

    issueDate: {
        type: Date,
        required: true
    },

    certificateHash: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Valid"
    }
});

module.exports = mongoose.model("Certificate", certificateSchema);