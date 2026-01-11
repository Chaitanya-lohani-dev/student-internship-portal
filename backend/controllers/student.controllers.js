import Application from "../models/application.js";
import Job from "../models/job.js";
import { z } from 'zod';

const submitApplicationSchema = z.object({
    resume: z.string().url()
})

export const getJobs = async(req,res) => {
    try {
        const jobs = await Job.find({ closesAt: { $gt: new Date()}}).sort({createdAt: -1})
        res.status(200).json({jobs})
    } catch (error) {
        res.status(500).json({message: "Error fetching data"})
    }
}

export const submitApplication = async (req, res) => {
    try {
        const application = await Application.findOne({jobId: req.params.id, userId: req.user.userId})
        if (application) {
            return res.status(409).json({message: 'Application Already submitted'})    
        }
    
        const validation = submitApplicationSchema.safeParse(req.body);
    
        if(!validation.success) {
            return res.status(400).json({message: "Invalid Data Type"})
        }
    
        await Application.create({
            userId: req.user.userId,
            jobId: req.params.id,
            resume: validation.data.resume
        })
    
        res.status(201).json({message: "Application Submitted Succesfully"})
    } catch (error) {
        res.status(500).json({message: "Error Submitting Application"})
    }
}

export const getApplications = async(req, res) => {
    try {
        const applications = await Application.find({userId: req.user.userId})
        res.status(200).json({data: applications})
    } catch (error) {
        res.status(500).json({message: "error geting data", error: error})
    }
}

export const delApplication = async(req, res) => {
    try {
        const application = await Application.findOne({jobId: req.params.id, userId: req.user.userId})
    
        if(!application) {
            return res.status(404).json({message: 'No Such application exists'})
        }
    
        await Application.findOneAndDelete({_id: application._id})
    
        res.status(200).json({message: "Application Deleted Successfully"})
    } catch (error) {
        res.status(500).json({message: "Error Deleting Application"})
    }
}
