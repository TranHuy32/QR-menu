import { Router } from "express";
import {createCategory,deleteCategory,getCategorys,updatedCategory  } from "../../../services/categoryServices.js";
import {verifyToken} from "../../../middleware/auth.js";

const route = Router();

const categoryRoutes = (app) => {
    app.use("/category", route);
    //search all category
    route.get("/all", async (req, res, next) => {
        try {
            const categories = await getCategorys(req);
            res.status(200).json({ status: 200, listCategories: categories });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid categorys" });
        }
    });


    // sua category theo ID
    route.put("/:id",verifyToken, async (req, res, next) => {
        try {
            const upCategory = await updatedCategory(req);
            res.status(200).json({ status: 202, NewCategory: upCategory.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid updatedTableId" });
        }
    });

    route.post("/",verifyToken, async (req, res, next) => {
        try {
            const category = await createCategory(req);
            res.status(200).json({ status: 200, newCategory: category });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Can't create new Category!!!" });
        }
    });

    route.delete("/:id",verifyToken, async (req, res, next) => {
        try {
            const delCategory = await deleteCategory(req);
            res.status(200).json({ status: 202, NewCategory: delCategory.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid deleteTableId" });
        }
    });

};

export default categoryRoutes