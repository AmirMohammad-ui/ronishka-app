const {
    Category
} = require("../models/categories")

exports.createCategory = async (req, res, next) => {
    const category = new Category({
        name: req.body.name
    })
    await category.save();
    res.status(201).json({
        status: 'success',
        category
    })
}