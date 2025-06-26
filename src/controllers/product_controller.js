import Product from '../models/product_model.js';
import Category from '../models/category_model.js';
import apiResponse from '../helpers/api_response.js';
import { validateId } from '../helpers/validate_objectid.js';

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

export async function getAllProducts(req, res) {
    try {
        const { active } = req.query;

        const matchStage = {
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


        res.json(apiResponse(true, 'All products fetched', products));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Failed to fetch products', null, { error: err.message }));
    }
}


export async function getProductById(req, res) {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false }).populate('category', 'name');
        product
            ? res.json(apiResponse(true, 'Product found', product))
            : res.json(apiResponse(false, 'Product not found'));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Error fetching product', null, { error: err.message }));
    }
}

export async function addProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !price || !stock || !category) {
            return res.json(apiResponse(false, 'All required fields must be provided'));
        }

        if (!validateId(category)) return res.json(apiResponse(false, 'Invalid Category ID'));

        const cat = await Category.findOne({ _id: category, isDeleted: false, active: true });
        if (!cat) return res.json(apiResponse(false, 'Category not found'));

        const exists = await Product.findOne({ name, isDeleted: false });
        if (exists) return res.json(apiResponse(false, 'Product already exists'));

        const product = await Product.create({ name, description, price, stock, category });
        res.json(apiResponse(true, 'Product added successfully', product));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Failed to add product', null, { error: err.message }));
    }
}

export async function updateProduct(req, res) {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) return res.json(apiResponse(false, 'Product not found'));

        const { name, description, price, stock, category } = req.body;

        if (category && !validateObjectId(category)) {
            return res.json(apiResponse(false, 'Invalid Category ID'));
        }

        const exists = await Product.findOne({ name, isDeleted: false });
        if (exists) return res.json(apiResponse(false, 'Product already exists. Enter different name for product.'));

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;

        await product.save();
        res.json(apiResponse(true, 'Product updated successfully', product));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Update failed', null, { error: err.message }));
    }
}

export async function updateActiveStatus(req, res) {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) return res.json(apiResponse(false, 'Product not found'));

        product.active = req.body?.active ?? !product.active;
        await product.save();

        res.json(apiResponse(true, 'Active status updated', product));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Failed to update status', null, { error: err.message }));
    }
}

export async function deleteProduct(req, res) {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) {
            const deleted = await Product.findOne({ _id: id, isDeleted: true });
            if (deleted) return res.json(apiResponse(false, 'Product already deleted'));
            return res.json(apiResponse(false, 'Product not found'));
        }

        product.isDeleted = true;
        await product.save();

        res.json(apiResponse(true, 'Product deleted successfully'));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Delete failed', null, { error: err.message }));
    }
}
