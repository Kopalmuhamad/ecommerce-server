import mongoose from "mongoose";

const { Schema } = mongoose;

const otpCodeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  otp: {
    type: Number,
    required: [true, "Otp code is required"],
  },
  validUntil: {
    type: Date,
    required: true,
    expires: 300,
  },
});

const OtpCode = mongoose.model("OtpCode", otpCodeSchema);
export default OtpCode;
