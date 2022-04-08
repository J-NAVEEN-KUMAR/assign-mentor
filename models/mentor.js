import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const mentorSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: true,
    },
    phone: {
      type: Number,
      trim: true,
      required: "Mobile number is required",
    },
    technology: {
      type: String,
      trim: true,
    },
    studentsAssigned: [],
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);
