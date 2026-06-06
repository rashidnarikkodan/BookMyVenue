import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    images: [
      {
        type: String,
      },
    ],

    address: {
      street: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      district: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricing: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      unit: {
        type: String,
        enum: ['hour', 'day'],
        default: 'day',
      },
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Nearby venue search
venueSchema.index({ location: '2dsphere' });

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;
