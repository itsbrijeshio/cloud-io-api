import { Router } from "express";
import { FileController } from "../../controllers";
import { uploadFile } from "../../config";
import { validateRequest } from "../../middlewares";
import { renameSchema, moveSchema } from "../../schema/file";
import { Schema } from "zod";

const fileController = new FileController();

const router = Router();

const isValid = () => validateRequest.isValid("params", "_id", "File");
const validate = (schema: Schema) => validateRequest(schema, "body");

router.post("/", uploadFile.single("file"), fileController.handleUploadFile);
router.get("/:_id", isValid(), fileController.handleGetFile);
router.get("/download/:_id", isValid(), fileController.handleDownloadFile);
router.put(
  "/:_id",
  isValid(),
  validate(renameSchema),
  fileController.handleRenameFile
);
router.put(
  "/move/:_id",
  isValid(),
  validate(moveSchema),
  fileController.handleMoveFile
);
router.delete("/:_id", isValid(), fileController.handleDeleteFile);

export default router;
