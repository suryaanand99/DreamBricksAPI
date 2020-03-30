const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyType: {
      type: String,
      required: [true, "property type is required"]
    },
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      unique: true
    },
    bhk: {
      type: Number,
      required: [true, "bhk is required"]
    },
    cost: {
      type: Number,
      required: [true, "cost is required"]
    },
    area: {
      type: Number,
      required: [true, "area is required"]
    },
    address: {
      type: String,
      trim: true
    },
    location: {
      type: String
    },
    details: {
      type: String,
      trim: true
    },
    eligible: {
      type: String,
      default: "Not Eligible"
    },
    img: [
      {
        type: String
      }
    ],
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviews: [
      {
        personId: mongoose.Schema.Types.ObjectId,
        desc: String
      }
    ]
  },
  {
    timestamps: true
  }
);

propertySchema.methods = {
  toJSON: function() {
    const property = this.toObject();
    delete property.__v;
    delete property.createdAt;
    delete property.updatedAt;
    return property;
  }
};

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
