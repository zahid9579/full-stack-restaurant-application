import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

export const createRestaurant = asyncHandler(async(req, res) => {
    const {name, description, price, address, city, country, image, facilities, userEmail} = req.body.data
    console.log(req.body.data);
    try{
        const restaurant = await prisma.restaurant.create({
            data: {
                name, description, price, address, country, city, facilities, image, owner : {connect: {email: userEmail}},
            },
        });

        res.send({message: "Restaurant created succesfully", restaurant});


    }catch(err){
        if(err.code == "P2002"){
            throw new Error(" The same item you have ordered...")
        }
        throw new Error(err.message)
    }
});

// function to get all the list of menuitem
export const getAllMenuIten =asyncHandler(async(req, res) => {
    const menuItems = await prisma.restaurant.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    res.send(menuItems)

});



// function to get a specific menuItem
export const getMenu = asyncHandler(async(req, res) => {
    const {id} = req.params;

    try{
        const restaurant = await prisma.restaurant.findUnique({
            where: {id},
        });
        res.send(restaurant);

    }catch(err){
        throw new Error(err);
    }

});