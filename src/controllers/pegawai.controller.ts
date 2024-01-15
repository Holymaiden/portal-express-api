import { Response } from "express";

import httpstatus from "@/config/http-status";
import logger from "@/utils/logger.utils";
import { TypedRequest } from "@/types/types";
import {
  GetPegawaiById,
  CreatePegawai,
  DeletePegawai,
  GetListPegawai,
  UpdatePegawai,
} from "@/models/pegawai.models";
import { PegawaiInterface } from "@/interfaces/pegawai.interface";
import { paginate } from "@/utils/pagination.util";
import { PaginationInterface } from "@/interfaces/pagination.interface";
import { setFiles, upload } from "@/utils/upload.util";

export const GetPegawaiByIdController = async (
  req: TypedRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  if (!id) {
    logger.error(["GetPegawaiByIdController", "id is required", id]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "id is required",
    });
  }

  try {
    const pegawai = await GetPegawaiById({ id: id });

    if (!pegawai) {
      logger.error(["GetPegawaiByIdController", "pegawai not found", id]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "pegawai not found",
      });
    }

    logger.info(["GetPegawaiByIdController", "pegawai found", id]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: pegawai,
      message: "pegawai found",
    });
  } catch (error) {
    logger.error(["GetPegawaiByIdController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const GetListPegawaiController = async (
  req: TypedRequest<PaginationInterface>,
  res: Response
) => {
  const { page, limit, search, sort, order }: PaginationInterface = req.query;

  try {
    const pegawai = await GetListPegawai(page, limit, search, sort, order);

    if (!pegawai || pegawai?.length === 0) {
      logger.error(["GetListPegawaiController", "list pegawai not found"]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "list pegawai not found",
      });
    }

    const paging = await paginate(page, limit, pegawai?.length);

    logger.info(["GetListPegawaiController", "list pegawai found"]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: pegawai,
      paging: paging,
      message: "list pegawai found",
    });
  } catch (error) {
    console.log(error);
    logger.error(["GetListPegawaiController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const CreatePegawaiController = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: TypedRequest<PegawaiInterface> | any,
  res: Response
) => {
  try {
    upload.fields([
      { name: "picture", maxCount: 1 },
      { name: "job_pic", maxCount: 1 },
    ])(req, res, async (error) => {
      if (error) {
        logger.error(["CreatePegawaiController", error]);
        return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          data: null,
          message: error,
        });
      }
      if (!req.body) {
        logger.error(["CreatePegawaiController", "body is required"]);
        return res.status(httpstatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: "body is required",
        });
      }

      let data = req.body;

      if (req.files) {
        data = setFiles(data, req.files, ["picture", "job_pic"]);
      }

      try {
        const checkExist = await GetPegawaiById({
          phone_number: data.phone_number,
        });
        if (checkExist) {
          logger.error(["CreatePegawaiController", "Pegawai already exist"]);
          return res.status(httpstatus.BAD_REQUEST).json({
            success: false,
            data: null,
            message: "Pegawai already exist",
          });
        }

        const pegawai = await CreatePegawai(data);
        logger.info(["CreatePegawaiController", "pegawai created"]);
        return res.status(httpstatus.OK).json({
          success: true,
          data: pegawai,
          message: "pegawai created",
        });
      } catch (error) {
        console.log(error);
        logger.error(["CreatePegawaiController", error]);
        return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          data: null,
          message: error,
        });
      }
    });
  } catch (error) {
    logger.error(["CreatePegawaiController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const UpdatePegawaiController = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: TypedRequest<PegawaiInterface> | any,
  res: Response
) => {
  try {
    upload.fields([
      { name: "picture", maxCount: 1 },
      { name: "job_pic", maxCount: 1 },
    ])(req, res, async (error) => {
      if (error) {
        logger.error(["CreatePegawaiController", error]);
        return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          data: null,
          message: error,
        });
      }
      if (!req.body) {
        logger.error(["CreatePegawaiController", "body is required"]);
        return res.status(httpstatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: "body is required",
        });
      }

      const { id } = req.params;
      if (!id) {
        logger.error(["UpdatePegawaiController", "id is required", id]);
        return res.status(httpstatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: "id is required",
        });
      }

      let data = req.body;

      if (req.files) {
        data = setFiles(data, req.files, ["picture", "job_pic"]);
      }

      try {
        data.id = id as string;

        const pegawai = await UpdatePegawai(data as PegawaiInterface);

        if (!pegawai) {
          throw new Error("Pegawai not found");
        }

        logger.info(["UpdatePegawaiController", "pegawai updated", id]);
        return res.status(httpstatus.OK).json({
          success: true,
          data: pegawai,
          message: "pegawai updated",
        });
      } catch (error) {
        logger.error(["UpdatePegawaiController", error]);
        return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          data: null,
          message: error,
        });
      }
    });
  } catch (error) {
    logger.error(["UpdatePegawaiController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const DeletePegawaiController = async (
  req: TypedRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  if (!id) {
    logger.error(["DeletePegawaiController", "id is required", id]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "id is required",
    });
  }

  try {
    const pegawai = await DeletePegawai(id as string);
    logger.info(["DeletePegawaiController", "pegawai deleted", id]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: pegawai,
      message: "pegawai deleted",
    });
  } catch (error) {
    logger.error(["DeletePegawaiController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};
