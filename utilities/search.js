const {
    Content
} = require("../models/contents")

exports.search = async (req, res) => {
    console.log(req.query)
    const q = req.query.q.trim();
    Content.find({
        topic: {
            $regex: new RegExp(q)
        },
        isConfirmed:true
    },{
        _id: 0,
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
            res.json(data);
        }
    }).limit(10)
    const searchInSummary = () => {
        Content.find({
            summary: {
                $regex: new RegExp(q)
            },
            isConfirmed:true
        }, {
            _id: 0,
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
                res.json({
                    status: "NOT FOUND",
                    statusCode: 404,
                    message: `برای <span style="color: lightgray;">${q}</span> نتیجه ای یافت نشد.`
                });
            } else {
                res.json(data);
            }
        }).limit(10)
    }
}