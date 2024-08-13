import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
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
    text: {
      type: String,
      default: "", // Optional: You might choose not to store text in MongoDB if it's indexed in ElasticSearch.
    },
  },
  { timestamps: true }
);

export default mongoose.model("PDF", pdfSchema);
