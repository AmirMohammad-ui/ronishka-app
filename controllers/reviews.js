const {Review,Reply} = require("../models/reviews")
const {Content} = require("../models/contents")
const {User} = require("../models/users")
const {TempUser} = require("../models/temporaryUsers")
const ERR = require("../utilities/ERR")


exports.sendComment = async (req, res) => {
  const {email, review, fullname, contentID} = req.body;
  const user = await User.findOne({email}).select("_id fname lname role")
  if (user) {
		const newReview = new Review({
			text:review,
			fullname: user.role === "admin" ? "ادمین" : user.fname+" "+user.lname ,
			fromUser:user._id,
			forContent:contentID,
			onModel: 'user'
		})
		await Content.findByIdAndUpdate(contentID,{
			$push:{reviews:newReview._id}
		})
		await newReview.save()
		res.status(200).json({status: 'success'})
  } else {
		const tempUser = await TempUser.findOne({email})
		if(tempUser){
			const newReview = new Review({
				text:review,
				fullname:tempUser.fullname,
				fromUser:tempUser._id,
				forContent:contentID,
				onModel: 'tempUser'
			})
			await Content.findByIdAndUpdate(contentID,{
				$push:{reviews:newReview._id}
			})
			await newReview.save()
			res.status(200).json({status: 'success'})
		} else {
			const newTempUser = new TempUser({
				fullname,
				email
			})
			const newReview = new Review({
				text:review,
				fullname,
				fromUser:newTempUser._id,
				forContent:contentID,
				onModel:'tempUser'
			})
			await Content.findByIdAndUpdate(contentID,{
				$push:{reviews:newReview._id}
			})
			await newTempUser.save()
			await newReview.save()
			res.status(200).json({status: 'success'})
		}
	}
} 
exports.sendReply = async (req, res) => {
  const {email, text, fullname,contentID, reviewID} = req.body;
  const user = await User.findOne({email}).select("_id fname lname role")
  if (user) {
		const newReview = new Reply({
			text,
			fullname: user.role === "admin" ? "ادمین" : user.fname+" "+user.lname ,
			fromUser: user._id,
			forContent: contentID,
			forReview: reviewID,
			onModel: 'user'
		})
		await Review.findByIdAndUpdate(reviewID,{
			$push:{replies:newReview._id}
		})
		await newReview.save()
		res.status(200).json({status: 'success'})
  } else {
		const tempUser = await TempUser.findOne({email})
		if(tempUser){
			const newReview = new Reply({
				text,
				fullname: tempUser.fullname,
				fromUser: tempUser._id,
				forContent: contentID,
				forReview: reviewID,
				onModel: 'tempUser'
			})
			await Review.findByIdAndUpdate(reviewID,{
				$push:{replies:newReview._id}
			})
			await newReview.save()
			res.status(200).json({status: 'success'})
		} else {
			const newTempUser = new TempUser({
				fullname,
				email
			})
			const newReview = new Reply({
				text,
				fullname,
				fromUser:newTempUser._id,
				forContent: contentID,
				forReview: reviewID,
				onModel:'tempUser'
			})
			await Review.findByIdAndUpdate(reviewID,{
				$push:{replies:newReview._id}
			})
			await newTempUser.save()
			await newReview.save()
			res.status(200).json({status: 'success'})
		}
	}
} 

exports.searchForComment = async(req,res,next)=>{
	const result = await Review.findById(req.query.id).populate("fromUser","email")
	const reply = await Reply.findById(req.query.id).populate("fromUser","email")
	if(result){
		res.status(200).json({
			status:"success",
			result
	})
	}else if(reply){
		res.status(200).json({
			status:"success",
			result:reply
	})
	}else{
		return next(new ERR("کامنتی با این آیدی پیدا نشد.",404))
	}
}
exports.confirmComment = async(req,res)=>{
	const review = await Review.findById(req.params.id)
	const reply = await Reply.findById(req.params.id)
	if(review){
		await Review.findByIdAndUpdate(req.params.id,{
			$set:{
				isConfirmed:true
			}
		})
		res.status(200).send(`
			<h1>کامنت تأیید شد .</h1>
		`)
	}else if(reply){
		await Reply.findByIdAndUpdate(req.params.id,{
			$set:{
				isConfirmed:true
			}
		})
		res.status(200).send(`
			<h1>کامنت تأیید شد .</h1>
		`)
	}else{
		return res.status(404).send("<h1>کامنتی با این آیدی وجود ندارد.</h1>")
	}
}
exports.unConfirmComment = async(req,res)=>{
	const review = await Review.findById(req.params.id)
	const reply = await Reply.findById(req.params.id)
	if(review){
		if(review.replies.length > 0){
			review.replies.forEach(async el=>{
				if(await Reply.findById(el)){
					await Reply.findByIdAndDelete(el)
				}
			})
		}
		await Review.findByIdAndDelete(req.params.id)
		res.status(200).send(`
			<h1>کامنت رد شد .</h1>
		`)
	}else if(reply){
		await Reply.findByIdAndDelete(req.params.id)
		res.status(200).send(`
			<h1>کامنت رد شد .</h1>
		`)
	}else{
		return res.status(404).send("<h1>کامنتی با این آیدی وجود ندارد.</h1>")
	}
}