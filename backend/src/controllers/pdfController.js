import PDF from "../models/pdfModel.js";
import { uploadFile } from "../utils/s3Client.js";
import pdfProcessingQueue from "../jobs/pdfProcessingQueue.js";

export const uploadPDF = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    const uploadResult = await uploadFile(file);

    const pdf = await PDF.create({
      userId: req.user._id,
      title,
      url: uploadResult.Location,
    });

    pdfProcessingQueue.add({ pdfId: pdf._id, pdfPath: uploadResult.Location });

    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload PDF" });
  }
};
