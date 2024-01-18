import { Response } from "express";

import httpstatus from "@/config/http-status";
import logger from "@/utils/logger.utils";
import { TypedRequest } from "@/types/types";
import { paginate } from "@/utils/pagination.util";
import { PaginationInterface } from "@/interfaces/pagination.interface";
import {
  CreatePekerja,
  DeletePekerja,
  GetPekerjaById,
  GetPekerjaList,
  UpdatePekerja,
} from "@/models/pekerja.models";
import { PekerjaInterface } from "@/interfaces/pekerja.interface";
import isPhoneNumber from "@/utils/isPhoneNumber.util";

export const GetListPekerjaController = async (
  req: TypedRequest<PaginationInterface>,
  res: Response
) => {
  const { page, limit, search, sort, order }: PaginationInterface = req.query;

  try {
    const pekerja: PekerjaInterface[] | null = await GetPekerjaList(
      page,
      limit,
      search,
      sort,
      order
    );

    if (!pekerja || pekerja?.length === 0) {
      logger.error(["GetListPekerjaController", "list pekerja not found"]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "list pekerja not found",
      });
    }

    const paging = await paginate(page, limit, pekerja?.length);

    logger.info(["GetListPekerjaController", "list pekerja found"]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: pekerja,
      paging: paging,
      message: "list pekerja found",
    });
  } catch (error) {
    console.log(error);
    logger.error(["GetListPekerjaController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const GetPekerjaByIdController = async (
  req: TypedRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  if (!id) {
    logger.error(["GetPekerjaByIdController", "id is required", id]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "id is required",
    });
  }

  try {
    const pekerja = await GetPekerjaById({ id: id });

    if (!pekerja) {
      logger.error(["GetPekerjaByIdController", "pekerja not found", id]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "pekerja not found",
      });
    }

    logger.info(["GetPekerjaByIdController", "pekerja found", id]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: pekerja,
      message: "pekerja found",
    });
  } catch (error) {
    console.log(error);
    logger.error(["GetPekerjaByIdController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const CreatePekerjaController = async (
  req: TypedRequest<PekerjaInterface>,
  res: Response
) => {
  try {
    const pekerja = await GetPekerjaById({
      phone_number: req.body.phone_number,
    });
    if (pekerja) {
      logger.error(["CreatePekerjaController", "pekerja already exist"]);
      return res.status(httpstatus.CONFLICT).json({
        success: false,
        data: null,
        message: "pekerja already exist",
      });
    }

    if (!isPhoneNumber(req.body.phone_number as string)) {
      logger.error(["CreatePekerjaController", "phone number is not valid"]);
      return res.status(httpstatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: "phone number is not valid",
      });
    }

    const newPekerja = await CreatePekerja(req.body as PekerjaInterface);

    if (!newPekerja) {
      logger.error(["CreatePekerjaController", "pekerja not created"]);
      return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "pekerja not created",
      });
    }

    logger.info(["CreatePekerjaController", "pekerja created"]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: newPekerja,
      message: "pekerja created",
    });
  } catch (error) {
    console.log(error);
    logger.error(["CreatePekerjaController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const UpdatePekerjaController = async (
  req: TypedRequest<PekerjaInterface>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error(["UpdatePekerjaController", "id is required", id]);
      return res.status(httpstatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: "id is required",
      });
    }

    const pekerja = await GetPekerjaById({ id: id });

    if (!pekerja) {
      logger.error(["UpdatePekerjaController", "pekerja not found", id]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "pekerja not found",
      });
    }

    if (!isPhoneNumber(req.body.phone_number as string)) {
      logger.error(["UpdatePekerjaController", "phone number is not valid"]);
      return res.status(httpstatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: "phone number is not valid",
      });
    }

    const updatedPekerja = await UpdatePekerja({
      id: id,
      ...req.body,
    } as PekerjaInterface);

    if (!updatedPekerja) {
      logger.error(["UpdatePekerjaController", "pekerja not updated", id]);
      return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "pekerja not updated",
      });
    }

    logger.info(["UpdatePekerjaController", "pekerja updated", id]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: updatedPekerja,
      message: "pekerja updated",
    });
  } catch (error) {
    console.log(error);
    logger.error(["UpdatePekerjaController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};

export const DeletePekerjaController = async (
  req: TypedRequest<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.error(["DeletePekerjaController", "id is required", id]);
      return res.status(httpstatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: "id is required",
      });
    }

    const pekerja = await GetPekerjaById({ id: id });

    if (!pekerja) {
      logger.error(["DeletePekerjaController", "pekerja not found", id]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "pekerja not found",
      });
    }

    const deletedPekerja = await DeletePekerja(id.toString());

    if (!deletedPekerja) {
      logger.error(["DeletePekerjaController", "pekerja not deleted", id]);
      return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "pekerja not deleted",
      });
    }

    logger.info(["DeletePekerjaController", "pekerja deleted", id]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: deletedPekerja,
      message: "pekerja deleted",
    });
  } catch (error) {
    console.log(error);
    logger.error(["DeletePekerjaController", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: error,
    });
  }
};
