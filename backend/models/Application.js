import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    }, 
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Selected', 'Rejected'],
        default: 'Applied',
        required: true
    },
    reviewedAt: { type: Date},
    reviewedBy: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true}); 

applicationSchema.index(
  { userId: 1, jobId: 1 },
  { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;