import express from 'express'
import { createRestaurant, getAllMenuIten, getMenu } from '../controllers/restaurantCntrl.js'
import jwtCheck from '../config/auth0Config.js';
const router = express.Router()

router.post("/create",jwtCheck, createRestaurant);
router.get("/allmenu", getAllMenuIten);
router.get("/:id", getMenu)




export {router as restaurantRoute}