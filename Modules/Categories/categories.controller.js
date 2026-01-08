const categoryService = require('./categories.services')
const asyncWrapper = require('express-async-handler')

const createCategory = asyncWrapper(async(req, res)=>{
    const {name, parentId} = req.body
    console.log(name)
    console.log(parentId)
    const category = await categoryService.createCategory({name, parentId})
    return res.status(201).json({message: "Category created successfully", data: category});
})

const getCategoriesTree = asyncWrapper(async (req, res) => {
    const tree = await categoryService.getCategoriesTree();
    res.status(200).json({status: "SUCCESS",data: { categories: tree }});
})

const getCategoriesTreeWithProducts = asyncWrapper(async (req, res) => {
    const { page = 1, limit = 3 } = req.query;
    console.log("Page:", page, "Limit:", limit);
    const tree = await categoryService.getCategoriesTreeWithProducts({ page: parseInt(page), limit: parseInt(limit) });
    return res.status(200).json({status: "SUCCESS",data: { categories: tree }});
})

const updateCategory = asyncWrapper(async (req, res) =>{
    const id = req.params.id
    const data = req.body
    const category = await categoryService.updateCategory(id, data)
    return res.status(200).json({message: "Category updated successfully", data: category});
})

const deleteCategory = asyncWrapper(async(req,res) =>{
    const id = req.params.id
    const deletedCategory = await categoryService.deleteCategory(id)
    return res.status(200).json({message: `Category deleted successfully`});
})


module.exports = {createCategory, getCategoriesTree, getCategoriesTreeWithProducts, updateCategory, deleteCategory}