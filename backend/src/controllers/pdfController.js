import PDF from "../models/pdfModel.js";
import { uploadFile } from "../utils/s3Client.js";
import textExtractionQueue from "../queues/textExtractionQueue.js";
import elasticClient from "../utils/elasticClient.js";

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

    textExtractionQueue.add({ pdfId: pdf._id, fileUrl: uploadResult.Location });

    // Index the PDF in ElasticSearch
    await elasticClient.index({
      index: "pdfs",
      id: pdf._id.toString(),
      body: {
        userId: req.user._id,
        title,
        text: "", // You can update this with the extracted text later
        url: uploadResult.Location,
      },
    });

    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload PDF" });
  }
};
