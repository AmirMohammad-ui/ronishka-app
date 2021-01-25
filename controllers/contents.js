const {Content} = require("../models/contents");
const ERR = require("../utilities/ERR");

exports.wasituseful = async (req, res) => {
  const wasOrwasnt = req.query.usefulRate;
  await Content.findOneAndUpdate({
    slug: req.query.forContent
  }, {
    $inc: {
      isUseful: wasOrwasnt
    }
  })
  res.status(200).json({status: "success"})
}

exports.lookForKeyword = async (req, res, next) => {
  const contents = await Content.find({isConfirmed: true, isPublished: true}).sort({dateCreated: -1}).select("slug coverImage persianDate summary topic").limit(5);
  const q = req.query.q.trim();
  Content.find({
    topic: {
      $regex: new RegExp(q)
    },
    isConfirmed: true
  }, {
    __v: 0,
    images: 0,
    post: 0,
    files: 0,
    isConfirmed: 0,
    isPublished: 0,
    keywords: 0,
    category: 0,
    products: 0,
    resource: 0
  }, function (err, data) {
    if (data.length === 0 || data === []) {
      searchInSummary();
    } else {
      res.render("pages/content-keyword", {
        data, 
        isCreator: req.session.role,
        contents,
        title: "رونیشکا",
        isLoggedIn: req.session.loggedIn,
        description: `مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و ...`,
        keywords: ',رونیشکا,وبسایت رونیشکا,مجله اینترنتی رونیشکا,ورزشی رونیشکا,زیبایی رونیشکا,تفریحی رونیشکا,سلامت رونیشکا,ابزار سلامت رونیشکا,مد رونیشکا,پوشاک رونیشکارونیشکا,مجله اینترنتی,سلامت,زیبایی,مد,پوشاک,ورزش,ورزشی,پزشکی,تفریحی,تفریح,تکنولوژی,دیجیتال',
        author: "امیرمحمد میرزائی راد"
      });
    }
  }).limit(10)
  const searchInSummary = () => {
    Content.find({
      summary: {
        $regex: new RegExp(q)
      },
      isConfirmed: true
    }, {
      __v: 0,
      images: 0,
      post: 0,
      files: 0,
      isConfirmed: 0,
      isPublished: 0,
      keywords: 0,
      category: 0,
      products: 0,
      resource: 0
    }, function (err, data) {
      if (data.length === 0) {
        return next(new ERR(`برای <span style="color: lightgray;">${q}</span> نتیجه ای یافت نشد.`, 404))
      } else {
        res.render("pages/content-keyword", {
          data, 
          contents,
          isCreator: req.session.role,
          title: "رونیشکا",
          isLoggedIn: req.session.loggedIn,
          description: `مجله اینترنتی رونیشکا گرد آورنده ی مطالب مفید و متنوع در موضوع هایی چون: ورزشی،تفریحی،سلامت،تکنولوژی،زیبایی،مدوپوشاک و ...`,
          keywords: ',رونیشکا,وبسایت رونیشکا,مجله اینترنتی رونیشکا,ورزشی رونیشکا,زیبایی رونیشکا,تفریحی رونیشکا,سلامت رونیشکا,ابزار سلامت رونیشکا,مد رونیشکا,پوشاک رونیشکارونیشکا,مجله اینترنتی,سلامت,زیبایی,مد,پوشاک,ورزش,ورزشی,پزشکی,تفریحی,تفریح,تکنولوژی,دیجیتال',
          author: "امیرمحمد میرزائی راد"
        });
      }
    }).limit(10)
  }
}
