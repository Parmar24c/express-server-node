import Category from '../models/category_model.js';
import apiResponse from '../helpers/api_response.js';

export async function getAllCategories(req, res) {
    try {
        const { active } = req.query;

        const filter = { isDeleted: false };
        if (active !== undefined) {
            filter.active = active === 'true'; // Convert string to boolean
        }

        const categories = await Category.find(filter);
        res.json(apiResponse(true, 'All categories fetched', categories));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Failed to fetch categories', null, { error: err.message }));
    }
}

export async function getActiveCategories(_, res) {
    try {
        const categories = await Category.find({ isDeleted: false, active: true });
        res.json(apiResponse(true, 'Active categories fetched', categories));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Failed to fetch active categories', null, { error: err.message }));
    }
}

export async function getCategoryById(req, res) {
    const { id } = req.params;
    try {
        const category = await Category.findOne({ _id: id, isDeleted: false });
        category
            ? res.json(apiResponse(true, 'Category details fetched', category))
            : res.json(apiResponse(false, 'Category not found'));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Error fetching category', null, { error: err.message }));
    }
}


export async function addCategory(req, res) {
    try {
        const { name, description } = req.body;
        const category = await Category.findOne({ name, isDeleted: false });
        if (category) return res.json(apiResponse(false, 'Category already exists'));

        const newCategory = await Category.create({ name, description })

        res.json(apiResponse(true, 'Category created', newCategory));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Update failed', null, { error: err.message }));
    }
}


export async function updateCategory(req, res) {
    const { id } = req.params;
    try {
        const { name, description } = req.body;
        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) return res.json(apiResponse(false, 'Category not found'));

        category.name = name?.toString() ?? category.name;
        category.description = description?.toString() ?? category.description;
        await category.save();

        res.json(apiResponse(true, 'Category details updated', category));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Update failed', null, { error: err.message }));
    }
}

export async function updateActiveStatus(req, res) {
    const { id } = req.params;
    try {
        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) return res.json(apiResponse(false, 'Category not found'));

        category.active = req.body?.active ?? !category.active;
        await category.save();

        res.json(apiResponse(true, 'Active status updated', category));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Failed to update status', null, { error: err.message }));
    }
}

export async function deleteCategory(req, res) {
    const { id } = req.params;
    try {
        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) {
            const categoryDeleted = await Category.findOne({ _id: id, isDeleted: true });
            if (categoryDeleted) {
                return res.json(apiResponse(false, 'Category already deleted'));
            }
            return res.json(apiResponse(false, 'Category not found'));
        }
        category.isDeleted = true;
        await category.save();
        res.json(apiResponse(true, 'Category deleted successfully'));
    } catch (err) {
        res.status(500).json(apiResponse(false, 'Delete failed', null, { error: err.message }));
    }
}
