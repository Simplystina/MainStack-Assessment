import express from "express";
import validate from "../middlewares/validate";
import authValidation from "../validation/authValidation";
import productValidation from "../validation/productValidation";
import productController from "../controllers/productController";
import auth from "../middlewares/auth"
const router = express.Router();

router.post(
  "/",
  auth,
  validate(productValidation.createProduct),
  productController.createProducts
);

router.get(
    "/",
    auth,
    productController.getAllUserProducts
)
router.get("/all", productController.getAllProducts);
router.get(
  "/:id",
  auth,
  validate(productValidation.getAProduct),
  productController.getAProduct
);

router.put(
  "/:id",
  auth,
  validate(productValidation.getAProduct),
  productController.updateAProduct
);

router.delete(
  "/:id",
  auth,
  validate(productValidation.getAProduct),
  productController.deleteAProduct
);


export default router;
