import PDF from "../models/pdfModel.js";
import { uploadFile } from "../utils/s3Client.js";
import pdfProcessingQueue from "../jobs/pdfProcessingQueue.js";

export const uploadPDF = async (req, res) => {
  try {
    const { title, file } = req.body;

    // Check if the title and file are provided
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    // Attempt to upload the file to S3
    let uploadResult;
    try {
      uploadResult = await uploadFile(file);
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      return res.status(500).json({ error: "Failed to upload file to S3" });
    }

    // Create a new PDF record in the database
    let pdf;
    try {
      pdf = await PDF.create({
        userId: req.user._id,
        title,
        url: uploadResult.Location,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res
        .status(500)
        .json({ error: "Failed to save PDF information to the database" });
    }

    // Add a job to the processing queue
    try {
      await pdfProcessingQueue.add({
        pdfId: pdf._id,
        pdfPath: uploadResult.Location,
      });
    } catch (queueError) {
      console.error("Queue job error:", queueError);
      // Optionally handle queue errors without affecting the response
    }

    // Respond with success
    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    // General error handling
    console.error("General error:", error);
    res
      .status(500)
      .json({ error: "Failed to upload PDF", details: error.message });
  }
};
