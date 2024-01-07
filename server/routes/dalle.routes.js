import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

router.route("/").post(async (req, res) => {
  const { prompt } = req.body;
  try {
    const image = await openai.images.generate({
      prompt,
      n: 1,
      response_format: "b64_json",
      size: "1024x1024",
    });
    res.status(200).json({ photo: image.data.data[0].b64_json });
  } catch (err) {
    res.send(err);
  }
});

export default router;
