import fs from "fs";
import pdf from "pdf-parse";

// Function to extract text by page
const extractText = async (pdfPath) => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);

  const pages = data.text;
  const numberOfPages = data.numpages;
  return pages, numberOfPages;
};

export default extractText;
