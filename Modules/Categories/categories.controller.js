const categoryService = require('./categories.services')
const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');
const prisma = require('../../lib/prisma')

const createCategory = async(req, res, next)=>{
    try{
        const {name, parentId} = req.body
        if(!name)
            return next(appError.create("Category name is required", 400, httpStatusText.BAD_REQUEST) );
        const category = await categoryService.createCategory({name, parentId})
        return res.status(201).json({message: "Category created successfully", data: category});
    }catch(error){
        return next(appError.create('Failed to create category', 500, httpStatusText.ERROR) );
    }
}

// const getCategoryTree = async (req, res, next) => {
//     try {
//         const tree = await categoryService.getCategoryTree();
//         // MUST SEND RESPONSE HERE
//         res.status(200).json({
//             status: "SUCCESS",
//             data: { categories: tree }
//         });
//     } catch (error) {
//         next(appError.create("Cannot create category", 500, httpStatusText.ERROR)); // Passes error to your Global Error Handler in app.js
//     }
// };

const getCategoriesTree = async (req, res, next) => {
    try {
        const tree = await categoryService.getCategoriesTree();
        // MUST SEND RESPONSE HERE
        res.status(200).json({
            status: "SUCCESS",
            data: { categories: tree }
        });
    }catch (error) {
        next(appError.create("Cannot create category", 500, httpStatusText.ERROR)); // Passes error to your Global Error Handler in app.js
    }
}

const getCategoriesTreeWithProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 3 } = req.query;
        console.log("Page:", page, "Limit:", limit);
        const tree = await categoryService.getCategoriesTreeWithProducts({ page: parseInt(page), limit: parseInt(limit) });
        // MUST SEND RESPONSE HERE
        res.status(200).json({
            status: "SUCCESS",
            data: { categories: tree }
        });
    }catch (error) {
        next(appError.create("Cannot create category", 500, httpStatusText.ERROR)); // Passes error to your Global Error Handler in app.js
    }
}
const updateCategory = async (req, res, next) =>{
    try{
        const id = req.params.id
        const data = req.body
        const category = await categoryService.updateCategory(id, data)
        return res.status(200).json({message: "Category updated successfully", data: category});
    }catch(error){
        return next(appError.create(error.message, 500, httpStatusText.ERROR) );
    }
}

const deleteCategory = async(req,res,next) =>{
    const id = req.params.id
    try{
        const deletedCategory = await categoryService.deleteCategory(id)
        return res.status(200).json({message: "Category deleted successfully", data: null});
    }catch(error){
        return next(appError.create(error.message, 500, httpStatusText.ERROR) );
    }
}


module.exports = {createCategory, getCategoriesTree, getCategoriesTreeWithProducts, updateCategory, deleteCategory}