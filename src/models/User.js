import mongoose from "mongoose"; //projectname in mongodb--next-auth

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    isVerfied: {
      type: Boolean,
      default: false,
  },
  isAdmin: {
      type: Boolean,
      default: false,
  },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiry: {
      type: Date,
      required: false,
    },
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
