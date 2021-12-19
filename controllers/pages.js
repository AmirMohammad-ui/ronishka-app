
const {User} = require("../models/users")
const {Product} = require("../models/products")
const {Content} = require("../models/contents")
// const {Category} = require("../models/categories")
const { Review } = require("../models/reviews")
const { Message } = require("../models/messages")
const { Ads } = require("../models/ads")
// const path = require('path')
// const fs = require("fs")
const ERR = require("../utilities/ERR")

exports.getHome = async (req, res) => {
  const contents = await Content.find({isConfirmed: true, isPublished: true}).sort({dateCreated: -1}).select("slug coverImage persianDate summary topic").limit(5);
  const contentsMostViews = await Content.find({isConfirmed: true, isPublished: true}).sort({views: -1}).select("coverImage views summary persianDate topic slug").limit(5);
  const contentsSideBar = await Content.find({isConfirmed: true, isPublished: true}).sort({dateCreated: -1}).select("coverImage views summary persianDate topic slug").limit(9);
  const sportCategory = await Content.find().and([
    {
      isConfirmed: true,
      isPublished: true
    }, {
      category: 'تفریحی-ورزشی'
    }
  ]).select('coverImage views summary persianDate topic slug').limit(9);
  const healthCategory = await Content.find().and([
    {
      isConfirmed: true,
      isPublished: true
    }, {
      category: 'ابزار-سلامت'
    }
  ]).select('coverImage views summary persianDate topic slug').limit(9);
  const beautyCategory = await Content.find().and([
    {
      isConfirmed: true,
      isPublished: true
    }, {
      category: 'زیبایی'
    }
  ]).select('coverImage views summary persianDate topic slug').limit(9);
  const techCategory = await Content.find().and([
    {
      isConfirmed: true,
      isPublished: true
    }, {
      category: 'دیجیتال'
    }
  ]).select('coverImage views summary persianDate topic slug').limit(9);
  const foodCategory = await Content.find().and([
    {
      isConfirmed: true,
      isPublished: true
    }, {
      category: 'خوراکی-نوشیدنی'
    }
  ]).select('coverImage views summary persianDate topic slug').limit(9);
  const fashionCategory = await Content.find().and([
    {
      isConfirmed: true,
      isPublished: true
    }, {
      category: 'مد-و-پوشاک'
    }
  ]).select('coverImage views summary persianDate topic slug').limit(9);
  const products = await Product.find({isConfirmed: true, isPublished: true}).select("name explanation persianDate views image discount discountPercentage price linkToProductPage").sort({views: -1}).limit(9);
  const sideBarProducts = await Product.find({isConfirmed: true, isPublished: true}).sort({discount: -1}).select("name image discountPercentage discount price linkToProductPage").limit(9);
  const sideBarBestProducts = await Product.find({isConfirmed: true, isPublished: true}).sort({views: -1}).select("name image discountPercentage discount price linkToProductPage").limit(9);
  const ads1 = await Ads.find({inHomePage:true,confirmed:true}).sort({dateCreated: -1}).limit(4)
  const adStarHome = await Ads.findOne({starHome:true,confirmed:true}).sort({dateCreated: -1})
  const adStar2Home = await Ads.findOne({star2Home:true,confirmed:true}).sort({dateCreated: -1})

  res.render("index", {
    title: "رونیشکا",
    isLoggedIn: req.session.loggedIn,
    contents,
    contentsSideBar,
    contentsMostViews,
    sportCategory,
    healthCategory,
    page:'',
    beautyCategory,
    techCategory,
    adsTop: ads1,
    adStar:adStarHome,
    adStar2:adStar2Home,
    foodCategory,
    fashionCategory,
    products,
    sideBarProducts,
    sideBarBestProducts,
    isCreator: req.session.role,
    description: `مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و ...`,
    keywords: ',رونیشکا,وبسایت رونیشکا,مجله اینترنتی رونیشکا,ورزشی رونیشکا,زیبایی رونیشکا,تفریحی رونیشکا,سلامت رونیشکا,ابزار سلامت رونیشکا,مد رونیشکا,پوشاک رونیشکارونیشکا,مجله اینترنتی,سلامت,زیبایی,مد,پوشاک,ورزش,ورزشی,پزشکی,تفریحی,تفریح,تکنولوژی,دیجیتال',
    author: "امیرمحمد میرزائی راد"
  })
}
exports.getContent = async (req, res,next) => {
  const contentSlug = req.params.slug;
  if(!(await Content.findOne({slug: contentSlug,isConfirmed: true,isPublished: true}))) return next (new ERR("این صفحه یافت نشد.",404))
  
  const user = await User.findOne({_id: req.session.user}).select("fname lname email role")
  const content = await Content.findOne({slug: contentSlug,isConfirmed: true,isPublished: true}).select("-isConfirmed -isPublished").populate("products");
	const reviews = await Review.find({forContent:content._id,isConfirmed:true}).sort({dateCreated: -1}).populate('replies');
  const contents = await Content.find({isConfirmed: true, isPublished: true}).sort({dateCreated: -1}).select('summary slug').limit(9);
  const relativeContents = await Content.find({
    isConfirmed: true,
    isPublished: true,
    keywords: {
      $regex: new RegExp(content.keywords[0])
    }
  }).sort({dateCreated: -1}).select("coverImage topic persianDate slug summary").limit(9);
  const suggestedContents = await Content.find({category: content.category,isConfirmed: true,isPublished: true}).select("coverImage topic isUseful slug summary").limit(9);
  let keywords = '';
  content.keywords.forEach(el => {
    keywords += `${el},`; 
  }); 
  const ads1 = await Ads.find({forContent: content._id,confirmed:true}).sort({dateCreated: -1}).limit(6)
  const ads2 = await Ads.find({forContent: content._id,confirmed:true}).sort({dateCreated: -1}).skip(6).limit(6)
  const adStar = await Ads.findOne({forContent:content._id,star:true,confirmed:true}).sort({dateCreated: -1})
  const adStar2 = await Ads.findOne({forContent:content._id,star2:true,confirmed:true}).sort({dateCreated: -1})
  res.render("pages/content", {
    title: `رونیشکا | ${
      content.topic
    }`,
		reviews,
    isLoggedIn: req.session.loggedIn,
    contents,
    content,
    user,
    adStar,
    adStar2,
    adsTop:ads1,
    adsMiddle:ads2,
    isCreator: req.session.role,
    page:'',
    description: `رونیشکا | ${
      content.metaDescription
    }`,
    keywords,
    relativeContents,
    suggestedContents,
    author: `${
      content.resource
    }`
  })
}
exports.getAbout = async (req, res) => {
  const contents = await Content.find({isConfirmed: true, isPublished: true}).sort({dateCreated: -1}).select('summary slug').limit(9);
  res.render("pages/about", {
    isLoggedIn: req.session.loggedIn,
    contents,
    title: "رونیشکا | درباره ما",
    isCreator: req.session.role,
    page:'',
    description: "مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و",
    author: 'امیرمحمد میرزائی راد',
    keywords: 'رونیشکا،وبسایت رونیشکا،مجله اینترنتی رونیشکا،ورزشی رونیشکا،زیبایی رونیشکا،تفریحی رونیشکا،سلامت رونیشکا،ابزار سلامت رونیشکا،مد رونیشکا،پوشاک رونیشکا'
  })
}
exports.getComplaint = async (req, res) => {
  const contents = await Content.find({isConfirmed: true, isPublished: true}).sort({dateCreated: -1}).select('summary slug').limit(9);
  res.render("pages/complaint", {
    isLoggedIn: req.session.loggedIn,
    contents,
    title: "رونیشکا | ثبت شکایت",
    isCreator: req.session.role,
    page:'',
    description: 'مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و',
    author: 'امیرمحمد میرزائی راد',
    keywords: 'رونیشکا،وبسایت رونیشکا،مجله اینترنتی رونیشکا،ورزشی رونیشکا،زیبایی رونیشکا،تفریحی رونیشکا،سلامت رونیشکا،ابزار سلامت رونیشکا،مد رونیشکا،پوشاک رونیشکا'
  })
}
exports.getCategory = async (req, res) => {
  let slug = req.params.slug;
  let findRelativeAds = [];
  if(slug.includes("ورزشی")){
    findRelativeAds = await Ads.find({sportCategory:true,inCategoryPage:true,confirmed:true}).sort({dateCreated: -1}).limit(12);
  } else if (slug.includes("زیبایی")) {
    findRelativeAds = await Ads.find({beautyCategory:true,inCategoryPage:true,confirmed:true}).sort({dateCreated: -1}).limit(12);
  } else if (slug.includes("ابزار")) {
    findRelativeAds = await Ads.find({healthCategory:true,inCategoryPage:true,confirmed:true}).sort({dateCreated: -1}).limit(12);
  } else if (slug.includes("پوشاک")) {
    findRelativeAds = await Ads.find({clothCategory:true,inCategoryPage:true,confirmed:true}).sort({dateCreated: -1}).limit(12);
  } else if (slug.includes("خوراکی")) {
    findRelativeAds = await Ads.find({foodCategory:true,inCategoryPage:true,confirmed:true}).sort({dateCreated: -1}).limit(12);
  } else if (slug.includes("دیجیتال")) {
    findRelativeAds = await Ads.find({digitalCategory:true,inCategoryPage:true,confirmed:true}).sort({dateCreated: -1}).limit(12);
  }
  const contents = await Content.find({isConfirmed: true, isPublished: true, category: slug}).sort({dateCreated: -1}).populate({path: "products", select: "name price discount image discountPercentage linkToProductPage explanation views"}).select('slug coverImage timeCreated views persianDate reviews summary products topic').limit(5);
  const newestCategory = await Content.find({category: slug,isConfirmed: true,isPublished: true}).sort({dateCreated: -1}).select("topic summary slug persianDate coverImage dateCreated");
  const ourSuggestion = await Content.find({category: slug,isConfirmed: true,isPublished: true}).sort({isUseful: -1}).select("topic summary slug isUseful coverImage");
  const mostViewed = await Content.find({category: slug,isConfirmed: true,isPublished: true}).sort({views: -1}).select("topic summary slug views coverImage");
  const highestDiscountProducts = await Product.find({isConfirmed: true, isPublished: true, category: slug}).select("name explanation persianDate views image discount discountPercentage price linkToProductPage").sort({discount: -1});
  const bestProducts = await Product.find({isConfirmed: true, isPublished: true, category: slug}).select("name explanation persianDate views image discount discountPercentage price linkToProductPage").sort({views: -1});
  slug = slug.split('-').join(" ");
  const page = slug;
  res.render("pages/categories", {
    isLoggedIn: req.session.loggedIn,
    contents,
    page,
    ads:findRelativeAds,
    title: `رونیشکا | ${slug}`,
    newestCategory,
    ourSuggestion,
    mostViewed,
    highestDiscountProducts,
    bestProducts,
    isCreator: req.session.role,
    description: 'مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و',
    author: 'امیرمحمدمیرزائی راد',
    keywords: 'رونیشکا،وبسایت رونیشکا،مجله اینترنتی رونیشکا،ورزشی رونیشکا،زیبایی رونیشکا،تفریحی رونیشکا،سلامت رونیشکا،ابزار سلامت رونیشکا،مد رونیشکا،پوشاک رونیشکا'
  })
}
exports.getRules = async (req, res) => {
  const contents = await Content.find({isConfirmed: true, isPublished: true}).sort({dateCreated: -1}).select('summary slug').limit(9);
  res.render("pages/rules-of-use", {
    isLoggedIn: req.session.loggedIn,
    contents,
    page:'',
    title: "رونیشکا | قوانین و مقررات",
    isCreator: req.session.role,
    description: 'مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و',
    author: 'امیرمحمدمیرزائی راد',
    keywords: 'رونیشکا،وبسایت رونیشکا،مجله اینترنتی رونیشکا،ورزشی رونیشکا،زیبایی رونیشکا،تفریحی رونیشکا،سلامت رونیشکا،ابزار سلامت رونیشکا،مد رونیشکا،پوشاک رونیشکا'
  })
}
exports.getSignup = async (req, res) => {
  res.render("pages/signup", {
    title: "به رونیشکا | ثبت نام و ورود به حساب کاربری",
    isCreator: req.session.role,
    page:'',
    description: 'شما میتوانید به عنوان کاربر عادی و تولید کننده محتوا در وبسایت رونیشکا ثبت نام کنید.',
    author: 'امیرمحمد میرزائی راد',
    keywords: 'ثبت نام در رونیشکا ، ثبت نام در سایت رونیشکا ، ثبت نام رونیشکا،ورود رونیشکا،ورود به رونیشکا'
  });
}
exports.getCreateYourPostnow = async (req, res) => {
  res.render("pages/createYourPostnow", {
    title: "رونیشکا | پستت رو بساز",
    page:'',
    description: 'مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و',
    author: 'امیرمحمد میرزائی راد',
    keywords: 'ساخت پست،ساخت محتوا برای رونیشکا،ساخت پست برای رونیشکا'
  });
}
exports.getContentCreatorsPanel = async (req, res) => {
	const reviews = await Review.find({}).sort({dateCreated: -1})
    .populate({
      path:"replies fromUser",
      populate:{
        path: "fromUser",
      }
    })
  const messages = await Message.find({type:"message"}).sort({dateCreated:-1})
  const requests = await Message.find({type:"request"}).sort({dateCreated:-1})
  const ads = await Ads.find({}).sort({dateCreated: -1})
  const approvedAds = await Ads.find({confirmed:true}).sort({dateCreated: -1}).select("_id")
  res.render("pages/content-creators-panel", {
    title: "رونیشکا | پنل کاربری تولید کنندگان محتوا",
    user: req.user,
    reviews,
    ads,
    requests,
    page:'',
    messages,
    approved:approvedAds,
    description: 'مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و',
    author: 'امیرمحمد میرزائی راد',
    keywords: 'رونیشکا،پنل رونیشکا،پنل کاربری رونیشکا،پنل کاربری تولید کنندگان محتوا رونیشکا'
  });
}
