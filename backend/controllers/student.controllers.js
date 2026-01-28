import Application from "../models/application.js";
import Job from "../models/job.js";
import { z } from 'zod';
import client from "../config/redis.js";

const submitApplicationSchema = z.object({
    resume: z.string().url()
})

export const getJobs = async (req, res) => {
    try {
        let jobs = await client.get('student:jobs');

        if (jobs !== null) {
            return res.status(200).json({ jobs: JSON.parse(jobs) });
        }

        jobs = await Job.find({ closesAt: { $gt: new Date() } }).sort({ createdAt: -1 })
        await client.set('student:jobs', JSON.stringify(jobs), { EX: 3600 })
        res.status(200).json({ jobs })
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" })
    }
}

export const getSingleJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, closesAt: { $gt: new Date() } })

        if (!job) {
            return res.status(404).json({ message: "Job not found or expired" })
        }

        res.status(200).json(job)
    } catch (error) {
        res.status(500).json({ message: "Some error occour" })
    }
}

export const submitApplication = async (req, res) => {
    try {
        const application = await Application.findOne({ jobId: req.params.id, userId: req.user.userId })
        if (application) {
            return res.status(409).json({ message: 'Application Already submitted' })
        }

        const validation = submitApplicationSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ message: "Invalid Data Type" })
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
        res.status(500).json({ message: "Error Submitting Application" })
    }
}

export const getApplications = async (req, res) => {
    try {
        let applications = await client.get(`students:applications:${req.user.userId}`);

        if (applications !== null) {
            return res.status(200).json({ applications: JSON.parse(applications) })
        }

        applications = await Application.find({ userId: req.user.userId })
        await client.set(`students:applications:${req.user.userId}`, JSON.stringify(applications), { EX: 900 })
        res.status(200).json({ applications })
    } catch (error) {
        res.status(500).json({ message: "error geting data", error: error })
    }
}

export const delApplication = async (req, res) => {
    try {
        const application = await Application.findOne({ jobId: req.params.id, userId: req.user.userId })

        if (!application) {
            return res.status(404).json({ message: 'No Such application exists' })
        }

        await Application.findOneAndDelete({ _id: application._id })
        await client.del(`students:applications:${req.user.userId}`)
        res.status(200).json({ message: "Application Deleted Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error Deleting Application" })
    }
}
