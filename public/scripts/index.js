import LazyLoad from "vanilla-lazyload";
const lazyload = new LazyLoad({
	elements_selector: ".lazy"
});
import "normalize.css";
import "@popperjs/core";
import "./bootstrap.js"
import axios from 'axios';
import "./persian-calendar";
import "./signup-login";
import "./managemant.js";
import {
	show_alert,
	hideAlert
} from './signup-login';
$('.carousel').carousel({
	interval: 1000 * 10
});
let loader = document.getElementById("loader-container")
window.addEventListener("load", function () {
	loader.style.display = "none";
	loader.style.zIndex = "-10";
})
const policyBtn = document.getElementById("policy-accepted");
const policy_show = document.getElementById('policy-agreement')
if (document.cookie.includes("policy") && document.getElementById('policy-agreement')) {
	policy_show.parentElement.removeChild(policy_show)
}
if (!document.cookie.includes("policy") && document.getElementById('policy-agreement')) {
	policyBtn.addEventListener('click', accept_policies);
	async function accept_policies() {
		try {
			const res = await axios.get('/accepting-policy-confirmed')
		} catch (err) {
			location.reload();
		}
	}
}

$(function () {
	$(".justpersian").bind('input propertychange', function () {
		if (!/^[پچجحخهعغفقثصضشسیبلاتنمکگوئدذرزطظژؤإأءًٌٍَُِّ\s\n\r\t\d\(\)\[\]\{\}.,،;\-؛]+$/.test($(this).val())) {
			show_alert("فقط حروف فارسی مورد قبول است", 'failed');
			$(this).val("");
		}
	});
});
(function () {
	'use strict';
	window.addEventListener('load', function () {
		// Fetch all the forms we want to apply custom Bootstrap validation styles to
		let forms = document.getElementsByClassName('needs-validation');
		// Loop over them and prevent submission
		let validation = Array.prototype.filter.call(forms, function (form) {
			form.addEventListener('submit', function (event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
		});
	}, false);
})();



if (document.getElementById("searchOperation")) {
	const searchOperation = document.getElementById("searchOperation")
	searchOperation.addEventListener("submit", DoSearch);

	function DoSearch(e) {
		e.preventDefault();
		const searchInput = document.getElementById("search-input-operation")
		if (!searchInput.value || searchInput.value === '' || searchInput.value === null) {
			searchInput.style.border = '2px solid red';
			show_alert('لطفا فیلد را پر کنید.', 'failed')
			return;
		}
		const search_input_value = searchInput.value;
		$.ajax({
			url: '/search?q=' + search_input_value,
			type: 'GET',
			success: function (data, status, xhr) {
				if (data.status === 'NOT FOUND' || data.statusCode === 404) return show_alert(data.message, 'notfound')
				openSearchBox(data);
			}
		});
	}
	const searchOperation_footer = document.getElementById("search-operation-footer")
	searchOperation_footer.addEventListener("submit", DoSearch_footer);

	function DoSearch_footer(e) {
		e.preventDefault();
		const searchInput_footer = document.getElementById("search-input-operation-footer")
		if (!searchInput_footer.value || searchInput_footer.value === '' || searchInput_footer.value === null) {
			searchInput_footer.style.border = '2px solid red';
			show_alert('لطفا فیلد را پر کنید.', 'failed');
			return;
		}
		const search_input_footer_value = searchInput_footer.value;
		$.ajax({
			url: '/search?q=' + search_input_footer_value,
			type: 'GET',
			success: function (data, status, xhr) {
				if (data.status === 'NOT FOUND' || data.statusCode === 404) return show_alert(data.message, 'notfound')
				openSearchBox(data);
			}
		});
	}

	function openSearchBox(data) {
		loader.style.display = "block";
		loader.style.zIndex = "4444";
		const template = `
		<div id="search-box-container-header" class="animate__animated animate__fadeIn search-box-container scrollify-search">
			<div id="close-btn-header">
				<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus"
					viewBox="0 0 16 16">
					<path fill-rule="evenodd"
						d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
				</svg>
			</div>
			<div id="results-search" class="results">
				<div class="numberOfResults">
					<span>نتیجه برای این جستجو یافت شد :</span>
					<span class="Parastoo">${data.length}</span>
				</div>
			</div>
		</div>`;
		let resultsTemplate = '';
		data.forEach(data => {
			resultsTemplate += `
			<div class="result--card">
				<a href="/content/${data.slug}">
					<div style="background-image: url('/uploads/images/content-cover-images/${data.coverImage}');"
						class="card--image">
					</div>
				</a>
				<div class="card--body">
					<div class="card--body__topic">
						${data.topic}
					</div>
					<div class="card--body__text">
						${data.summary}
					</div>
					<div class="card--body__link">
						<a href="/content/${data.slug}" class="link">برو به این صفحه</a>
					</div>
				</div>
			</div>`
		});
		setTimeout(()=>{
			loader.style.display = "none";
			loader.style.zIndex = "-10";
			document.body.insertAdjacentHTML('afterbegin', template);
			const searchBox = document.getElementById("search-box-container-header");
			const results = document.getElementById("results-search");
			results.insertAdjacentHTML("beforeend", resultsTemplate);
			const closeBtn = document.getElementById("close-btn-header");

			closeBtn.addEventListener("click", closeSeachBox);
			function closeSearchBoxOnClickOutside(e){
				if(!searchBox.contains(e.target)){
					searchBox.classList.replace("animate__fadeIn","animate__fadeOut")
					setTimeout(()=>{
						searchBox.parentElement.removeChild(searchBox);
						window.removeEventListener("click",closeSearchBoxOnClickOutside)
					},1000)
				}
			}
			window.addEventListener("click",closeSearchBoxOnClickOutside)
			function closeSeachBox() {
				searchBox.classList.replace("animate__fadeIn","animate__fadeOut")
				setTimeout(()=>{
					searchBox.parentElement.removeChild(searchBox);
				},1000)
			}
		},1000)
	}
}

if (location.href.includes("/content/")) {
	const sendComment = document.getElementById("leaveComment");
	const fullName_Filed = document.getElementById("full-name-comment");
	const email_Filed = document.getElementById("email-comment");
	const review_Field = document.getElementById("comment");
	const triggerContentIdReview = document.getElementById("triggerContentIdReview")
	sendComment.addEventListener("submit", (e) => {
		e.preventDefault();
		let errorMessages = [];
		if (!email_Filed.value || email_Filed.value.trim() === '' || email_Filed.value.trim() === null) errorMessages.push("لطفا ایمیل را وارد کنید .")
		if (!fullName_Filed || fullName_Filed.value.trim() === '' || fullName_Filed.value.trim() === null) errorMessages.push("لطفا نام را وارد کنید .")
		if (!review_Field.value || review_Field.value.trim() === '' || review_Field.value.trim() === null) errorMessages.push("لطفادیدگاه خود را وارد کنید .")
		if (errorMessages.length > 0) return show_alert(errorMessages, 'failed');
		const commentData = {
			email: email_Filed.value.trim(),
			fullname: fullName_Filed.value.trim(),
			review: review_Field.value.trim(),
			contentID:triggerContentIdReview.value.trim()
		}
		axios.post("/send-comment", commentData).then((res) => {
			show_alert(` ${fullName_Filed.value} عزیز دیدگاه شما پس از تأیید مدیر سایت ثبت می شود.`, 'success')
			sendComment.reset();
		}).catch((err) => {
			show_alert(err.response.data.message, 'failed');
		});
	});
	const wasnotusefulBtn = document.getElementById("minusonescore");
	const wasusefulBtn = document.getElementById("addonescore");
	const usefulContainer = document.getElementById("usefulnessContainer");
	wasusefulBtn.addEventListener("click", function () {
		axios.get("/wasituseful", {
			params: {
				usefulRate: 1,
				forContent: slug
			}
		}).then((res) => {
			show_alert("از شما بابت ارسال نظر متشکریم.", 'success');
			usefulContainer.parentElement.removeChild(usefulContainer)
		}).catch(err => {
			show_alert('مشکلی در ارسال نظر شما بوجود آمده است لطفا این موضوع را با پشتیبانی در میان بگذارید.', 'failed')
		});
	})
	wasnotusefulBtn.addEventListener("click", function () {
		axios.get("/wasituseful", {
			params: {
				usefulRate: -1,
				forContent: slug
			}
		}).then(()=>{
			show_alert("از شما بابت ارسال نظر متشکریم.", 'success');
			usefulContainer.parentElement.removeChild(usefulContainer)
		}).catch(err=>{
			show_alert('مشکلی در ارسال نظر شما بوجود آمده است لطفا این موضوع را با پشتیبانی در میان بگذارید.', 'failed')
		});
	});
	if(document.getElementById("comments_section")){
		const replyBtn = document.getElementById("reply-btn")
		const replySection = document.getElementById("replyOnComment")
		replyBtn.addEventListener("click",function(){
			replySection.classList.toggle("d-block")
		})
		const nameReplyInput = document.getElementById("full-name-comment-reply")
		const emailReplyInput = document.getElementById("email-comment-reply")
		const replyText = document.getElementById("reply-text")
		const triggerContentId = document.getElementById("triggerContentId")
		const triggerReviewId = document.getElementById("triggerReviewId")
		replySection.addEventListener("submit",function(e){
			e.preventDefault();
			let replyErrormessages=[];
			if(nameReplyInput.value.trim() === '' || nameReplyInput.value.trim() === null) replyErrormessages.push("لطفا نام خود را وارد کنید.") 
			if(emailReplyInput.value.trim() === '' || emailReplyInput.value.trim() === null) replyErrormessages.push("لطفا ایمیل خود را وارد کنید.") 
			if(replyText.value.trim() === '' || replyText.value.trim() === null) replyErrormessages.push("لطفا متن پیام خود را وارد کنید.") 
			if(replyErrormessages.length > 0){
				show_alert(replyErrormessages,"failed")
				return;
			}
			let replyEmailVal = emailReplyInput.value.trim();
			let replyNameVal = nameReplyInput.value.trim();
			let replyTextVal = replyText.value.trim();
			let triggerContentIdVal = triggerContentId.value.trim();
			let triggerReviewIdVal = triggerReviewId.value.trim();
			let replyForm = {
				email:replyEmailVal,
				fullname:replyNameVal,
				text:replyTextVal,
				reviewID:triggerReviewIdVal,
				contentID:triggerContentIdVal 
			}
			axios.post("/reply-comment",replyForm)
				.then((res)=>{
					show_alert("پاسخ شما دریافت و پس از تأیید مدیر سایت ثبت خواهد شد. ","success")
					replySection.reset();
				})
				.catch(err=>{
					show_alert(err.response.data.message,"failed");
				})
		})
	}
}
const contactUsFormBtn = document.getElementById("contactUsForm")
const fullnameContact = document.getElementById("fullnameContactForm")
const emailContact = document.getElementById("emailContactForm")
const textMessageContact = document.getElementById("textMessageContactForm")
contactUsFormBtn.addEventListener("submit",(e)=>{
	let contactErrorMsg = [];
	if(fullnameContact.value.trim() === "") contactErrorMsg.push("وارد کردن نام ضروری است.") 
	if(emailContact.value.trim() === "") contactErrorMsg.push("وارد کردن ایمیل برای ارتباط با شما ضروری است.") 
	if(textMessageContact.value.trim() === "") contactErrorMsg.push("وارد کردن متن پیام ضروری است.") 
	let contactFormData = new FormData()
	contactFormData.append("fullname",fullnameContact.value.trim())
	contactFormData.append("email",emailContact.value.trim())
	contactFormData.append("textMessage",textMessageContact.value.trim())
	axios.post("/new/message",contactFormData)
	.then(res=>{
		show_alert(res.data.message,"success")
	})
	.catch(err=>{
		console.log(err)
	})
	e.preventDefault();
})