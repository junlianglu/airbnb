const client = require('./config/elasticsearchClient'); // Elasticsearch client instance
const Property = require('./models/Property'); // Mongoose Property model
const mongoose = require('mongoose');
require('dotenv').config(); // For MongoDB connection URI

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  try {
    const properties = await Property.find({});
    
    for (const property of properties) {
      await client.index({
        index: 'properties',
        id: property._id.toString(),
        body: {
          title: property.title,
          description: property.description,
          location: property.location,
          price: property.price,
          // add any other fields you want to sync
        }
      });
    }
    console.log('All properties synced to Elasticsearch');
  } catch (error) {
    console.error('Error syncing properties:', error);
  } finally {
    mongoose.connection.close(); // Close MongoDB connection
  }
});
