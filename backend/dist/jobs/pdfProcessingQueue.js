import Queue from "bull";
import PDF from "../models/pdfModel.js";
import extractText from "../utils/pdfExtractor.js";
const pdfProcessingQueue = new Queue("pdfProcessing", {
    redis: {
        host: "127.0.0.1",
        port: 6379,
    },
});
pdfProcessingQueue.process(async (job, done) => {
    try {
        const { pdfId, pdfPath } = job.data;
        // Extract text from the PDF
        const { pages, numOfPages } = await extractText(pdfPath);
        // Update the PDF document with the number of pages
        const updatedPDF = await PDF.findByIdAndUpdate(pdfId, { pageCount: numOfPages }, // Update the pageCount field
        { new: true } // Return the updated document
        );
        if (!updatedPDF) {
            throw new Error("PDF metadata for page update not found");
        }
        // Prepare the pages array for insertion
        const operations = pages.map((page, i) => ({
            updateOne: {
                filter: { _id: pdfId },
                update: { $push: { pages: { pageNumber: i, text: page } } },
                upsert: true,
            },
        }));
        const pageInserts = PDF.bulkWrite(operations)
            .then((result) => {
            console.log("Bulk update result:", result);
        })
            .catch((err) => {
            console.error("Bulk update error:", err);
        });
        // Wait for all page inserts to finish
        const result = await PDF.bulkWrite(operations);
        console.log("Bulk update result:", result);
        done();
    }
    catch (error) {
        console.error("Error processing text extraction job:", error);
        done(new Error("Failed to process text extraction"));
    }
});
export default pdfProcessingQueue;
