const mongoose = require('mongoose');

const certificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    issuingOrganization: {
        type: String,
        required: true,
    },
    issueDate: {
        type: String, // String to allow flexible formats like "March 2024"
    },
    expirationDate: {
        type: String,
    },
    credentialID: {
        type: String,
    },
    credentialURL: {
        type: String,
    },
    isEmbedded: {
        type: Boolean,
        default: false,
    },
    embedCode: {
        type: String,
    },
    certificateImage: {
        type: String,
    },
    certificatePDF: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Certification = mongoose.model('Certification', certificationSchema);

module.exports = Certification;
