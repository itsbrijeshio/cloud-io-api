import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // Relations
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    // For quick navigation
    path: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }], // breadcrumbs
  },
  { timestamps: true }
);

FolderSchema.pre("save", async function (next) {
  if (!this.parent) {
    // Root folder → no parent, empty path
    this.path = [];
  } else {
    // Find parent folder
    const parentFolder = await mongoose.model("Folder").findById(this.parent);
    if (parentFolder) {
      // Inherit parent's path + add parentId
      this.path = [...parentFolder.path, parentFolder._id];
    }
  }
  next();
});

export default mongoose.model("Folder", FolderSchema);
