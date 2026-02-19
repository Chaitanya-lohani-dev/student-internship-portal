import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    closesAt: {
        type: Date,
        required: true
    },
    lastUpdated: {
        type: Date
    },
    applicationCount: {
        type: Number,
        default: 0
    }
});

const Job = mongoose.model("Job", jobSchema);

export default Job;