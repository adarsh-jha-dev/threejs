import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { promises as fs } from "fs";

dotenv.config();

const router = express.Router();

const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const HUGGINGFACE_HEADERS = {
  Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
};

async function queryHuggingFaceAPI(data) {
  const response = await fetch(HUGGINGFACE_API_URL, {
    headers: HUGGINGFACE_HEADERS,
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.arrayBuffer();
  return result;
}

async function generateImage(caption) {
  try {
    const imageBytes = await queryHuggingFaceAPI({
      inputs: caption,
    });
    // Convert the image to base64
    const base64Image = Buffer.from(imageBytes).toString("base64");
    return base64Image;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error
  }
}

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from Hugging Face Routes" });
});

router.route("/").post(async (req, res) => {
  const { prompt } = req.body;
  try {
    const base64Image = await generateImage(prompt);
    res.status(200).json({ photo: base64Image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
