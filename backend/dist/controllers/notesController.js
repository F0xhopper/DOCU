export const addNote = async (res) => {
    try {
        res.status(201).json({ message: "Note added successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add note" });
    }
};
