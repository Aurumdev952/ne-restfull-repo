import { prisma } from "@/lib/db";
import { CreateItemSchemaInput, UpdateItemSchemaInput } from "@/types/item";
import { NextFunction, Request, Response } from "express";

export const createItemHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newItem = req.body as CreateItemSchemaInput;

    const item = await prisma.item.create({
      data: {
        ...newItem,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItemHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const updatedItem = req.body as UpdateItemSchemaInput;
    const item = await prisma.item.update({
      where: {
        id,
      },
      data: updatedItem,
    });
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteItemHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const item = await prisma.item.delete({
      where: {
        id,
      },
    });
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const getItemByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const item = await prisma.item.findFirst({
      where: {
        id,
      },
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const getItemsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const items = await prisma.item.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPosts = await prisma.item.count();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      data: items ?? [],
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalPosts,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
