import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String }, // mime type: image/png, application/pdf
    size: { type: Number, required: true }, // bytes

    // Relations
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    // For quick navigation
    path: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }], // breadcrumbs

    // Storage
    storagePath: { type: String, required: true }, // S3/GCS/local path
    isDeleted: { type: Boolean, default: false }, // soft delete support
  },
  { timestamps: true }
);

FileSchema.pre("save", async function (next) {
  if (!this.folder) {
    // Root folder → no parent, empty path
    this.path = [];
  } else {
    // Find parent folder
    const parentFolder = await mongoose.model("Folder").findById(this.folder);
    if (parentFolder) {
      // Inherit parent's path + add parentId
      this.path = [...parentFolder.path, parentFolder._id];
    }
  }
  next();
});

export default mongoose.model("File", FileSchema);
