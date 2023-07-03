const mongoose = require("mongoose");
let jobSchema = new mongoose.Schema({
  companyName: String,
  logoURL: String,
  jobPosition: String,
  salary: Number,
  jobType: String,
  jobMode: String,
  location: String,
  jobDescription: String,
  aboutCompany: String,
  skillsRequired: String,
});
module.exports = mongoose.model("jobDetails", jobSchema);
