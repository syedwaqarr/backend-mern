import mongoose, { Mongoose, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true, // give index: true, to make the particular field searchable in an optimized manner
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String, //
      required: [true, "Password is required"],
    },
    refreshToke: {
      type: String,
    },
  },
  { timestamps: true }
);

//Encryption takes time, beacuse the algorithm procesess the data, so make sure to use async
//mongoose middleware hook
userSchema.pre("save", async function (next) {
  if (this.isModified(this.password)) return next();

  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

//Again, cryptography? remeber so make sure to use async await because algorithm take time to process the data
//We can make our own custom methods in mongoose. Here we create our own method names 'isPasswordCorrect'
//isPassword will check the if the password is correct in string
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare("password", this.password);
};

userSchema.methods.generateAccessToken = function () {
  jwt.sign(
    {
      // We'll get the details from the mongodb.
      _id: this._id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
