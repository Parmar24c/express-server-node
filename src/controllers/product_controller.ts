import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product_model.js';
import Category from '../models/category_model.js';
import { validateId } from '../helpers/validate_objectid.js';
import { addProductValidator, updateProductValidator } from '../model_validators/product_validator.js';

/// --------- ONLY FINDS PRODUCTS USING POLULATE (JOIN CATEGORY COLLECTION) --------------
// export async function getAllProducts(req, res) {
//     try {
//         const { active } = req.query;
//         const filter = { isDeleted: false };
//         if (active !== undefined) {
//             filter.active = active === 'true'; // Convert string to boolean
//         }
//         const products = await Product.find(filter).populate('category', 'name');
//         res.json(apiResponse(true, 'All products fetched', products));
//     } catch (err) {
//         res.status(500).json(apiResponse(false, 'Failed to fetch products', null, { error: err.message }));
//     }
// }
/// ---------------------------------------------------------------------------------------

/// ------- [ Aggregation pipelines use stages ] ------------------------------------------
// [
//     { $match: { active: true } },             // like WHERE
//     { $lookup: { ... } },                     // like JOIN
//     { $unwind: "$category" },                 // flatten array fields
//     { $group: { _id: "$category", total: { $sum: "$price" } } }, // GROUP BY
//     { $project: { _id: 0, total: 1 } },       // SELECT specific fields
//     { $sort: { createdAt: -1 } },             // ORDER BY
//     { $skip: 0 },                             // OFFSET
//     { $limit: 10 }                            // LIMIT
// ]
/// ---------------------------------------------------------------------------------------

export async function getAllProducts(req: Request, res: Response) {
    try {
        const { active } = req.query;

        const matchStage: Record<string, any> = {
            isDeleted: false
        };

        if (active !== undefined) {
            matchStage.active = active === 'true';
        }

        /// USE [aggregate] FOR MORE ADVANCED CONTROLL
        const products = await Product.aggregate([
            // Step 1: Filter out deleted or inactive products (if passed via query)
            { $match: matchStage },

            // Step 2: Join category collection using $lookup
            {
                $lookup: {
                    from: 'categories',        // Name of the category collection in MongoDB
                    localField: 'category',    // Field in product schema (ObjectId)
                    foreignField: '_id',       // Match with _id in category schema
                    as: 'category'             // Output as an array named 'category'
                }
            },

            // Step 3: Flatten the joined 'category' array to single object
            { $unwind: '$category' },

            /// --- IF YOU HAVE MULTIPLE OBJECT LIKE CATEGORY ---
            // // Join with 'brands'
            // {
            //     $lookup: {
            //         from: 'brands',
            //         localField: 'brand',
            //         foreignField: '_id',
            //         as: 'brand'
            //     }
            // },
            // { $unwind: '$brand' },
            /// ------------------------------------------------

            // Step 4: Filter out products whose category is not active
            { $match: { 'category.active': true } },

            // Step 5: Keep only required fields from 'category'
            {
                $project: {
                    name: 1,
                    description: 1,
                    price: 1,
                    stock: 1,
                    active: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    category: {
                        id: '$category._id',
                        name: '$category.name'
                    }
                }
            }

            /// -------- OR -- USE BELOW METHOD -------------------------
            // {
            //     $replaceRoot: {
            //         newRoot: {
            //             $mergeObjects: [
            //                 "$$ROOT",
            //                 {
            //                     category: {
            //                         _id: "$category._id",
            //                         name: "$category.name"
            //                     }
            //                 }
            //             ]
            //         }
            //     }
            // }
            /// -----------------------------------------------------------
        ]);


        res.sendData(true, 'All products fetched successfully', products);
    } catch (err: any) {
        res.serverError('Failed to fetch products', err);
    }
}

export async function getFilteredProducts(req: Request, res: Response) {
    try {
        const {
            minPrice,
            maxPrice,
            sortByPrice,
            sortByCreatedAt,
            sortByName,
            page = 1,
            limit = 10,
            categoryId,
            search,
            demo
        } = req.body;

        const matchStage: Record<string, any> = { isDeleted: false, active: true };

        if (minPrice || maxPrice) {
            matchStage.price = {};
            if (minPrice) matchStage.price.$gte = parseFloat(minPrice);
            if (maxPrice) matchStage.price.$lte = parseFloat(maxPrice);
        }

        if (categoryId) {
            matchStage.category = new mongoose.Types.ObjectId(categoryId);
        }

        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const sortStage: Record<string, 1 | -1> = {};
        if (sortByPrice) sortStage.price = sortByPrice === 'asc' ? 1 : -1;
        if (sortByName) sortStage.name = sortByName === 'asc' ? 1 : -1;
        if (sortByCreatedAt) sortStage.createdAt = sortByCreatedAt === 'asc' ? 1 : -1;

        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            { $match: { 'category.active': true } },
            {
                $project: {
                    name: 1,
                    description: 1,
                    price: 1,
                    stock: 1,
                    active: 1,
                    createdAt: 1,
                    category: { _id: '$category._id', name: '$category.name' }
                }
            },
            Object.keys(sortStage).length ? { $sort: sortStage } : null,
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) }
        ].filter(stage => stage !== null);

        const products = await Product.aggregate(pipeline);

        res.sendData(true, 'Advanced products fetched', products);
    } catch (err: any) {
        res.serverError('Failed to fetch advanced products', err);
    }
}

export async function getProductById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false }).populate('category', 'name');

        if (product) {
            return res.sendData(true, 'Product found', product);
        } else {
            return res.sendData(false, 'Product not found');
        }

    } catch (err: any) {
        return res.serverError('Error fetching product', err);
    }
}

export async function addProduct(req: Request, res: Response): Promise<any> {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!validateId(category)) return res.sendData(false, 'Invalid Category ID');

        const cat = await Category.findOne({ _id: category, isDeleted: false, active: true });
        if (!cat) return res.sendData(false, 'Category not found');

        const exists = await Product.findOne({ name, isDeleted: false });
        if (exists) return res.sendData(false, 'Product already exists');

        const product = await Product.create({ name, description, price, stock, category });
        res.sendData(true, 'Product added successfully', product);
    } catch (err: any) {
        res.serverError('Failed to add product', err);
    }
}

export async function updateProduct(req: Request, res: Response): Promise<any> {
    try {

        const { id } = req.params;
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) return res.sendData(false, 'Product not found');

        const { name, description, price, stock, category } = req.body;

        if (category && !validateId(category)) {
            return res.sendData(false, 'Invalid Category ID');
        }

        const exists = await Product.findOne({ name, isDeleted: false });

        if (exists && exists._id.toString() !== id.toString()) {
            return res.sendData(false, 'Product already exists. Enter different name for product.');
        }

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;

        await product.save();
        res.sendData(true, 'Product updated successfully', product);
    } catch (err: any) {
        res.serverError('Update failed', err);
    }
}

export async function updateActiveStatus(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) return res.sendData(false, 'Product not found');

        product.active = req.body?.active ?? !product.active;
        await product.save();

        res.sendData(true, 'Active status updated', product);
    } catch (err: any) {
        res.serverError('Failed to update status', err);
    }
}

export async function deleteProduct(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) {
            const deleted = await Product.findOne({ _id: id, isDeleted: true });
            if (deleted) return res.sendData(false, 'Product already deleted');
            return res.sendData(false, 'Product not found');
        }

        product.isDeleted = true;
        await product.save();

        res.sendData(true, 'Product deleted successfully');
    } catch (err: any) {
        res.serverError('Delete failed', err);
    }
}
