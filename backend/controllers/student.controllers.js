import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { z } from 'zod';
import client from "../config/redis.js";

const submitApplicationSchema = z.object({
    resume: z.string().url()
})

export const getJobs = async (req, res) => {
    try {
        let data = await client.get('student:jobs');

        if (data !== null) {
            return res.status(200).json({ data: JSON.parse(data) });
        }

        data = await Job.find({ closesAt: { $gt: new Date() } }).sort({ createdAt: -1 })
        await client.set('student:jobs', JSON.stringify(data), { EX: 3600 })
        res.status(200).json({ data })
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({ message: "Error fetching data" })
    }
}

export const getSingleJob = async (req, res) => {
    try {
        const data = await Job.findOne({ _id: req.params.id, closesAt: { $gt: new Date() } })

        if (!data) {
            return res.status(404).json({ message: "Job not found or expired" })
        }

        res.status(200).json({ data })
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({ message: "Some error occour" })
    }
}

export const submitApplication = async (req, res) => {
    try {
        const validation = submitApplicationSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ message: "Invalid Data Type" })
        }

        const data = await Application.findOne({ jobId: req.params.id, userId: req.user.userId })
        if (data) {
            return res.status(409).json({ message: 'Application Already submitted' })
        }

        await Application.create({
            userId: req.user.userId,
            jobId: req.params.id,
            resume: validation.data.resume
        })

        await Job.findByIdAndUpdate(req.params.id, { $inc: { applicationCount: 1 } });

        await Promise.all([
            client.del(`admin:applications:${req.params.id}`),
            client.del(`students:applications:${req.user.userId}`),
            client.del('student:jobs'),
        ]);
        
        res.status(201).json({ message: "Application Submitted Succesfully" })
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({ message: "Error Submitting Application" })
    }
}

export const getApplications = async (req, res) => {
    try {
        let data = await client.get(`students:applications:${req.user.userId}`);

        if (data !== null) {
            return res.status(200).json({ data: JSON.parse(data) })
        }

        data = await Application.find({ userId: req.user.userId })
        await client.set(`students:applications:${req.user.userId}`, JSON.stringify(data), { EX: 900 })
        res.status(200).json({ data })
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({ message: "error geting data", error: error })
    }
}

export const delApplication = async (req, res) => {
    try {
        const data = await Application.findById(req.params.id)
        if (!data) {
            return res.status(404).json({ message: 'No Such application exists' })
        }
        
        if (data.userId.toString() !== req.user.userId) {
            return res.status(403).json({message: "User cannot perform this action"})
        }
        await data.deleteOne()
        await Job.findByIdAndUpdate(data.jobId, { $inc: { applicationCount: -1 } });

        await client.del(`students:applications:${req.user.userId}`)
        res.status(200).json({ message: "Application Deleted Successfully" })
    } catch (error) {
        console.error("Some error occurred: ", error)
        res.status(500).json({ message: "Error Deleting Application" })
    }
}
