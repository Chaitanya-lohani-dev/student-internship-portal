import Application from '../models/application.js';
import Job from '../models/job.js';
import { z } from 'zod';

const createJobSchema = z.object({
    title: z.string().min(10),
    description: z.string().min(200),
    closesAt: z.string().datetime()
})

const updateJobSchema = z.object({
    title: z.string().min(10).optional(),
    description: z.string().min(200).optional(),
    closesAt: z.string().datetime().optional()
})

export const createJob = async(req, res) => {
    const validation = createJobSchema.safeParse(req.body);

    if(!validation.success) {
        return res.status(400).json({message: 'Invalid Data', error: validation.error})
    }

    const {title, description, closesAt} = validation.data;

    await Job.create({
        title,
        description,
        closesAt,
        createdBy: req.user.userId
    })

    res.status(201).json({message: 'Job Created Successfully'})
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
    
        const job = await Job.findByIdAndUpdate(
            {_id: req.params.id, createdBy: req.user.userId},
            update,
            {new: true}
        )
    
        if (!job){
            return res.status(404).json({message: 'Invalid Job or Unauthorized'})
        }
    
        res.status(200).json(job)
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const getJobs = async(req, res) => {
    try {
        const data = await Job.find({createdBy: req.user.userId}).sort({createdAt: -1})
        res.status(200).json({data: data})
    } catch (error) {
        res.status(500).json({message: 'Database error fetching data.'})
    }
}

export const getApplications = async(req, res) => {

}

export const updateApplications = async(req, res) => {

}