import express from 'express'
import { buyItem, cancelOrder, createUser, getAllFavourites, getAllOrders, toFav } from '../controllers/userCntrl.js'
import jwtCheck from '../config/auth0Config.js';
const router = express.Router()

router.post("/register", jwtCheck, createUser);
router.post("/buyItem/:id", jwtCheck, buyItem);
router.post("/allOrders", getAllOrders);
router.post("/removeOrder/:id", jwtCheck, cancelOrder);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav/", jwtCheck, getAllFavourites);



export {router as userRoute}