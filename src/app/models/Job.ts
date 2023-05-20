import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    company: {
    type: String,
    required: [true, 'Please provide the company name for this job.'],
  },
  title: {
    type: String,
    required: [true, "Please provide the job title."]
  },
  URL: {
    type: String,
    required: [true, 'Please provide the URL of the job posting.'],
  },
  jobDescription: {
    type: String,
  },
  location: {
    type: String,
    required: [true, "Please provide the job location."]
  },
  applicationRoute: {
    type: String,
    required: [true, "Please provide the application route or method for this job posting."],
    enum: {
        values:  ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"],
        message: '{VALUE} is not supported'
      }
  },
  dateApplied: {
    required: [true, 'Please provide the data you applied or found this job posting.'],
    type: String,
  },
  outreachContact: {
    type: String,
  },
  appStatus: {
    required: [true, 'Please provide the current status of this job application.'],
    type: String,
    enum: {
        values: ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Rejected", "Completed Phone Screen; Awaiting Interview", "Completed Interview Round; Awaiting Next Round", "Completed Interview; Awaiting Hiring Decision", "Hired"],
        message: '{VALUE} is not supported'
      }
  },
  emailFollowup: {
    type: String,
    required: [true, 'Please provide the current status of this job application.'],
    enum: {
        values: ['yes', 'no'],
        message: '{VALUE} is not supported'
      }
  },
})

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
