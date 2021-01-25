const {
    Product
} = require("../models/products")
const {
    Content
} = require("../models/contents")
const {
    Category
} = require("../models/categories")
const path = require("path")
const ERR = require("../utilities/ERR")
const d = require("debug")("app:Product-controller")

exports.createNewProduct = async (req, res, next) => {
    if (req.files.image.size > 1000000) return next(new ERR('حجم تصویر وارد شده نباید بیشتر از 1 مگابایت باشد.', 400))
    if (!(await Content.findById(req.body.forContent))) return next(new ERR('پستی با این آیدی پیدا نشد.', 404))
    const {
        name,
        price,
        forContent,
        explanation,
        discount,
        linkToProductPage,
        seller,
        uploadThis
    } = req.body;
    const cate = await Content.findById(forContent).select('category');
    const productImageName = `image-product-${Date.now()}.${req.files.image.mimetype.split("/")[1]}`;
    const pathForSavingProductImage = path.join(__dirname, '../public', 'uploads', 'images', 'products', productImageName)
    const product = new Product({
        name,
        price,
        forContent,
        from: req.user._id,
        explanation,
        linkToProductPage,
        discount: discount ? discount : 0,
        seller,
        category: cate.category,
        image: productImageName,
    });
    if (uploadThis || uploadThis === 'yes') product.isPublished = true;
    await Content.findOneAndUpdate({
        _id: forContent
    }, {
        $push: {
            products: product._id
        }
    });
    await req.files.image.mv(pathForSavingProductImage);
    await product.save();
    d("new product added.")
    res.status(200).json({
        status: "success",
        message: `محصول شما با موفقیت به آیدی  ${product._id}ایجاد شد.`,
        product
    });
}