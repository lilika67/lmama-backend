const { BlogModel } = require('../models/job.model');
const errorHandler = require('../errors/errorHandler');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Multer upload configuration
const upload = multer({ storage: storage });

// Function to add a new blog
const addBlog = async (req, res, next) => {
  try {
    const { title, introduction,description, author } = req.body;

    let image = req.file ? req.file.filename : "";

    let existBlog = await BlogModel.findOne({ title: title, author: author });

    if (existBlog) {
      return next(errorHandler(409, "This blog already exists and it can't be added twice"));
    } else {
      
      const addedBlog = await BlogModel.create({
        title: title,
        introduction: introduction,
        description: description,
        author: author,
        image: image,
        comments: [],
        likes: 0
      });

      res.status(201).json({
        message: "Your blog was added successfully!",
        blog: addedBlog
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//function to add a comment to the blog
const addComment = async (req, res) => {
  try {
     const { author, comment } = req.body;
    
    const blogId = req.params.id;
    
    if (!blogId) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const ObjectId = mongoose.Types.ObjectId;
    const blogObjId = new ObjectId(blogId);
    const comments = {
      author:author,comment:comment}

      const updateBlog = await BlogModel.findOneAndUpdate({_id: blogObjId},{
        $push: {comments:comments}
      },{
        new: true,
        
      })
   res.status(201).json({ message: "Thank you for your comment✌️✌️", comments: updateBlog });
  } catch (err) {
    console.error(err);
    console.log(err);
  }
};

//funcion to getBlog comments
const getComments = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comments = blog.comments;

    res.json({ comments: comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//function to like a blog

const likeBlog = async (req, res) => {
  try {
    const { likes } = req.body;

    const singleBlog = await BlogModel.findOne({ _id: req.params.id });

    
    if (singleBlog) {
      
      singleBlog.likes += 1;
      
      
      const updatedBlog = await singleBlog.save();

    
      res.status(201).json({ message: "Like added to the blog", likes: updatedBlog.likes });
    } else {
      
      res.status(404).json({ message: "Blog post not found" });
    }
  } catch (err) {
    
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLikes = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const likes = blog.likes;

    res.json({ likes: likes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}





const listBlog = async (req, res, next) => {
  try{
    var allblogs = await BlogModel.find({});
    res.status(200).json({
      allblogs
    });
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
}
const findById = async (req, res, next) => {

  try {
    let blogId = req.params.id;
    var foundblog = await BlogModel.findById(blogId);
    if(foundblog === null){
      return res.status(404).json({message:"blog not found"})
    } 
    res.status(200).json({
      blog: foundblog
  });
} catch (error) {
  console.log(error);
  res.status(500).send(error);
}
  }
  
  const deleteBlog = async (req, res, next) =>{
    try{
      var deletedblog = await BlogModel.findByIdAndDelete(req.params.id);
      if (deletedblog) {
        res.status(200).json({ message: "The blog was Deleted...." });
      } else {
        res.status(400).json({message: "blog not found!"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  const updateBlog = async (req, res, next) => {
    try {
      
      const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({
        message: "Your blog was updated successfully",
        blog
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred while updating the blog" });
    }
   
};


module.exports = {
  findById, 
  listBlog, 
  deleteBlog,
  recordBlog: addBlog, 
  updateBlog,
  addComment,
  getComments,
  likeBlog,
  getLikes
  
  
}