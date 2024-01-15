import { Router } from "express";

// import validate from "@/middlewares/validate.middleware";
import * as pegawaiController from "@/controllers/pegawai.controller";
// import {
//   CreatePegawaiSchema,
//   UpdatePegawaiSchema,
// } from "@/validations/pegawai.validation";

const router = Router();

router.get("/", pegawaiController.GetListPegawaiController);

router.get("/:id", pegawaiController.GetPegawaiByIdController);

router.post("/", pegawaiController.CreatePegawaiController);

router.put("/:id", pegawaiController.UpdatePegawaiController);

router.delete("/:id", pegawaiController.DeletePegawaiController);

export default router;
