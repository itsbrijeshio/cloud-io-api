import { Router } from "express";
import { FolderController } from "../../controllers";
import { validateRequest } from "../../middlewares";
import { createSchema, renameSchema, moveSchema } from "../../schema/folder";
import { Schema } from "zod";

const folderController = new FolderController();

const router = Router();

const isValid = () => validateRequest.isValid("params", "_id", "Folder");
const validate = (schema: Schema) => validateRequest(schema, "body");

router.post("/", validate(createSchema), folderController.handleNewFolder);
router.get("/", folderController.handleGetRootFolders);
router.get("/:_id", isValid(), folderController.handleGetFolder);
router.put(
  "/:_id",
  isValid(),
  validate(renameSchema),
  folderController.handleRenameFolder
);
router.put(
  "/move/:_id",
  isValid(),
  validate(moveSchema),
  folderController.handleMoveFolder
);
router.delete("/:_id", isValid(), folderController.handleDeleteFolder);

export default router;
