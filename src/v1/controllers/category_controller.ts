import { Request, Response } from 'express';
import Category from '../models/category_model.js';

// ✅ Get all categories (with optional ?active=true filtering)
export async function getAllCategories(req: Request, res: Response) {
    try {
        const { active } = req.query;

        const filter: Record<string, any> = { isDeleted: false };
        if (active !== undefined) {
            filter.active = active === 'true'; // Convert string to boolean
        }

        const categories = await Category.find(filter);
        res.sendData(true, 'All categories fetched', categories);
    } catch (err: any) {
        res.serverError('Failed to fetch categories', err);
    }
}

// ✅ Get active categories only
export async function getActiveCategories(_: Request, res: Response) {
    try {
        const categories = await Category.find({ isDeleted: false, active: true });
        res.sendData(true, 'Active categories fetched', categories);
    } catch (err: any) {
        res.serverError('Failed to fetch active categories', err);
    }
}

// ✅ Get category by ID
export async function getCategoryById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const category = await Category.findOne({ _id: id, isDeleted: false });
        category
            ? res.sendData(true, 'Category details fetched', category)
            : res.sendData(false, 'Category not found');
    } catch (err: any) {
        res.serverError('Error fetching category', err);
    }
}

// ✅ Add new category
export async function addCategory(req: Request, res: Response) : Promise<any>{
    try {
        const { name, description } = req.body;

        const existing = await Category.findOne({ name, isDeleted: false });
        if (existing) return res.sendData(false, 'Category already exists');

        const newCategory = await Category.create({ name, description });
        res.sendData(true, 'Category created', newCategory);
    } catch (err: any) {
        res.serverError('Creation failed', err);
    }
}

// ✅ Update category (name, description)
export async function updateCategory(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) return res.sendData(false, 'Category not found');

        category.name = name?.toString() ?? category.name;
        category.description = description?.toString() ?? category.description;
        await category.save();

        res.sendData(true, 'Category details updated', category);
    } catch (err: any) {
        res.serverError('Update failed', err);
    }
}

// ✅ Toggle or set active status
export async function updateActiveStatus(req: Request, res: Response): Promise<any>{
    try {
        const { id } = req.params;
        const { active } = req.body;

        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) return res.sendData(false, 'Category not found');

        category.active = active !== undefined ? !!active : !category.active;
        await category.save();

        res.sendData(true, 'Active status updated', category);
    } catch (err: any) {
        res.serverError('Failed to update status', err);
    }
}

// ✅ Soft delete category
export async function deleteCategory(req: Request, res: Response): Promise<any> {
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

        res.sendData(true, 'Category deleted successfully');
    } catch (err: any) {
        res.serverError('Delete failed', err);
    }
}
