import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { Product } from "../models/product.models.js"

const createProduct = asyncHandler(async(req,res)=>{

    const {name,description,price,discount,brandId,image,categories,stock} = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        discount,
        brandId,
        image,
        categories,
        stock
    });

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            product,
            "Product created successfully"
        )
    );
})

export {createProduct}