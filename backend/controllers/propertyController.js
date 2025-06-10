const propertyService = require('../services/propertyService');
const User = require('../models/User');
const Property = require('../models/Property');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3Client');
const { v4: uuidv4 } = require('uuid'); // For unique file names
require('dotenv').config();

exports.uploadPropertyImages = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const imageUrls = [];
        for (const file of req.files) {
            const fileName = `${uuidv4()}_${file.originalname}`;
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/properties/${fileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            await s3Client.send(new PutObjectCommand(uploadParams));       
            const imageUrl = `https://d3cuydmgala2md.cloudfront.net/images/properties/${fileName}`;
            imageUrls.push(imageUrl);
        }

        // Update the property with the new image URLs
        property.imageUrls = [...property.imageUrls, ...imageUrls];
        await property.save();

        res.json({ success: true, property });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
};

// Only allow owners or admins to create properties
exports.createProperty = async (req, res) => {
    try {
        const { _id, role } = req.user; // Get the user's role and ID from the request (after token verification)
        if (role !== 'admin' && role !== 'owner') {
            return res.status(403).json({ error: 'Permission denied. Only owners or admins can create properties.' });
        }

        // Include the owner's ID (user ID) in the property data
        const propertyData = { ...req.body, owner_id: _id };
        const property = await propertyService.createProperty(propertyData);
        await User.findByIdAndUpdate(_id, { $push: { properties: property._id } });
        res.status(201).json(property);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.searchProperties = async (req, res) => {
    try {
        const results = await propertyService.searchProperties(req.query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };

exports.getBookedDates = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const bookedDates = await propertyService.getBookedDates(propertyId);
        res.json(bookedDates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booked dates' });
    }
};

exports.getProperties = async (req, res) => {
    try {
        const properties = await propertyService.getAllProperties();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await propertyService.getPropertyById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const updatedProperty = await propertyService.updateProperty(req.params.id, req.body);
        res.json(updatedProperty);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        await propertyService.deleteProperty(req.params.id);
        res.json({ message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
