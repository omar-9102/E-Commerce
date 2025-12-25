const httpStatusText = require('../../utils/httpStatusText')
const prisma = require('../../lib/prisma');


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

const buildCategoryTree = async (categories) => {
    const map = {};
    const tree = [];

    categories.forEach(cat => {
        map[cat.id] = { ...cat, subCategories: [] };
    });

    categories.forEach(cat => {
        if (cat.parentId) {
            map[cat.parentId].subCategories.push(map[cat.id]);
        } else {
            tree.push(map[cat.id]);
        }
    });

    return tree;
}

const getCategoriesTree = async () =>{
    const categories = await prisma.category.findMany();
    const categoryTree = buildCategoryTree(categories);
    return categoryTree;
}

// without pagination
const getCategoriesTreeWithProducts = async () =>{
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany();

    // Attach products to categories
    const enrichedCategories = categories.map(category => ({
        ...category,
        products: products.filter(
            product => product.categoryId === category.id
        )
    }));

    // Reuse tree logic
    return buildCategoryTree(enrichedCategories);
}

// with pagination
const getCategoriesTreeWithProductsPaginated = async ({ page = 1, limit = 3 }) => {
    const skip = (page - 1) * limit;
    // 1. Get all categories
    const categories = await prisma.category.findMany();
    // 2. Prepare categories with empty products
    const enrichedCategories = await Promise.all(
        categories.map(async (category) => {
            const [products, total] = await Promise.all([
                prisma.product.findMany({where: { categoryId: category.id },skip,take: limit
                }),
                prisma.product.count({where: { categoryId: category.id }})
            ]);
            return {
                ...category,
                products: {
                    data: products,page,limit,total}
            };
        })
    );
    // 3. Build tree AFTER pagination
    return buildCategoryTree(enrichedCategories);
};

const updateCategory = async (id, data) =>{
    const {name, parentId} = data;
    const allowedUpdates = ['name', 'parentId']
    const updates = Object.keys(data);
    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        throw new Error('Invalid updates', 400)
    }
    const category = await prisma.category.findUnique({where: {id}})
    if(!category){
        throw new Error('Category not found', 404)
    }
    updates.forEach((update) => category[update] = data[update])
    await prisma.category.update({where: {id}, data: category})
    return category
}

const deleteCategory = async(id)=>{
    const category = await prisma.category.findUnique({where: {id}})
    if(!category)
        throw new Error('Category not found', 404)
    // check if category has subcategories
    const subCategories = await prisma.category.findMany({where: {parentId: id}})
    if(subCategories.length > 0)
        throw new Error('Cannot delete category with subcategories', 400)
    // check if category is assigned to any products
    const products = await prisma.product.findMany({where: {categoryId: id}})
    if(products.length > 0)
        throw new Error('Cannot delete category assigned to products', 400)
    // ch
    await prisma.category.delete({where: {id}})
    return
}

module.exports = { createCategory,
        getCategoriesTree,
        getCategoriesTreeWithProducts, 
        updateCategory, 
        getCategoriesTreeWithProductsPaginated,
        deleteCategory 
    };