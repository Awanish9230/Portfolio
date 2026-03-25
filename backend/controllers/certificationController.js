const Certification = require('../models/Certification');

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
const getCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find().sort('order');
        res.json(certifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a certification
// @route   POST /api/certifications
// @access  Private/Admin
const createCertification = async (req, res) => {
    try {
        console.log('Received Certification Body:', req.body);
        console.log('Received Certification Files:', req.files);
        
        const certificationData = { ...req.body };

        if (typeof certificationData.isEmbedded === 'string') {
            certificationData.isEmbedded = certificationData.isEmbedded === 'true';
        }

        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                const img = req.files.image[0];
                certificationData.certificateImage = img.secure_url || img.url || img.path;
            }
            if (req.files.pdf && req.files.pdf[0]) {
                const pdf = req.files.pdf[0];
                certificationData.certificatePDF = pdf.secure_url || pdf.url || pdf.path;
            }
        }

        console.log('Final Certification Data to Save:', certificationData);

        const certification = new Certification(certificationData);
        const createdCertification = await certification.save();
        res.status(201).json(createdCertification);
    } catch (error) {
        console.error('Save Certification Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a certification
// @route   PUT /api/certifications/:id
// @access  Private/Admin
const updateCertification = async (req, res) => {
    try {
        const certification = await Certification.findById(req.params.id);

        if (certification) {
            const updateData = { ...req.body };

            if (typeof updateData.isEmbedded === 'string') {
                updateData.isEmbedded = updateData.isEmbedded === 'true';
            }

            if (req.files) {
                if (req.files.image && req.files.image[0]) {
                    const img = req.files.image[0];
                    updateData.certificateImage = img.secure_url || img.url || img.path;
                }
                if (req.files.pdf && req.files.pdf[0]) {
                    const pdf = req.files.pdf[0];
                    updateData.certificatePDF = pdf.secure_url || pdf.url || pdf.path;
                }
            }

            console.log('Final Update Data:', updateData);

            Object.assign(certification, updateData);
            const updatedCertification = await certification.save();
            res.json(updatedCertification);
        } else {
            res.status(404).json({ message: 'Certification not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a certification
// @route   DELETE /api/certifications/:id
// @access  Private/Admin
const deleteCertification = async (req, res) => {
    try {
        const certification = await Certification.findById(req.params.id);

        if (certification) {
            await certification.deleteOne();
            res.json({ message: 'Certification removed' });
        } else {
            res.status(404).json({ message: 'Certification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reorder certifications
// @route   PUT /api/certifications/reorder
// @access  Private/Admin
const reorderCertifications = async (req, res) => {
    try {
        const { certificationOrder } = req.body;
        
        const updatePromises = certificationOrder.map(({ id, order }) => 
            Certification.findByIdAndUpdate(id, { order })
        );
        
        await Promise.all(updatePromises);
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    reorderCertifications,
};
