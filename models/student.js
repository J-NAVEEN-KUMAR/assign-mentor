import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const studentSchema = Schema(
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
    course: {
      type: String,
      trim: true,
    },
    mentorAssigned: {
      type: ObjectId,
      ref: "Mentor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
