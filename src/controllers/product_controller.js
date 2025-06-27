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


        res.sendData(true, 'All products fetched', products);
    } catch (err) {
        res.serverError('Failed to fetch products', null);
    }
}


export async function getProductById(req, res) {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false }).populate('category', 'name');

        if (product) {
            return res.sendData(true, 'Product found', product);
        } else {
            return res.sendData(false, 'Product not found');
        }

    } catch (err) {
        return res.serverError('Error fetching product', err);
    }
}


export async function addProduct(req, res) {
    try {

        const { error } = addProductValidator.validate(req.body);
        if (error) {
            return res.joiValidationError(error);
        }

        const { name, description, price, stock, category } = req.body;

        if (!validateId(category)) return res.sendData(false, 'Invalid Category ID');

        const cat = await Category.findOne({ _id: category, isDeleted: false, active: true });
        if (!cat) return res.sendData(false, 'Category not found');

        const exists = await Product.findOne({ name, isDeleted: false });
        if (exists) return res.sendData(false, 'Product already exists');

        const product = await Product.create({ name, description, price, stock, category });
        res.sendData(true, 'Product added successfully', product);
    } catch (err) {
        res.serverError('Failed to add product', err);
    }
}

export async function updateProduct(req, res) {
    try {

        const { error } = updateProductValidator.validate(req.body);
        if (error) {
            return res.joiValidationError(error);
        }

        const { id } = req.params;
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) return res.sendData(false, 'Product not found');

        const { name, description, price, stock, category } = req.body;

        if (category && !validateObjectId(category)) {
            return res.sendData(false, 'Invalid Category ID');
        }

        const exists = await Product.findOne({ name, isDeleted: false });

        if (exists && exists._id.toString() !== id.toString) {
            return res.sendData(false, 'Product already exists. Enter different name for product.');
        }


        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;

        await product.save();
        res.sendData(true, 'Product updated successfully', product);
    } catch (err) {
        res.serverError('Update failed', err);
    }
}

export async function updateActiveStatus(req, res) {    
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id, isDeleted: false });
        if (!product) return res.sendData(false, 'Product not found');

        product.active = req.body?.active ?? !product.active;
        await product.save();

        res.sendData(true, 'Active status updated', product);
    } catch (err) {
        res.serverError('Failed to update status', err);
    }
}

export async function deleteProduct(req, res) {
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
    } catch (err) {
        res.serverError('Delete failed', err);
    }
}
