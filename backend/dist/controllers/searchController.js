import PDF from "../models/pdfModel.js";
export const searchPDFs = async (req, res) => {
    try {
        const query = req.query;
        const results = await PDF.aggregate([
            {
                $search: {
                    index: "default", // Use the name of your search index
                    text: {
                        query: query,
                        path: "pages.text", // Field to search within
                        fuzzy: { maxEdits: 1 }, // Optional: enable fuzzy search
                    },
                },
            },
            {
                $project: {
                    title: 1,
                    url: 1,
                    pageCount: 1,
                    pages: {
                        $filter: {
                            input: "$pages",
                            as: "page",
                            cond: {
                                $regexMatch: {
                                    input: "$$page.text",
                                    regex: query,
                                    options: "i",
                                },
                            },
                        },
                    },
                },
            },
        ]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No matching pages found" });
        }
        res.status(200).json({ results });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to search PDF pages" });
    }
};
