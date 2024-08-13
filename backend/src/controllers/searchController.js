import elasticClient from "../utils/elasticClient.js";

export const searchDocuments = async (req, res) => {
  try {
    const { query } = req.query;

    // Search PDFs and Notes in parallel
    const [pdfResults, noteResults] = await Promise.all([
      elasticClient.search({
        index: "pdfs",
        body: {
          query: {
            match: { text: query },
          },
        },
      }),
      elasticClient.search({
        index: "notes",
        body: {
          query: {
            match: { content: query },
          },
        },
      }),
    ]);

    // Combine the results from both indices
    const pdfHits = pdfResults.body.hits.hits.map((hit) => ({
      type: "pdf",
      data: hit._source,
    }));
    const noteHits = noteResults.body.hits.hits.map((hit) => ({
      type: "note",
      data: hit._source,
    }));

    const results = [...pdfHits, ...noteHits];

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: "Failed to search documents" });
  }
};
