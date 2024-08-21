import { Router } from "express";
import { createTable, getTables, getTablesById,updatedTablesById,deleteTablesById,activeByUuid, getTablesByUuid } from "../../../services/tableServices.js";
import {verifyToken} from "../../../middleware/auth.js";

const route = Router();

const tableRoutes = (app) => {
  app.use("/table", route);
// search all table
  route.get("/all",verifyToken, async (req, res, next) => {
    try {
      const tables = await getTables(req);
      res.status(200).json({ status: 200, listTable: tables });
    } catch (error) {
      //   return next(err);
      console.error(error);
      res.status(500).json({ status: 500, message: "invalid tables" });
    }
  });
  // search table by ID
  route.get("/:id",verifyToken, async (req, res, next) => {
    try {
      const tableId = await getTablesById(req);
      res.status(200).json({ status: 201, listTable: tableId });
    } catch (error) {
      //   return next(err);
      console.error(error);
      res.status(500).json({ status: 500, message: "invalid tableId" });
    }
  });
  // search table by uuid active
  route.get("/",verifyToken, async (req, res, next) => {
    try {
        console.log('Request received at GET /:uuid');
        const tableUuid = await getTablesByUuid(req, res); // Truyền cả req và res
        res.status(200).json({ status: 201, listTable: tableUuid });
    } catch (error) {
        console.error('Error in GET /:uuid:', error);
        res.status(500).json({ status: 500, message: "Invalid table UUID" });
    }
});

  route.patch("/",verifyToken, async (req, res, next) => {
    try {
      console.log(111111);
      const tableId = await activeByUuid(req);
      res.status(200).json({ status: 201, listTable: tableId });
    } catch (error) {
      //   return next(err);
      console.error(error);
      res.status(500).json({ status: 500, message: "invalid tableId" });
    }
  });
  // sua table theo ID
  route.put("/:id",verifyToken, async (req, res, next) => {
    try {
      const updatedTableId = await updatedTablesById (req);
      res.status(200).json({ status: 202, listTable: updatedTableId.message });
    } catch (error) {
      //   return next(err);
      console.error(error);
      res.status(500).json({ status: 500, message: "invalid updatedTableId" });
    }
  });
  // delete table by ID
  route.delete("/:id",verifyToken, async (req, res, next) => {
    try {
      const deleteTableId = await deleteTablesById (req);
      res.status(204).json({ status: 202, listTable: deleteTableId.message });
    } catch (error) {
      //   return next(err);
      console.error(error);
      res.status(500).json({ status: 500, message: "invalid deleteTableId" });
    }
  });

  route.post("/",verifyToken, async (req, res, next) => {
    try {
      const table = await createTable(req);
      res.status(200).json({ status: 200, newTable: table });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Can't create new Table!!!" });
    }
  });

};

export default tableRoutes
