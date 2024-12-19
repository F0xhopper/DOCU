import React, { useState, useRef, useEffect } from "react";

interface PdfDocument {
  userId: string;
  title: string;
  url: string;
  pageCount: number;
  pages: { pageNumber: number; text: string }[];
}
const UploadPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [fetchedPdfs, setFetchedPdfs] = useState<PdfDocument[] | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const fetchPdfs = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const response = await fetch(`${apiUrl}/pdfs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to the Authorization header
        },
      });
      const data = response.json();
      if (response) {
        setFetchedPdfs(await data);
      }
    } catch (err) {
      console.log("An error has occured fetching PDFs:" + err);
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    if (!title) {
      setMessage("Please enter a title for the PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    const token = sessionStorage.getItem("accessToken");

    try {
      const response = await fetch(`${apiUrl}/pdfs/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to the Authorization header
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.error || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      setFile(null);
      setMessage(`Upload successful! PDF ID: ${data.pdf._id}`);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("An error occurred while uploading the PDF.");
    }
  };

  const handleClear = () => {
    setFile(null);
    setTitle("");
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear the file input
  };
  useEffect(() => {
    fetchPdfs();
  }, []);

  return (
    <div>
      <h2>Upload PDF</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="file">Choose PDF:</label>
          <input
            type="file"
            id="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Upload</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>
      {message && <p>{message}</p>}
      <h4>Stored PDFs</h4>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fetchedPdfs?.map((pdf) => {
          return (
            <div style={{ border: "1px solid black", margin: "10px" }}>
              <div>
                <a href={pdf.url} target="_blank">
                  {pdf.title}
                </a>
                <p>Page Count: {pdf.pageCount}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadPDF;
