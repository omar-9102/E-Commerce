const httpStatusText = require('../../utils/httpStatusText')
const appError = require('../../utils/AppError')
const prisma = require('../../lib/prisma')


const createCategory = async (data) => {
    const { name, parentId } = data;

    // 1. If parentId is provided, verify the parent category exists
    if (parentId) {
        const parentExists = await prisma.category.findUnique({
            where: { id: parentId },
        });

    if (!parentExists) {
        throw new Error("Parent category not found");
    }
}

    // 2. Create the category
    return await prisma.category.create({
    data: {
        name,
        parentId: parentId || null, // Connects to parent if it exists
    },
    });
};

const getCategoryTree = async () => {
    // 1. Fetch EVERYTHING from the table (Flat List)
    const allCategories = await prisma.category.findMany();

    // 2. A function to turn that flat list into a nested tree
    const buildTree = (parentId = null) => {
        return allCategories
            .filter(cat => cat.parentId === parentId)
            .map(cat => ({
            ...cat,
            subCategories: buildTree(cat.id) // <--- This calls itself (Recursion)
    }));
    };

    return buildTree(null); // Start with root categories
};
module.exports = { createCategory, getCategoryTree };