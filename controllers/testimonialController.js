import testimonialModel from "../models/testimonialModel.js";

export const addTestimony = async(req,res)=>{
  try{

    const {testimony} = req.body;
    const newTestimony = new testimonialModel({testimony});
    await newTestimony.save();
    res.status(201).json({message: "Testimony added successfully!",newTestimony })
   

  } catch(error){
    console.log(error);
  }
}