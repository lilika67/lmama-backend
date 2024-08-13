import express from 'express';
import { addTestimony , getTestimonial } from '../controllers/testimonialController.js';

const testimonialRouter = express.Router();

testimonialRouter.post('/', addTestimony);
testimonialRouter.get('/', getTestimonial);

export default testimonialRouter;