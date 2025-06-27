import Category from '../models/category_model.js';

export async function getAllCategories(req, res) {
    try {
        const { active } = req.query;

        const filter = { isDeleted: false };
        if (active !== undefined) {
            filter.active = active === 'true'; // Convert string to boolean
        }

        const categories = await Category.find(filter);
        res.sendData(true, 'All categories fetched', categories);
    } catch (err) {
        res.serverError('Failed to fetch categories', err);
    }
}

export async function getActiveCategories(_, res) {
    try {
        const categories = await Category.find({ isDeleted: false, active: true });
        res.sendData(true, 'Active categories fetched', categories);
    } catch (err) {
        res.serverError('Failed to fetch active categories', err);
    }
}

export async function getCategoryById(req, res) {
    try {
        const { id } = req.params;

        const category = await Category.findOne({ _id: id, isDeleted: false });
        category
            ? res.sendData(true, 'Category details fetched', category)
            : res.sendData(false, 'Category not found');
    } catch (err) {
        res.serverError('Error fetching category', err);
    }
}


export async function addCategory(req, res) {
    try {
        const { name, description } = req.body;

        const category = await Category.findOne({ name, isDeleted: false });
        if (category) return res.sendData(false, 'Category already exists');

        const newCategory = await Category.create({ name, description })

        res.sendData(true, 'Category created', newCategory);
    } catch (err) {
        res.serverError('Update failed', err);
    }
}


export async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) return res.sendData(false, 'Category not found');

        category.name = name?.toString() ?? category.name;
        category.description = description?.toString() ?? category.description;
        await category.save();

        res.sendData(true, 'Category details updated', category);
    } catch (err) {
        res.serverError('Update failed', err);
    }
}

export async function updateActiveStatus(req, res) {
    try {
        const { id } = req.params;

        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) return res.sendData(false, 'Category not found');

        category.active = req.body?.active ?? !category.active;
        await category.save();

        res.sendData(true, 'Active status updated', category);
    } catch (err) {
        res.serverError('Failed to update status', err);
    }
}

export async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) {
            const categoryDeleted = await Category.findOne({ _id: id, isDeleted: true });
            if (categoryDeleted) {
                return res.sendData(false, 'Category already deleted');
            }
            return res.sendData(false, 'Category not found');
        }
        category.isDeleted = true;
        await category.save();
        res.sendData('Category deleted successfully');
    } catch (err) {
        res.serverError('Delete failed', err);
    }
}
