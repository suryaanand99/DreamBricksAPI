const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "password is required"]
    },
    gender: {
      type: String,
      required: [true, "gender is required"]
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true
    },
    dob: {
      type: Date,
      default: Date.now()
    },
    address: {
      type: String,
      trim: true
    },
    accessToken: {
      type: String
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
      }
    ],
    posted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
      }
    ],
    userType: {
      type: String,
      default: "client"
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods = {
  generateToken: async function() {
    try {
      const user = this;
      const accessToken = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3 days" }
      );
      user.accessToken = accessToken;
      await user.save();
      return accessToken;
    } catch (err) {
      throw err;
    }
  },
  toJSON: function() {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    delete user.accessToken;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
  }
};

userSchema.pre("save", async function(next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
