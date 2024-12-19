import PDF from "../models/pdfModel.js";
import { uploadFile } from "../utils/s3Client.js";
import pdfProcessingQueue from "../jobs/pdfProcessingQueue.js";
import extractTextFromPDF from "../utils/pdfExtractor.js";

export const uploadPDF = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResult = await uploadFile(req.file);

    // Extract text from the PDF
    let extractedData;
    try {
      extractedData = await extractTextFromPDF(req.file.buffer);
    } catch (textError) {
      console.error("Text extraction error:", textError);
      return res
        .status(500)
        .json({ error: "Failed to extract text from the uploaded PDF" });
    }

    const { pages, numOfPages } = extractedData;
    const { title } = req.body;
    // Save PDF metadata and extracted text in the database
    let pdf;
    try {
      pdf = await PDF.create({
        userId: req.user._id,
        title,
        url: uploadResult.Location, // S3 URL
        pageCount: numOfPages,
        pages: pages.map((text, index) => ({ pageNumber: index + 1, text })),
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res
        .status(500)
        .json({ error: "Failed to save PDF information to the database" });
    }

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
export const getPDFById = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Fetch the PDF metadata from the database using the provided ID
    const pdf = await PDF.findById(id);

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Get the file key from the database (this should be the path in S3)
    const pdfUrl = pdf.url; // Assuming `pdf.url` stores the S3 file key (not the full URL)
    res.json({ fileUrl: pdfUrl });
  } catch (error) {
    console.error("Error fetching PDF:", error);
    const err = error as Error;
    res.status(500).json({
      error: "Failed to retrieve PDF from the server",
      details: err.message,
    });
  }
};
export const getAllPDF = async (req: any, res: any) => {
  try {
    // Fetch all PDFs metadata from the database
    const pdfs = await PDF.find();

    if (!pdfs || pdfs.length === 0) {
      return res.status(404).json({ error: "No PDFs found" });
    }

    // Map over the results to return the URL, user ID, and title for each PDF
    const pdfDetails = pdfs.map((pdf: any) => ({
      fileUrl: pdf.url, // Assuming `pdf.url` stores the full S3 URL
      userId: pdf.userId, // Assuming `pdf.userId` stores the ID of the user who uploaded it
      title: pdf.title, // Assuming `pdf.title` stores the title of the PDF
    }));

    // Send the list of PDFs with the required details
    res.json(pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    const err = error as Error;
    res.status(500).json({
      error: "Failed to retrieve PDFs from the server",
      details: err.message,
    });
  }
};
