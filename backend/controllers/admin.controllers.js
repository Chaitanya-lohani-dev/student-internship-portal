import Application from '../models/application.js';
import Job from '../models/job.js';
import { z } from 'zod';
import client from '../config/redis.js';

const createJobSchema = z.object({
    title: z.string().min(10),
    description: z.string().min(200),
    closesAt: z.string().min(1)
})

const updateJobSchema = z.object({
    title: z.string().min(10).optional(),
    description: z.string().min(200).optional(),
    closesAt: z.string().min(1).optional()
})

const updateApplicationSchema = z.object({
    status: z.enum(['Selected', 'Rejected'])
})

export const createJob = async(req, res) => {
    try {
        const validation = createJobSchema.safeParse(req.body);
    
        if(!validation.success) {
            return res.status(400).json({message: 'Invalid Data', error: validation.error})
        }
        const {title, description} = validation.data;
        const closesAt = new Date(validation.data.closesAt);
    
        await Job.create({
            title,
            description,
            closesAt,
            createdBy: req.user.userId
        })
        await client.del("student:jobs")
        await client.del(`admin:jobs:${req.user.userId}`)
        res.status(201).json({message: 'Job Created Successfully'})
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({message: 'Internal Server error'})
    }
}

export const updateJob = async(req, res) => {
    try {
        const validation = updateJobSchema.safeParse(req.body);
    
        if(!validation.success) {
            return res.status(400).json({message: 'Invalid data'})
        }
        
        const update = {
            ...validation.data,
            lastUpdated: new Date()
        }
    
        const job = await Job.findOneAndUpdate(
            {_id: req.params.id, createdBy: req.user.userId},
            update,
            {new: true}
        )
        if (!job){
            return res.status(404).json({message: 'Invalid Job or Unauthorized'})
        }
        await client.del("student:jobs")
        await client.del(`admin:jobs:${req.user.userId}`)
    
        res.status(200).json(job)
    } catch (error) {
        console.error("Some error occurred: ", error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const getJobs = async(req, res) => {
    try {
        let data = await client.get(`admin:jobs:${req.user.userId}`);
        if (data !== null) {
            return res.status(200).json({data: JSON.parse(data)})
        }

        data = await Job.find({createdBy: req.user.userId}).sort({createdAt: -1})
        await client.set(`admin:jobs:${req.user.userId}`, JSON.stringify(data), { EX: 3600})
        res.status(200).json({ data })
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({message: 'Database error fetching data.'})
    }
}

export const getApplications = async(req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job || job.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({message: 'Forbidden or Unauthorized'})
        }
        
        let applications = await client.get(`admin:applications:${req.params.id}`);
        if (applications !== null) {
            return res.status(200).json({data: JSON.parse(applications)})
        }

        applications = await Application.find({jobId: req.params.id}).sort({appliedAt: -1})
        await client.set(`admin:applications:${req.params.id}`, JSON.stringify(applications), { EX: 900})
        res.status(200).json({data: applications})
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({message: "Error fetching data"})
    }
}

export const updateApplications = async(req, res) => {
    try {

        const application = await Application.findById(req.params.id)

        if (!application) {
            return res.status(400).json({message: "Invalid application or Not Found"})
        }

        const job = await Job.findById(application.jobId)
    
        if (!job || req.user.userId !== job.createdBy.toString()) {
            return res.status(403).json({message: 'Forbidden or Unauthorized'})
        }
        
        const validation = updateApplicationSchema.safeParse(req.body);
    
        if(!validation.success){
            return res.status(400).json({message: 'Invalid Status Type'})
        }
    
        const update = {
            status: validation.data.status,
            reviewedAt: new Date(),
            reviewedBy: req.user.userId
        }
    
        await Application.findByIdAndUpdate(
            {_id: req.params.id},
            update,
            {new: true}
        )
        await client.del(`students:applications:${application.userId}`)
        res.status(200).json({message: 'Application updated successfully'})
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({message: 'Error performing the operation'})
    }
}
