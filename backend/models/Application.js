import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    jobId: {
        type: String,
        required: true
    }, 
    resume: {
        type: String,
        required: true
    },
    appliedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Applied', 'Selected', 'Rejected'],
        default: 'Applied',
        required: true
    },
    reviewedAt: { type: Date},
    reviewedBy: { type: String}
}); 

applicationSchema.index(
  { userId: 1, jobId: 1 },
  { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;