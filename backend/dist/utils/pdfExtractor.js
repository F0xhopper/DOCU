import pdf from "pdf-parse";
// Function to extract text by page
const extractTextFromPDF = async (fileBuffer) => {
    try {
        const data = await pdf(fileBuffer);
        const pages = data.text.split("\n\n"); // Split text into pages
        const numOfPages = data.numpages;
        return { pages, numOfPages };
    }
    catch (error) {
        console.error("Error extracting text:", error);
        throw new Error("Failed to extract text from PDF");
    }
};
export default extractTextFromPDF;
