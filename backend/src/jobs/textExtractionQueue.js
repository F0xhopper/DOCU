import Queue from "bull";
import elasticClient from "../utils/elasticClient.js";
import PDF from "../models/pdfModel.js";
import Note from "../models/noteModel.js";
import extractTextFromPDF from "../utils/pdfTextExtractor.js"; // You would implement this function for text extraction

const textExtractionQueue = new Queue("textExtraction", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

textExtractionQueue.process(async (job, done) => {
  try {
    const { pdfId, fileUrl } = job.data;

    // Extract text from the PDF (assuming you have a utility function for this)
    const extractedText = await extractTextFromPDF(fileUrl);

    // Update the PDF document in MongoDB with the extracted text
    const pdf = await PDF.findByIdAndUpdate(
      pdfId,
      { text: extractedText },
      { new: true }
    );

    // Update or add the PDF document in ElasticSearch
    await elasticClient.index({
      index: "pdfs",
      id: pdf._id.toString(),
      body: {
        userId: pdf.userId,
        title: pdf.title,
        text: extractedText,
        url: pdf.url,
      },
    });

    // Also index associated notes
    const notes = await Note.find({ pdfId: pdf._id });
    for (let note of notes) {
      await elasticClient.index({
        index: "notes",
        id: note._id.toString(),
        body: {
          pdfId: note.pdfId,
          userId: note.userId,
          pageNumber: note.pageNumber,
          content: note.content,
        },
      });
    }

    done();
  } catch (error) {
    console.error("Error processing text extraction job:", error);
    done(new Error("Failed to process text extraction"));
  }
});

export default textExtractionQueue;
