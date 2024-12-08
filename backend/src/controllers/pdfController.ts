import PDF from "../models/pdfModel.js";
import { uploadFile } from "../utils/s3Client.js";
import pdfProcessingQueue from "../jobs/pdfProcessingQueue.js";
import extractTextFromPDF from "../utils/pdfExtractor.js";

export const uploadPDF = async (req: any, res: any) => {
  try {
    const { title, file } = req.body;

    // Validate title and file
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    // Upload the file to S3
    let uploadResult;
    try {
      uploadResult = await uploadFile(file.buffer); // uploadFile should handle S3 upload
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      return res.status(500).json({ error: "Failed to upload file to S3" });
    }

    // // Extract text from the PDF
    // let extractedData;
    // try {
    //   extractedData = await extractTextFromPDF(file);
    // } catch (textError) {
    //   console.error("Text extraction error:", textError);
    //   return res
    //     .status(500)
    //     .json({ error: "Failed to extract text from the uploaded PDF" });
    // }

    // const { pages, numOfPages } = extractedData;

    // // Save PDF metadata and extracted text in the database
    // let pdf;
    // try {
    //   pdf = await PDF.create({
    //     userId: req.user._id,
    //     title,
    //     url: uploadResult.Location, // S3 URL
    //     pageCount: numOfPages,
    //     pages: pages.map((text, index) => ({ pageNumber: index + 1, text })),
    //   });
    // } catch (dbError) {
    //   console.error("Database error:", dbError);
    //   return res
    //     .status(500)
    //     .json({ error: "Failed to save PDF information to the database" });
    // }

    // // Add a job to the processing queue (if further processing is required)
    // try {
    //   await pdfProcessingQueue.add({
    //     pdfId: pdf._id,
    //     pdfPath: uploadResult.Location,
    //   });
    // } catch (queueError) {
    //   console.error("Queue job error:", queueError);
    //   // Handle queue errors gracefully without affecting the response
    // }

    // Respond with success
    res
      .status(201)
      .json({ message: "PDF uploaded and processed successfully", pdf });
  } catch (error) {
    console.error("General error:", error);
    const err = error as Error;
    res.status(500).json({
      error: "Failed to upload and process PDF",
      details: err.message,
    });
  }
};
