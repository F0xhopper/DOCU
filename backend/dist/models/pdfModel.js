import mongoose from "mongoose";
const pdfSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    pageCount: {
        type: Number,
        required: true,
    },
    pages: [
        {
            pageNumber: {
                type: Number,
                required: true,
            },
            text: {
                type: String,
                default: "",
            },
        },
    ],
}, { timestamps: true });
export default mongoose.model("PDF", pdfSchema);
