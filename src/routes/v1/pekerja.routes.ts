import { Router } from "express";

import * as pekerjaController from "@/controllers/pekerja.controller";

const router = Router();

router.get("/", pekerjaController.GetListPekerjaController);
router.get("/:id", pekerjaController.GetPekerjaByIdController);
router.post("/", pekerjaController.CreatePekerjaController);
router.put("/:id", pekerjaController.UpdatePekerjaController);
router.delete("/:id", pekerjaController.DeletePekerjaController);

export default router;
