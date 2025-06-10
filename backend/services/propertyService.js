const Property = require('../models/Property');
const Booking = require('../models/Booking');
const client = require('../config/elasticsearchClient');

exports.createProperty = async (propertyData) => {
    const property = new Property(propertyData);
    await property.save();
    await client.index({
        index: 'properties',
        id: property._id.toString(),
        body: {        
            title: property.title,
            description: property.description,
            location: property.location,
            price: property.price,
            latitude: property.latitude,
            longitude: property.longitude
        }
      });
    return property;
};

exports.searchProperties = async ({ query, minPrice, maxPrice, sortOrder, from = 0, size = 10 }) => {
  try {
    const searchQuery = {
      index: 'properties',
      body: {
        query: {
          bool: {
            must: query
              ? {
                  multi_match: {
                    query: query,
                    fields: ['title', 'location', 'description'],
                  },
                }
              : { match_all: {} },
            filter: [],
          },
        },
        sort: [],
        from,   // Pagination offset
        size,   // Number of results per page
      },
    };

    if (minPrice) {
      searchQuery.body.query.bool.filter.push({ range: { price: { gte: minPrice } } });
    }
    if (maxPrice) {
      searchQuery.body.query.bool.filter.push({ range: { price: { lte: maxPrice } } });
    }
    if (sortOrder && (sortOrder === 'asc' || sortOrder === 'desc')) {
      searchQuery.body.sort = [{ price: { order: sortOrder } }];
    }

    const response = await client.search(searchQuery);
    const propertyIds = response.body.hits.hits.map(hit => hit._id);
    const properties = await Property.find({ _id: { $in: propertyIds } });
    const orderedProperties = propertyIds.map(id => properties.find(property => property._id.toString() === id));
    return orderedProperties;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};

exports.getBookedDates = async (propertyId) => {
    const bookings = await Booking.find({ propertyId });
    return bookings.map(booking => ({
        startDate: booking.checkInDate,
        endDate: booking.checkOutDate
    }));
};

exports.getAllProperties = async () => {
    return await Property.find();
};

exports.getPropertyById = async (id) => {
    return await Property.findById(id);
};

exports.updateProperty = async (id, updatedData) => {
    return await Property.findByIdAndUpdate(id, updatedData, { new: true });
};

exports.deleteProperty = async (id) => {
    return await Property.findByIdAndDelete(id);
};
