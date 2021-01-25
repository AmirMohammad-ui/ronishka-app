const path = require("path");
const {Ads} = require("../models/ads");
const fs = require("fs")
const Jimp = require("jimp");
const ERR = require("../utilities/ERR");
exports.newAd = async(req,res,next)=>{
  const image = req.files.image;
  if(image.size > 500000) return next(new ERR("سایز تصویر نباید بیشتر از 500 کیلوبایت باشد.",400))
  if(!req.body.adLink || req.body.adLink === "") return next(new ERR("لینک تبلیغ نباید خالی باشد",400)) 
  const adImageName = `ad-image-${Date.now()}.${image.mimetype.split("/")[1]}`;
  const adImagePath = path.join(__dirname,"../public","uploads","ads",adImageName)
  Jimp.read(image.data)
  .then(imageFile => {
    return imageFile
      .resize(500,350)
      .write(adImagePath)
  }).catch(() => {
    return next(new ERR("تغییر اندازه تصویر با مشکل رو به رو شد لطفا  بعدا امتحان کنید.",500))
  })
  await Ads.create({
    image: adImageName,
    forContent: req.body.forContent === "" ? "notset" : req.body.forContent,
    adLink: req.body.adLink,
    name: req.body.name,
    inHomePage: req.body.inHomePage == 1 ? true : false,
    star: req.body.star == 1 ? true : false,
    star2: req.body.star2 == 1 ? true : false,
    starHome: req.body.adStarHome == 1 ? true : false,
    star2Home: req.body.adStar2Home == 1 ? true : false,
    inCategoryPage: req.body.inCategoryPage == 1 ? true : false,
    sportCategory: req.body.categories.includes("تفریحی-ورزشی") ? true : false,
    beautyCategory: req.body.categories.includes("زیبایی") ? true : false,
    healthCategory: req.body.categories.includes("ابزار-سلامت") ? true : false,
    digitalCategory: req.body.categories.includes("دیجیتال") ? true : false,
    foodCategory: req.body.categories.includes("خوراکی-نوشیدنی") ? true : false,
    clothCategory: req.body.categories.includes("مد-و-پوشاک") ? true : false,
    confirmed: req.body.confirmed == 1 ? (req.body.adLink !== "" ? true : (req.body.adLink !== null ? true : false)) : false
  })
  res.status(200).json({
    status:"success",
    message:"تبلیغ جدید با موفقیت اضافه شد."
  })
}

exports.updateAd = async(req,res)=>{
  const adId = req.params.id;
  if(!adId) return res.status(404).send(`<h1>تبلیغی با این آیدی وجود ندارد</h1>`) 
  if(!req.body.adLink || req.body.adLink === "") return res.status(400).send(`<h1>لینک تبلیغ نباید خالی باشد</h1>`) 
  await Ads.findByIdAndUpdate(adId,{
    $set:{
      forContent: req.body.forContent === "" ? "notset" : req.body.forContent,
      adLink: req.body.adLink,
      name: req.body.name,
      inHomePage: req.body.inHomePage == 1 ? true : false,
      star: req.body.star == 1 ? true : false,
      star2: req.body.star2 == 1 ? true : false,
      starHome: req.body.adStarHome == 1 ? true : false,
      star2Home: req.body.adStar2Home == 1 ? true : false,
      inCategoryPage: req.body.inCategoryPage == 1 ? true : false,
      sportCategory: req.body.sportCategory ? true : false,
      beautyCategory: req.body.beautyCategory ? true : false,
      healthCategory: req.body.healthCategory ? true : false,
      digitalCategory: req.body.digitalCategory ? true : false,
      foodCategory: req.body.foodCategory ? true : false,
      clothCategory: req.body.clothCategory ? true : false,
      confirmed: req.body.confirmed == 1 ? true : false      
    }
  })
  res.status(200).send(`
    <h1>تبلیغ با موفقیت آپدیت شد</h1>
  `)
}

exports.deleteAd = async(req,res)=>{
  const id = req.params.id;
  const theAd = await Ads.findById(id)
  if(!theAd) return res.status(404).send("<h1>تبلیغی با این آیدی پیدا نشد</h1>")
  await Ads.findByIdAndDelete(id)
  try{
    fs.unlinkSync(path.join(__dirname , "../public","uploads","ads",theAd.image))
  }catch(err){
    return res.status(500).send("<h1>تصویری برای این تبلیغ وجود ندارد ، احتمالا قبلا حذف شده</h1>")
  }
  res.status(200).send(
    `<h1>تبلیغ با موفقیت حذف شد</h1>`
  )
}

exports.searchAd = async(req,res,next)=>{
  const id = req.query.id;
  const result = await Ads.findById(id)
  if(!result) return next(new ERR("تبلیغی با این آیدی پیدا نشد.",404))
  res.status(200).json({
    status:"success",
    result,
    message: "تبلیغ با موفقیت پیدا شد."
  })
}