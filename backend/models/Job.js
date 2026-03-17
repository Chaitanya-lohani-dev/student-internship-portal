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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    closesAt: {
        type: Date,
        required: true
    },
    applicationCount: {
        type: Number,
        default: 0
    }
},{timestamps: true});

const Job = mongoose.model("Job", jobSchema);

export default Job;