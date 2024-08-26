import Note from "../models/noteModel.js";

export const addNote = async (req, res) => {
  try {
    res.status(201).json({ message: "Note added successfully", note });
  } catch (error) {
    res.status(500).json({ error: "Failed to add note" });
  }
};
