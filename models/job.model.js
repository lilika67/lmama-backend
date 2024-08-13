const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true
  },
  Location: {
    type: String,
    required: true
  },
  publishedDate: {
    type: Date,
    required: false,
    default: new Date(),
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
  },
  
  // image: {
  //   type: String,
  //   default: "default.png",
  //   trim: true
  // },
 
});

const BlogModel = model('job', jobSchema);

module.exports = { JobModel };
