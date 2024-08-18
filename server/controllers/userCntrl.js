import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

export const createUser = asyncHandler(async (req, res) => {
    console.log("creating a user");
  
    let { email } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email: email } });
    if (!userExists) {
      const user = await prisma.user.create({ data: req.body });
      res.send({
        message: "User registered successfully",
        user: user,
      });
    } else res.status(201).send({ message: "User already registered" });
  });
  

  
// function to buy a item from restrunt
export const buyItem = asyncHandler(async(req,res) => {
    const {email, date} = req.body
    const {id} = req.params

    try{
        const alreadyBooked = await prisma.user.findUnique({
            where: {email: email},
            select: {bookedItems: true},

        });

        if(alreadyBooked.bookedItems.some((visit) => visit.id === id)){
            res.status(400).json({message: "This item is already ordered by you..."})
        }
        else{
            await prisma.user.update({
                where: {email: email},
                data: {
                    bookedItems: {push: {id, date}}
                }
            })
            res.send("your item is booked successfully...");
        }
        

    }catch(err){
        throw new Error(err.message)
    }

});


export const getAllOrders = asyncHandler(async(req, res) => {
    const {email} = req.body
    try{
        const orders = await prisma.user.findUnique({
            where: {email},
            select: {bookedItems: true}
        });
        res.status(200).send(orders)
    }catch(err){
        throw new Error(err.message);
    }

});


export const cancelOrder = asyncHandler(async(req, res) => {
    const {email} = req.body;
    const {id} = req.params;
    try{
        const user = await prisma.user.findUnique({
            where: {email: email},
            select: {bookedItems: true}
        });

        const index = user.bookedItems.findIndex((visit) => visit.id === id)

        if(index === -1){
            res.status(404).json({message: "Order not found"})
        }else{
            user.bookedItems.splice(index, 1)
            await prisma.user.update({
                where: {email},
                data: {
                    bookedItems: user.bookedItems
                }
            })
            res.send("Order cancel successfully...")
        }
    }catch(err){
        throw new Error(err.message);

    }
    
});



// function  to add item in favourite list

export const toFav = asyncHandler(async(req, res) => {
    const {email} = req.body;
    const {rid} = req.params;

    try{
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(user.favRestaurantsID.includes(rid)){
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favRestaurantsID: {
                        set: user.favRestaurantsID.filter((id)=> id!== rid)
                    }
                }
            });
            res.send({message: "Removed from favourites", user: updateUser});

        }
        else{
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favRestaurantsID: {
                        push: rid
                    }
                }
            });
            res.send({message: "Updated favourites", user: updateUser});
        }

    }catch(err){
        throw new Error(err.message);
    }
});


export const getAllFavourites = asyncHandler(async(req, res) =>{
    const {email} = req.body;
    try{
        const favItem = await prisma.user.findUnique({
            where: {email},
            select: {favRestaurantsID: true}
        })
        res.status(200).send(favItem)
    }catch(err){
        throw new Error(err.message);
    }
})