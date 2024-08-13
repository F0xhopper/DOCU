import Note from "../models/noteModel.js";
import elasticClient from "../utils/elasticClient.js";

export const addNote = async (req, res) => {
  try {
    const { content, pageNumber } = req.body;
    const { id: pdfId } = req.params;
    const userId = req.user._id;

    const note = await Note.create({
      pdfId,
      userId,
      pageNumber,
      content,
    });

    // Index the note in ElasticSearch
    await elasticClient.index({
      index: "notes",
      id: note._id.toString(),
      body: {
        pdfId,
        userId,
        pageNumber,
        content,
      },
    });

    res.status(201).json({ message: "Note added successfully", note });
  } catch (error) {
    res.status(500).json({ error: "Failed to add note" });
  }
};
