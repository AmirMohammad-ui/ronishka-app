import {
	show_alert
} from './signup-login';
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Attaches from "@editorjs/attaches";
import Delimiter from "@editorjs/delimiter";
import Image from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import validator from 'validator';
if (document.getElementById("editorjs") && location.href.includes("create-content-post")) {
	let editorjs;
	function showEditor(contentBlock){
		editorjs = new EditorJS({
			holder: 'editorjs',
			tools: {
				header: {
					class: Header,
					inlineToolbar: true,
					shortcut: 'CMD+SHIFT+H', 
					config: {
						placeholder: 'لطفا تیتر خود را وارد کنید . . .',
						levels: [2, 3, 4, 5, 6], 
						defaultLevel: 2
					}
				},
				paragraph: {
					class: Paragraph,
					inlineToolbar: true,
				},
				warning: {
					class: Warning,
					inlineToolbar: true,
					shortcut: 'CMD+SHIFT+W',
					config: {
						titlePlaceholder: 'Title',
						messagePlaceholder: 'Message',
					},
				},
				marker: {
					class: Marker, 
					shortcut: 'CMD+SHIFT+M',
				},
				attaches:{
					class: Attaches,
					config:{
						buttonText: 'فایل را انتخاب کنید.',
						errorMessage: 'آپلود فایل با مشکل مواجه شد.',
						endpoint: "/new/upload-files"
					}
				},
				underline: Underline, 
				delimiter: Delimiter, 
				table: {
					class: Table,
					inlineToolbar: true,
					config: {
						rows: 2,
						cols: 3,
					},
				},
				quote: {
					class: Quote,
					inlineToolbar: true,
					shortcut: 'CMD+SHIFT+O',
					config: {
						quotePlaceholder: 'نفل خود را اینجا بنویسید . . . ',
						captionPlaceholder: 'کپشن نقل قول ',
					},
				},
				list: {
					class: List,
					inlineToolbar: true,
				},
				inlineCode: {
					class: InlineCode,
					shortcut: 'CMD+SHIFT+M',
				},
				image: {
					class: Image,
					config: {
						uploader:{
							uploadByFile(file){
								const editorjsImageFile = new FormData()
								editorjsImageFile.append("image",file)
								return axios.post("/new/upload-images",editorjsImageFile, {
									headers: {
										'Content-Type': 'multipart/form-data'
									}
								})
								.then((res)=>{
									if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
										show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
										return
									}
									return res.data;
								}).catch((err)=>{
									show_alert(err.response.data.message,"failed")
								})
							}
						},
						buttonText: 'تصویر خود را انتخاب کنید.',
						errorMessage: 'آپلود تصویر با مشکل روبه رو شد.',
						field: "image"
					}
				}
			},
			data: {
				time: Date.now(),
				blocks: contentBlock.post,
				version: "2.11.10"
			},
			i18n: {
				messages: {
					ui: {
					},
					toolNames: {
						"Text": "متن",
						"Heading": "تیتر",
						"List": "لیست",
						"Warning": "اخطار | نکته",
						"Checklist": "چک لیست",
						"Quote": "نقل قول",
						"Code": "کد",
						"Delimiter": "جدا کننده",
						"Raw HTML": "HTML",
						"Table": "جدول",
						"Link": "لینک",
						"Marker": "ماژیک",
						"Bold": "فونت ضخیم",
						"Italic": "Italic",
						"InlineCode": "inline code",
						"Image": "اضافه کردن تصویر"
					},
					tools: {
						"list": {
							"Ordered": "بدون ترتیب",
							"Unordered": "با ترتیب"
						},
						"warning": { 
							"Title": "موضوع اخطار",
							"Message": "متن اخطار",
						},
						"link": {
							"Add a link": "یک لینک اضافه کنید"
						},
						"stub": {
							'The block can not be displayed correctly.': 'فاصله به طور صحیح نمایش داده نمی شود.'
						}
					},
					blockTunes: {
						"delete": {
							"Delete": "حذف"
						},
						"moveUp": {
							"Move up": "انتقال به بالا"
						},
						"moveDown": {
							"Move down": "انتقال به پایین"
						}
					},
				}
			},
			placeholder: 'پست خود را اینجا بسازید . . .',
			logLevel: 'VERBOSE', // VERBOSE , INFO , WARN , ERROR
		});
		addEventListener("beforeunload",()=>{
			
			editorjs.save().then(async (post) => {
				axios.post('/new/create-content-post', post, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then((res) => {
					if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
						show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
						return
					}
					show_alert(`محتوای شما به آیدی ${res.data.content._id}  با موفقیت آپدیت شد.`, 'success')
				}).catch(err => {
					show_alert(err.response.data.message, 'failed')
				})
			}).catch((error) => {
				show_alert(error, 'failed')
			});
		})
	}

	const checkContainer = document.getElementById("check-container");
	const checkContentButton = document.getElementById("checkContentIdButton");
	const checkContent_field = document.getElementById("checkContentId");
	checkContentButton.addEventListener("click", (e) => {
		e.preventDefault();
		if (checkContent_field.value.trim() === null || checkContent_field.value.trim() === '' || !checkContent_field.value.trim()) {
			return show_alert('لطفا آیدی را وارد کنید.', "failed")
		}
		let checkContentId = checkContent_field.value.trim();
		axios.post("/new/checkContentId", {
				contentID: checkContentId
			})
			.then((res) => {
				if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
				show_alert(res.data.message, "success");
				checkContainer.parentElement.removeChild(checkContainer);
				axios.get("/new/getContentToPrefill",{
					params: {
						id:checkContentId
					}
				}).then(res=>{
					if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
						show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
						return
					}
					showEditor(res.data.content)
					document.getElementById("editorjsContainer").style.display = "block";
				}).catch(err=>{console.log(err);show_alert(err.response.data.message,"failed")})
			})
			.catch(err => {
				show_alert(err.response.data.message, "failed");
			})
	})
	// ================================================ editor js data
	document.getElementById("editorData").addEventListener("click", (e) => {
		e.preventDefault();
		if (checkContent_field.value.trim() === null || checkContent_field.value.trim() === '' || !checkContent_field.value.trim()) {
			return show_alert('لطفا آیدی را وارد کنید.', "failed")
		}
		editorjs.save().then(async (post) => {
			axios.post('/new/create-content-post', post, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => {
				if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
				show_alert(`محتوای شما به آیدی ${res.data.content._id}  با موفقیت آپدیت شد.`, 'success')
				location.assign("/creators-panel")
			}).catch(err => {
				show_alert(err.response.data.message, 'failed')
			})
		}).catch((error) => {
			show_alert(error, 'failed')
		});
	})
}
if (location.href.includes("creators-panel")) {
	// ---------------------------------------------------------------------------------------------------- getting data of feilds
	let topic_feild = document.getElementById("post_topic")
	let category_feild = document.getElementById("post_category")
	let resource_feild = document.getElementById("post_resource")
	let coverImage_feild = document.getElementById("post_main_picture")
	let keywords_feild = document.getElementById("post_keywords")
	let summary_feild = document.getElementById("post_summary")
	let post_metaTagDescription = document.getElementById("post_metaTagDescription")
	// ---------------------------------------------------------------------------------------------------- getting data of feilds
	let sendData = document.getElementById("createForm");
	const addContentID = (content_id) => {
		if (document.getElementById("ContentID")) {
			const conid = document.getElementById("ContentID");
			conid.parentElement.removeChild(conid);
			const conidbtn = document.getElementById("ContentID_btn");
			conidbtn.parentElement.removeChild(conidbtn);
		}
		const addContentIDElement = document.getElementById("createYourPostNow");
		const addContentIDTemplate = `<div class="animate__animated animate__backInRight mx-auto my-3 contentID__box">
            <span id="ContentID">${content_id}</span>
            <button id="ContentID_btn" class="btn btn-dark rounded-0">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi mx-2 bi-clipboard-plus" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"/>
								<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
								<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
							</svg>
                کپی کن
            </button>
        </div>`;
		addContentIDElement.insertAdjacentHTML('beforeend', addContentIDTemplate)
		const contentID_btn = document.getElementById("ContentID_btn");
		contentID_btn.addEventListener("click", copyContentID);

		function copyContentID() {
			CopyToClipboard("ContentID");
			show_alert('آیدی کپی شد.', 'success');
		}

		function CopyToClipboard(id) {
			var r = document.createRange();
			r.selectNode(document.getElementById(id));
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(r);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		}
	}

	sendData.addEventListener("submit", (e) => {
		e.preventDefault();
		let errorMessages = [];
		// ---------------- getting values
		if (!topic_feild.value.trim() || topic_feild.value.trim() === '' || topic_feild.value.trim() === null) errorMessages.push("وارد کردن موضوع برای محتوا ضروری است.")
		if (!coverImage_feild.value.trim() || coverImage_feild.value.trim() === '' || coverImage_feild.value.trim() === null) errorMessages.push("وارد کردن یک تصویر برای محتوا ضروری است.")
		if (!keywords_feild.value.trim() || keywords_feild.value.trim() === '' || keywords_feild.value.trim() === null) errorMessages.push("وارد کردن کلمات کلیدی برای محتوا حداقل10 کلمه ضروری است.")
		if (keywords_feild.value.includes("،")) {
			if (keywords_feild.value.split("،").length < 10)
				errorMessages.push("تعداد کلمات کلیدی باید حداقل 10 تا باشد.")
		} else if (keywords_feild.value.includes(",")) {
			if (keywords_feild.value.split(",").length < 10)
				errorMessages.push("تعداد کلمات کلیدی باید حداقل 10 تا باشد.")
		} else {
			if (keywords_feild.value.split(",").length < 10)
				errorMessages.push("تعداد کلمات کلیدی باید حداقل 10 تا باشد.")
		}
		if (!summary_feild.value.trim() || summary_feild.value.trim() === '' || summary_feild.value.trim() === null) errorMessages.push("وارد کردن خلاصه ای از محتوا حداقل 3 خط ضروری است.")
		if (summary_feild.value.trim().length < 100) errorMessages.push("وارد کردن خلاصه ای از محتوا حداقل 100 حرف خط ضروری است.")
		if (summary_feild.value.trim().length > 500) errorMessages.push("محتوا حداکثر باید 500 حرف باشد.")
		if (!post_metaTagDescription.value.trim() || post_metaTagDescription.value.trim() === '' || post_metaTagDescription.value.trim() === null) errorMessages.push("وارد کردن خلاصه ای از محتوا حداقل60 حرف برای قرارگرفتن در تگ متا است.")
		if (post_metaTagDescription.value.trim().length < 60) errorMessages.push("وارد کردن خلاصه ای از محتوا حداقل60 حرف برای قرارگرفتن در تگ متا ضروری است.")
		if (post_metaTagDescription.value.trim().length > 150) errorMessages.push("توضیح متا تگ باید حداکثر150 حرف باشد.")
		if (errorMessages.length > 0) return show_alert(errorMessages, 'failed')
		if (keywords_feild.value.includes("،")) keywords_feild.value.split("،").join(",")
		let topic = topic_feild.value.trim();
		let category = category_feild.value.trim();
		let resource = resource_feild.value.trim();
		let coverImage = coverImage_feild.files[0];
		let keywords = keywords_feild.value.trim();
		let summary = summary_feild.value.trim();
		let metaDescription = post_metaTagDescription.value.trim();
		let formData = new FormData();
		// ----------------------storing data into formData obj
		formData.append("topic", topic);
		formData.append("category", category);
		formData.append("resource", resource);
		formData.append("keywords", keywords);
		formData.append("summary", summary);
		formData.append("metaDescription", metaDescription);
		formData.append("coverImage", coverImage);
		axios.post('/new/create-content', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => {
				if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
				show_alert(`محتوای شما به شماره ${res.data.content._id}  با موفقیت ذخیره شد.`, 'success')
				addContentID(res.data.content._id);
				sendData.reset();
		}).catch(err => {
			show_alert(err.response.data.message, 'failed')
		})
	});
	// ================================================ getting the product form data
	const ProductForm = document.getElementById("getProductData")
	ProductForm.addEventListener('submit', getAndSendProductData)
	const productName = document.getElementById("product_name");
	const forContent_field = document.getElementById("for_content_number");
	const productPrice = document.getElementById("product_price");
	const productDiscount = document.getElementById("product_discount");
	const productSeller = document.getElementById("product_seller");
	const productLink = document.getElementById("product_link_to_page");
	const productExplanation = document.getElementById("product_explanation");
	const productPicture = document.getElementById("product_picture");
	const productUploadThis = document.getElementById("upload_this_product");

	function getAndSendProductData(e) {
		e.preventDefault();
		let errorMessages = [];
		if (!forContent_field.value.trim() || forContent_field.value.trim() === '' || forContent_field.value.trim() === null) errorMessages.push("وارد کردن آیدی پست برای محصول ضروری است.")
		if (!productName.value.trim() || productName.value.trim() === '' || productName.value.trim() === null) errorMessages.push("وارد کردن نام برای محصول ضروری است.")
		if (!productPrice.value.trim() || productPrice.value.trim() === '' || productPrice.value.trim() === null) errorMessages.push("وارد کردن قیمت  برای محصول ضروری است.")
		if (productDiscount.value.trim() < 0) errorMessages.push("تخفیف نمی تواند کمتر از 0 تومان باشد.")
		if (!productExplanation.value.trim() || productExplanation.value.trim() === '' || productExplanation.value.trim() === null) errorMessages.push("وارد کردن توضیح حداقل دو خط برای محصول ضروری است.")
		if (!productLink.value.trim() || productLink.value.trim() === '' || productLink.value.trim() === null) errorMessages.push("وارد کردن لینک  محصول ضروری است.")
		if (productExplanation.value.trim().length < 200) errorMessages.push("وارد کردن توضیح حداقل دو خط برای محصول ضروری است.")
		if (productExplanation.value.trim().length > 500) errorMessages.push("متن وارد شده بیش از مقدار مجاز حداکثر 500 حرف می باشد.")
		if (!productPicture.files[0] || productPicture.files[0] === '' || productPicture.files[0] === null) errorMessages.push("انتخاب کردن یک تصویر برای محصول ضروری است.")
		if (!validator.isURL(productLink.value)) errorMessages.push('فرمت لینک وارد شده صحیح نمی باشد.')
		if (errorMessages.length > 0) return show_alert(errorMessages, 'failed')
		let formData = new FormData();
		let name = productName.value.trim();
		let price = productPrice.value.trim();
		let discount = productDiscount.value.trim();
		let seller = productSeller.value.trim();
		let linkToProductPage = productLink.value.trim();
		let forContent = forContent_field.value.trim();
		let explanation = productExplanation.value.trim();
		let image = productPicture.files[0];
		const uploadThis = productUploadThis.value.trim();
		formData.append("name", name);
		formData.append("forContent", forContent);
		formData.append("price", price);
		formData.append("discount", discount);
		formData.append("seller", seller);
		formData.append("linkToProductPage", linkToProductPage);
		formData.append("explanation", explanation);
		formData.append("image", image);
		formData.append("uploadThis", uploadThis);
		axios.post("/new/create-product", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((res) => {
				if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
				show_alert(res.data.message, "success");
				ProductForm.reset();
			})
			.catch((err) => {
				show_alert(err.response.data.message, "failed")
			});
	}
	// =========================================== Content Template
	function showSearchResult(result,pathId,operation){
		let post_content = '';
		result.post.forEach(el => {
			if(el.type === 'image'){
				post_content += `<img class="w-100 cover" src="/uploads/images/content/image-content-${ el.data.file.url.split("image-content-")[1] }" alt="${ result.topic }">\n`
			} else if(el.type === "header"){
				if(el.data.level == 2){
					if(el.data.text.includes("&lt;")){
						post_content += `<h2 class="px-3 py-2 text-right">${ el.data.text.split("&lt;").join("<") }</h2>\n`
					}else{
						post_content += `<h2 class="px-3 py-2 text-right">${ el.data.text }</h2>\n`
					}
				} else if(el.data.level == 3){
						if(el.data.text.includes("&lt;")){
							post_content += `<h3 class="px-3 py-2 text-right">${ el.data.text.split("&lt;").join("<") }</h3>\n`
						}else{
							post_content += `<h3 class="px-3 py-2 text-right">${ el.data.text }</h3>\n`
						}
				} else if(el.data.level == 4){
						if(el.data.text.includes("&lt;")){
							post_content += `<h4 class="px-3 py-2 text-right">${ el.data.text.split("&lt;").join("<") }</h4>\n`
						}else{
							post_content += `<h4 class="px-3 py-2 text-right">${ el.data.text }</h4>\n`
						}
				} else if(el.data.level == 5){
						if(el.data.text.includes("&lt;")){
							post_content += `<h5 class="px-3 py-2 text-right">${ el.data.text.split("&lt;").join("<") }</h5>\n`
						}else{
							post_content += `<h5 class="px-3 py-2 text-right">${ el.data.text }</h5>\n`
						}
				} else if(el.data.level == 6){
						if(el.data.text.includes("&lt;")){
							post_content += `<h6 class="px-3 py-2 text-right">${ el.data.text.split("&lt;").join("<") }</h6>\n`
						}else{
							post_content += `<h6 class="px-3 py-2 text-right">${ el.data.text }</h6>\n`
						}
				} 
			}else if(el.type === "paragraph"){
				if (el.data.text.includes("&lt;")) {
					post_content += `<p class="p-3 text-right text-justify lh-1">${  el.data.text.split("&lt;").join("<")  }</p>\n`
				}else{
					post_content+=`<p class="p-3 text-right text-justify lh-1">${ el.data.text }</p>\n`
				}
			}else if(el.type==="list"){
				if(el.data.style==="unordered"){
					post_content += `<ul class="py-2 mr-4 text-right">\n`
					el.data.items.forEach(e => {
						post_content += `<li>${ e }</li>}</li>\n`
					})
					post_content += `</ul>\n`
				}else{
					post_content += `<ol class="py-2 mr-4 text-right">\n`
					el.data.items.forEach(e => {
						post_content += `<li>${ e }</li>}</li>\n`
					})
					post_content += `</ol>\n`
				}
			}else if(el.type==='quote'){
				post_content+=`
				<blockquote class="mr-3 text-right blockquote">
					<p class="mb-0">
						${ el.data.text }
					</p>
					<footer class="blockquote-footer">
						<cite title="Source Title">
							${ el.data.caption }
						</cite>
					</footer>
    	  </blockquote>\n`
			}else if(el.type === "delimiter"){
				post_content += `
				<div class="text-center">
					<span class="mx-1 font-5">*</span>
					<span class="mx-1 font-5">*</span>
					<span class="mx-1 font-5">*</span>
				</div>\n`
			}else if(el.type === "warning"){
				post_content += `<div class="text-right alert alert-danger" role="alert">\n`
				if(el.data.title !== '' || el.data.title || el.data.title !== null){
					post_content += `
					<h4 class="alert-heading">
						${ el.data.title }
					</h4>
					<hr>\n`
				}
				post_content += `<p class="mb-0">${ el.data.message }</p>\n</div>\n`
			}else if(el.type === "table"){
				post_content += `
				<div class="table-responsive">
					<table class="table table-striped table-hover ">
						<thead class="thead-dark">
							<tr>\n`
				for(let i =0; i<el.data.content[0].length;i++){
          post_content += `<th class="text-center" scope="col">${ el.data.content[0][i] }</th>\n`
				}
				post_content += `
				</tr>
				</thead>
				<tbody>\n`
				for(let i =1 ; i<el.data.result.length;i++){
					post_content += `<tr>\n`
					el.data.content[i].forEach(e=>{
						post_content += `
						<td class="text-center">
							${ e }
						</td>\n`
					})
					post_content += `</tr>\n`
				}
				post_content += `
				</tbody>
        </table>
       	</div>\n`
			}else if(el.type === "attaches"){
				post_content += `
				<div class="text-right">
         	<div class="mr-4 text-right ">
           	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-diagram-3-fill mx-2" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z"/>
						</svg>
          	 ${ el.data.title }
        	 </div>
         	<div class="py-3 text-center rounded shadow bg-black-transparent-2">
           	<a href="#" class="text-success w-100">
             	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download mx-2" viewBox="0 0 16 16">
								<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
								<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
							</svg>
             	<span class="text-dark">
              	 دانلود
            	 </span>
          	 </a>
        	 </div>
      	 </div>
    	   <div class="mx-4 my-3 text-right ">\n`
			}
		});
		if (result.resource.includes("http")|| result.resource.includes(".com")||result.resource.includes(".ir")||result.resource.includes(".org")||result.resource.includes("www")){
			post_content += `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe text-muted" viewBox="0 0 16 16">
				<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
			</svg>
			منبع :
			<cite class="text-muted">${ result.resource }</cite>\n`
		}else{
			post_content += `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square text-muted mx-2" viewBox="0 0 16 16">
				<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
				<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
			</svg>
			نویسنده :
			<cite class="text-muted">${ result.resource }</cite>
			</div>\n`
		}
	let showContentResultTemplate = 
	`
	<div class="pt-2 rounded box-shadow-muted box-main">
  <div class="position-relative">
    <div
      class="px-3 py-2 mt-4 mr-4 text-right rounded shadow bg-black-transparent-6 w-75 pos-absolute-right-top row text-light">
      <h1 class="text-right font-3">
        ${ result.topic }
      </h1>
    </div>
    <img src="/uploads/images/content-cover-images/${ result.coverImage }" class="img-fluid d-none-on-xsm cover w-100"
      alt="${ result.topic }">
  </div>
  <div class="px-3 py-2 mx-2 mt-3 text-right shadow bg-black-transparent-1 row text-dark">
    <div class="text-center col-6">
      <span class="text-dark">
        <svg width="21px" height="21px" viewBox="0 0 16 16" class="bi bi-calendar-event d-none d-lg-inline-block"
          fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
          <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
        </svg>
        تاریخ :
      </span>
      <span class="text-info Parastoo">${ result.persianDate }</span>
    </div>
    <div class="text-center col-6">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
				<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
				<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
			</svg>
      <span class="text-dark">ساعت : </span>
      <span class="text-info Parastoo">${ result.timeCreated }</span>
    </div>
    <div class="divider"></div>
    <div class="text-center col-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
				<path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
				<path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
			</svg>
      <span class="text-dark">بازدید : </span>
      <br>
      <span class="text-info Parastoo">${ result.views }</span>
    </div>
    <div class="text-center col-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-text-fill" viewBox="0 0 16 16">
				<path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
			</svg>
      <span class="text-dark">دیدگاه : </span>
      <br>
      <span class="text-info Parastoo">${ result.reviews.length }</span>
    </div>
    <div class="text-center col-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
			</svg>
      <span class="text-dark">رضایت : </span>
      <br>
      <span class="text-info Parastoo">${ result.isUseful }</span>
    </div>
  </div>
  <div class="text-body">
    <span id="content-topic" class="d-none">${ result.slug }</span>
    <div>
      <div class="px-3 py-2 mt-4 text-right font-2">چکیده مطلب</div>
      <p class="p-3 text-right text-justify lh-1">
        ${ result.summary }
      </p>
    </div>
    <div id="searchResult">
      ${post_content}
    </div>
  </div>
	<div>
		<a href="/new/${operation}/content/${result._id}" target="_blank" class="btn btn-${operation === "upload"? "success" : (operation === "delete" ? "danger" : "info")} rounded-0 w-100">
			${operation === "upload"? "آپلود" : (operation === "delete" ? "حذف" : "ویرایش")}
		</a>
	</div>
</div>
`;
pathId.innerHTML = showContentResultTemplate;
document.getElementById("searchResult").innerHTML = post_content;
}
function showProductSearchResult(result,pathId,operation){
	let productResultTemplate = `
	<div class="my-3 rounded box-shadow-muted box-main">
		<div class="my-2 card">
			<div class="row no-gutters">
				<div class="col-md-4">
					<img src="/uploads/images/products/${ result.image }" class="card-img w-100 cover"
						alt="${ result.name }" />
				</div>
				<div class="text-right col-md-8 product-card">
					<div class="p-2 card-body">
						<div class="float-left text-center">
							<span class="font-small"> تخفیف : </span>
							<span class="text-danger font-3">${ result.discount > 0 ? result.discountPercentage : 0 } %</span>
						</div>
						<h5 class="card-title">${ result.name }</h5>
						<p class="card-text">
							${ result.explanation }
						</p>
					</div>
				</div>
			</div>
			<div class="m-0 divider w-100"></div>
			<div class="p-2 text-center font-1 bg-black-transparent-2">
				<span class="float-none mx-3 my-2 float-sm-right mx-md-5">
					<span class="ml-3 card-text d-none-on-xxsm">
						قیمت :
					</span>
					<span class="card-text">
						<span class="Parastoo">
							${ result.price }
						</span>
						<span class="card-text font-small">
							تومان
						</span>
					</span>
				</span>
				<a href="/new/${operation}/product/${result._id}" target="_blank" class="float-none px-5 m-2 btn btn-${operation === "upload"? "success" : (operation === "delete" ? "danger" : "info")} float-sm-left">${operation === "upload"? "آپلود" : (operation === "delete" ? "حذف" : "ویرایش")}</a>
			</div>
		</div>
	</div>
	`
	pathId.innerHTML = productResultTemplate;
}
const searchForUploadBtn = document.getElementById("searchForUploadBtn")
const searchToUpload_field = document.getElementById("search_for_post_by_topic_upload")
searchForUploadBtn.addEventListener("click", function(e){
	getThat(e,"upload","searchResults_upload","productResultContainer",searchToUpload_field,"/new/search-for-content-name",showSearchResult,"searchResults_upload");
})
const searchForContentByidBtn = document.getElementById("upload_content_by_id_btn")
const searchForContentById_field = document.getElementById("search_for_post_by_id_upload")
searchForContentByidBtn.addEventListener("click", function(e){
	getThat(e,"upload","searchResults_upload","productResultContainer",searchForContentById_field,"/new/search-for-content-id",showSearchResult,"searchResults_upload");
})
const searchForProductBtn = document.getElementById("search_for_product_by_name_upload_btn")
const searchproductResult_field = document.getElementById("search_for_product_by_name_upload")
searchForProductBtn.addEventListener("click", function(e){
	getThat(e,"upload","searchResults_upload","productResultContainer",searchproductResult_field,"/new/search-for-product-name",showProductSearchResult,"productResultContainer");
})
const searchForProductByIdBtn = document.getElementById("upload_product_by_id_btn")
const searchproductById_field = document.getElementById("search_for_product_by_id_upload")
searchForProductByIdBtn.addEventListener("click", function(e){
	getThat(e,"upload","searchResults_upload","productResultContainer",searchproductById_field,"/new/search-for-product-id",showProductSearchResult,"productResultContainer");
})
const delete_content_by_name_btn = document.getElementById("delete_content_by_name_btn")
const search_for_post_by_topic_delete = document.getElementById("search_for_post_by_topic_delete")
delete_content_by_name_btn.addEventListener("click", function(e){
	getThat(e,"delete","contentResultContainer_deleting","productResultContainer_deleting",search_for_post_by_topic_delete,"/new/search-for-content-name",showSearchResult,"contentResultContainer_deleting");
})
const delete_content_by_id_btn = document.getElementById("delete_content_by_id_btn")
const search_for_post_by_id_delete = document.getElementById("search_for_post_by_id_delete")
delete_content_by_id_btn.addEventListener("click", function(e){
	getThat(e,"delete","contentResultContainer_deleting","productResultContainer_deleting",search_for_post_by_id_delete,"/new/search-for-content-id",showSearchResult,"contentResultContainer_deleting");
})
const delete_product_by_name_btn = document.getElementById("delete_product_by_name_btn")
const search_for_product_by_name_delete = document.getElementById("search_for_product_by_name_delete")
delete_product_by_name_btn.addEventListener("click", function(e){
	getThat(e,"delete","contentResultContainer_deleting","productResultContainer_deleting",search_for_product_by_name_delete,"/new/search-for-product-name",showProductSearchResult,"productResultContainer_deleting");
})
const delete_product_by_id_btn = document.getElementById("delete_product_by_id_btn")
const search_for_product_by_id_delete = document.getElementById("search_for_product_by_id_delete")
delete_product_by_id_btn.addEventListener("click", function(e){
	getThat(e,"delete","contentResultContainer_deleting","productResultContainer_deleting",search_for_product_by_id_delete,"/new/search-for-product-id",showProductSearchResult,"productResultContainer_deleting");
})
	function getThat(e,typeOfOperation,contentContainer,productContainer,inputField,getThatUrl,thatFunction,thatContainer) {
		document.getElementById(contentContainer).innerHTML = '';
		document.getElementById(productContainer).innerHTML = '';
		const container = document.getElementById(thatContainer)
		e.preventDefault();
		let inputValue = inputField.value;
		axios.get(getThatUrl, {
			params: {q:inputValue}
		}) 
		.then((res) => {
			if(typeof res.data === 'string' && res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
			show_alert(res.data.message,"success")
			thatFunction(res.data.result,container,typeOfOperation);
		})
		.catch(err => {
			show_alert(err.response.data.message,"failed")
		})
		inputValue = null;
	}
	function showAllMyContents(results,pathId,userRole){
		let template = ``;
		for(let i = results.length - 1 ; i>=0 ; i--){
			template += `
			<div class="col-lg-4 col-md-6 col-12 shadow">
				<div class="mb-3 text-right rounded card">
					<img src="/uploads/images/content-cover-images/${ results[i].coverImage }"
						class="card-img-top card-image-height animate__animated animate__fadeInUp cover" alt="${ results[i].topic }" />
					<div class="p-0 card-body ">
						<h5 class="px-3 py-2 card-title ">${ results[i].topic }</h5>
						<div class="px-3 my-2 py-2 contentID__box text-center eng-font"><span>${ results[i]._id }</span></div>
						<p class="px-3 overflow-hidden card-text line-clamp">
							${ results[i].summary }
						</p>
						<div class="m-0 divider w-100 bg-dark"></div>
						<div class="px-3 py-2 text-center bg-black-transparent-3 text-dark">
							<span class="text-dark">تاریخ : </span>
							<span class="mr-3 text-white Parastoo">${ results[i].persianDate }</span>
						</div>
						<div class="px-3 py-2 text-center bg-black-transparent-2">
							<span>وضعیت آپلود : </span>
							<span class="mr-3 Parastoo ${results[i].isPublished ? "text-success":"text-danger"}">${ results[i].isPublished ? "آپلود شده":"آپلود نشده" }</span>
						</div>
						<div class="px-3 py-2 text-center bg-black-transparent-2">
							<span>وضعیت تأیید : </span>
							<span class="mr-3 Parastoo ${results[i].isConfirmed ? "text-success":"text-danger"}">${ results[i].isConfirmed ? "تأیید شده":"تأیید نشده" }</span>
						</div>
						<div class="row">
							<div class="col-12">
								<a href="/new/upload/content/${ results[i]._id }" target="_blank" class="mt-2 btn btn-outline-success mt-md-0 rounded-0 w-100">آپلود</a>
							</div>
							<div class="col-12">
								<a href="/new/edit/content/${ results[i]._id }" target="_blank" class="mt-2 btn btn-outline-info mt-md-0 rounded-0 w-100 disabled">ویرایش</a>
							</div>
							<div class="col-12">
								<a href="/new/delete/content/${ results[i]._id }" target="_blank" class="mt-2 btn btn-outline-danger mt-md-0 rounded-0 w-100">حذف</a>
							</div>
							${userRole === "admin" ? `
							<div class="col-6 mt-2 m-sm-0 pl-0">
								<a href="/new/confirm/content/${ results[i]._id }" target="_blank" class="p-1 m-0 btn btn-outline-primary rounded-0 w-100">تأیید</a>
							</div>
							<div class="col-6 mt-2 m-sm-0 pr-0">
								<a href="/new/unconfirm/content/${ results[i]._id }" target="_blank" class="p-1 m-0 btn btn-outline-primary rounded-0 w-100">رد</a>
							</div>`:''}
						</div>
					</div>
				</div>
			</div>\n`;
		};
			pathId.innerHTML = template;
	}
	const allMyContent_btn = document.getElementById("allMyContent_btn")
	const allMyContent_container = document.getElementById("allMyContent_container")
	allMyContent_btn.addEventListener("click", showAllMyContents_result)

	function showAllMyContents_result(e) {
		e.preventDefault()
		axios.get("/new/allmycontents") 
		.then((res) => {
			if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
			document.getElementById("numberOfContents").innerHTML = res.data.allResults;
			document.getElementById("numberOfUploadedContents").innerHTML = res.data.uploadedContents;
			document.getElementById("numberOfApprovedContents").innerHTML = res.data.approvedContents;
			showAllMyContents(res.data.results,allMyContent_container,res.data.userRole);
		})
		.catch(err => {
			show_alert(err.response.data.message,"failed")
		})
	}
	function showAllMyProducts(results,pathId,userRole){
		let template = ``;
		for(let i = results.length-1;i>=0;i--){
			template += `
			<div class="col-lg-4 col-md-6 col-12 shadow">
				<div class="mb-3 text-right rounded card">
					<img src="/uploads/images/products/${ results[i].image }"
						class="card-img-top card-image-height animate__animated animate__fadeInUp cover" alt="${ results[i].topic }" />
					<div class="p-0 card-body ">
						<h5 class="px-3 py-2 card-title ">${ results[i].name }</h5>
						<div class="px-3 my-2 py-2 contentID__box text-center eng-font"><span>${ results[i]._id }</span></div>
						<div class="m-0 divider w-100 bg-dark"></div>
						<div class="px-3 py-2 text-center bg-black-transparent-3 text-dark">
							<span class="text-dark">تاریخ : </span>
							<span class="mr-3 text-white Parastoo">${ results[i].persianDate }</span>
						</div>
						<div class="px-3 py-2 text-center bg-black-transparent-2">
							<span>وضعیت آپلود : </span>
							<span class="mr-3 Parastoo ${results[i].isPublished ? "text-success":"text-danger"}">${ results[i].isPublished ? "آپلود شده":"آپلود نشده" }</span>
						</div>
						<div class="px-3 py-2 text-center bg-black-transparent-2">
							<span>وضعیت تأیید : </span>
							<span class="mr-3 Parastoo ${results[i].isConfirmed ? "text-success":"text-danger"}">${ results[i].isConfirmed ? "تأیید شده":"تأیید نشده" }</span>
						</div>
						<div class="row">
							<div class="col-12">
								<a href="/new/upload/product/${ results[i]._id }" target="_blank" class="mt-2 btn btn-outline-success mt-md-0 rounded-0 w-100">آپلود</a>
							</div>
							<div class="col-12">
								<a href="/new/edit/product/${ results[i]._id }" target="_blank" class="mt-2 btn btn-outline-info mt-md-0 rounded-0 w-100 disabled">ویرایش</a>
							</div>
							<div class="col-12">
								<a href="/new/delete/product/${ results[i]._id }" target="_blank" class="mt-2 btn btn-outline-danger mt-md-0 rounded-0 w-100">حذف</a>
							</div>
							${userRole === "admin" ? `
							<div class="col-6 mt-2 m-sm-0 pl-0">
								<a href="/new/confirm/product/${ results[i]._id }" target="_blank" class="p-1 m-0 btn btn-outline-primary rounded-0 w-100">تأیید</a>
							</div>
							<div class="col-6 mt-2 m-sm-0 pr-0">
								<a href="/new/unconfirm/product/${ results[i]._id }" target="_blank" class="p-1 m-0 btn btn-outline-primary rounded-0 w-100">رد</a>
							</div>`:''}
						</div>
					</div>
				</div>
			</div>\n`;
		};
			pathId.innerHTML = template;
	}
	const allMyProduct_btn = document.getElementById("allMyProduct_btn")
	const allMyProducts_container = document.getElementById("allMyProducts_container")
	allMyProduct_btn.addEventListener("click", showAllMyProducts_result)

	function showAllMyProducts_result(e) {
		e.preventDefault()
		axios.get("/new/allmyproducts") 
		.then((res) => {
			if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
			document.getElementById("numberOfProducts").innerHTML = res.data.results.length;
			document.getElementById("numberOfUploadedProducts").innerHTML = res.data.uploadedProducts;
			document.getElementById("numberOfApprovedProducts").innerHTML = res.data.approvedProducts;
			showAllMyProducts(res.data.results,allMyProducts_container,res.data.userRole);
		})
		.catch(err => {
			show_alert(err.response.data.message,"failed")
		})
	}
	function showCommentResult(result,pathId){
		let template = `
			<h3 class="my-3 text-right">نتایج :</h3>
			<div class="p-2 mb-3 bg-dark row">
        <div class="p-2 text-right text-muted">متن کامنت : </div>
        <div class="p-2 col-12">
          <p class="p-2 text-break mb-0 text-right text-white bg-secondary">
            ${ result.text } 
          </p>
        </div>
        <div class="pt-2 pb-1 text-right col-12 col-lg-3 col-sm-6">
          <span class="text-muted">ایمیل :</span>
          <span class="text-info eng-font">${ result.fromUser.email }</span>
        </div>
        <div class="pt-2 pb-1 text-right col-12 col-lg-3 col-sm-6">
          <span class="text-muted">نام :</span>
          <span class="text-info">${ result.fullname }</span>
        </div>
				<div class="pt-2 pb-1 text-right col-12 col-lg-3 col-sm-6">
          <span class="text-muted">آیدی کامنت :</span>
          <span class="text-info eng-font">${ result._id }</span>
        </div>
        <div class="pt-2 pb-1 text-right col-12 col-lg-3 col-sm-6">
          <span class="text-muted">آیدی محتوا :</span>
          <span class="text-info eng-font">${ result.forContent }</span>
        </div>
        <div class="pt-2 pb-1 text-right col-12 col-lg-3 col-sm-6">
          <span class="text-muted">وضعیت تأیید :</span>
          <span class="text-${ result.isConfirmed ? "success" : "danger" }">${ result.isConfirmed ? "تأیید شده" : "تأیید نشده" }</span>
        </div>
        <div class="pt-2 pb-1 text-right col-12 col-lg-3 col-sm-6">
          <div class="btn-group" role="group" aria-label="button group">
            <a href="/confirm-comment/${ result._id }" target="_blank" class="px-3 btn btn-primary rounded-0">تأیید</a>
            <a href="/unconfirm-comment/${ result._id }" target="_blank" class="px-3 btn btn-danger rounded-0">رد</a>
          </div>
        </div>
      </div>
		`;
		pathId.innerHTML = template;
	}
	const resultContainer = document.getElementById("searchResultComent") 
	const searchCommentInput = document.getElementById("commentserchInput")
	const commentserchInput_btn = document.getElementById("commentserchInput_btn")
	commentserchInput_btn.addEventListener("click",searchForComment)
	function searchForComment(){
		if(searchCommentInput.value === '' || searchCommentInput.value === null) {
			show_alert('لطفا آیدی کامنت را وارد کنید.',"failed")
			return;
		}
		const inputVal = searchCommentInput.value;
		axios.get("/search-for-comment",{
			params:{
				id:inputVal
			}
		})
		.then((res)=>{
			if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
			show_alert("کامنت پیدا شد.","success")
			showCommentResult(res.data.result,resultContainer)
		})
		.catch(err=>{
			if(!err.response.data.message){
				show_alert("مشکلی در جستجو پیش آمده است.","failed")
			}else{
				show_alert(err.response.data.message,"failed")
			}
		})
	}
	const fileBtn_actual = document.getElementById("actual-file-button")
	const fileBtn_custom = document.getElementById("custom-file-button")
	const fileText_custom = document.getElementById("custom-file-text")
	fileBtn_custom.addEventListener("click",function(){
		fileBtn_actual.click();
	})
	fileBtn_actual.addEventListener("change",function(){
		if(fileBtn_actual.value){
			fileText_custom.innerHTML = fileBtn_actual.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
		}
	})
	const theOwnerOfAd = document.getElementById("theOwnerOfAd")
	const triggerContentIdForAd = document.getElementById("triggerContentIdForAd")
	const confirmAd = document.getElementById("confirmAd")
	const homePageAd = document.getElementById("homePageAd")
	const targetPageLink = document.getElementById("targetPageLink")
	const incategoryPageApply = document.getElementById("incategoryPageApply")
	const registerNewAd_btn = document.getElementById("registerNewAd")
	const adForSportCategory = document.getElementById("adForSportCategory")
	const adForBeautyCategory = document.getElementById("adForBeautyCategory")
	const adForHealthCategory = document.getElementById("adForHealthCategory")
	const adForClothsCategory = document.getElementById("adForClothsCategory")
	const adForFoodCategory = document.getElementById("adForFoodCategory")
	const adForDigitalCategory = document.getElementById("adForDigitalCategory")
	const adStar = document.getElementById("adStar")
	const adStar2 = document.getElementById("adStar2")
	registerNewAd_btn.addEventListener("click",function(){
		let adErrorMessages = [];
		if(targetPageLink.value === '' || targetPageLink.value === null ) adErrorMessages.push("لطفا لینک تبلیغ را وارد کنید.") 
		if(!fileBtn_actual.files[0]||fileBtn_actual.files[0] === null) adErrorMessages.push("انتخاب تصویر برای تبلیغ ضروری است.")
		if(confirmAd.checked && (( !adForSportCategory.checked&&!adForHealthCategory.checked&&!adForDigitalCategory.checked&&!adForBeautyCategory.checked&&!adForClothsCategory.checked&&!adForFoodCategory.checked) &&(homePageAd.value.trim() === "" || homePageAd.value.trim() === null) && (triggerContentIdForAd.value.trim() === "" || triggerContentIdForAd.value.tirm() === null))) {
			show_alert("برای قرار گرفتن این تبلیغ در سایت لطفا حداقل یکی از گزینه ها برای قرار گرفتن تبلیغ در آن صفحه را انتخاب کنید .","failed")
			return;
		}
		if(adErrorMessages.length > 0) {
			show_alert(adErrorMessages,"failed")
			return;
		}
		const adFormData = new FormData();
		adFormData.append("name",theOwnerOfAd.value.trim())
		adFormData.append("forContent",triggerContentIdForAd.value.trim())
		adFormData.append("image",fileBtn_actual.files[0])
		if(homePageAd.checked){
			adFormData.append("inHomePage",1)
		} else {
			adFormData.append("inHomePage",0)
		}
		if (incategoryPageApply.checked){
			adFormData.append("inCategoryPage",1)
		} else {
			adFormData.append("inCategoryPage",0)
		}
		if(confirmAd.checked ){
			adFormData.append("confirmed",1)
		} else {
			adFormData.append("confirmed",0)
		}
		if(adStar.checked ){
			adFormData.append("star",1)
		} else {
			adFormData.append("star",0)
		}
		if(adStar2.checked ){
			adFormData.append("star2",1)
		} else {
			adFormData.append("star2",0)
		}
		if(targetPageLink.value !== "" || targetPageLink.value !== null){
			adFormData.append("adLink", targetPageLink.value.trim())
		} else {
			adFormData.append("adLink", '')
		}
		let categoriesChoise = [];
		if(adForSportCategory.checked) categoriesChoise.push(adForSportCategory.value)
		if(adForBeautyCategory.checked) categoriesChoise.push(adForBeautyCategory.value)
		if(adForHealthCategory.checked) categoriesChoise.push(adForHealthCategory.value)
		if(adForClothsCategory.checked) categoriesChoise.push(adForClothsCategory.value)
		if(adForFoodCategory.checked) categoriesChoise.push(adForFoodCategory.value)
		if(adForDigitalCategory.checked) categoriesChoise.push(adForDigitalCategory.value)
		if(categoriesChoise.length > 0) {
			adFormData.append("categories",categoriesChoise)
		}
		axios.post("/new/advertizement",adFormData, {
			headers:{
				"Content-Type":"multipart/formdata"
			}
		}).then((res)=>{
			if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
			show_alert("تبلیغ شما ثبت شد.","success")
		}).catch(err=>{
			show_alert(err.response.data.message,"failed")
		})
	})
	function showAdResult(result,pathId){
	const adSearchResultTemplate = `
	<div class="mb-3 text-right rounded card">
		<img src="/uploads/ads/${result.image}"
			class="card-img-top card-image-height animate__animated animate__fadeInUp cover" alt="ads" />
		<div class="p-0 card-body">
			<div class="justify-center"> 
				<form target="_blank" method="POST" action="/new/advertizement/save/${ result._id }">
					<div class="w-100">
						<input name="name" type="text" value="${result.name === "notset" ? "" : result.name }" class="p-2 border w-100 custom-input border-bottom" placeholder="اسم وبسایت ، یا فروشنده یا ... ">
					</div> 
					<div class="w-100">
						<input name="forContent" type="text" value="${result.forContent === "notset" ? "" : result.forContent }" class="p-2 Balsamiq w-100 custom-input border-bottom" placeholder="آیدی صفحه هدف">
					</div>
					<div class="w-100">
						<input name="adLink" type="text" value="${result.adLink === "notset" ? "" : result.adLink }" class="p-2 w-100 custom-input border-bottom" placeholder="لینک تبلیغ">
					</div>
					<div class="w-100">
						<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
							<label for="${ result._id }-sportCategory" class="ml-auto text-info form-check-label">تفریحی ورزشی</label>
							<input id="${ result._id }-sportCategory" name="sportCategory" type="checkbox" ${ result.sportCategory ? "checked" : "" } class="ml-2 form-check-input border-bottom" value="تفریحی-ورزشی">
						</div>
						<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
							<label for="${ result._id }-beautyCategory" class="ml-auto text-info form-check-label">زیبایی</label>
							<input id="${ result._id }-beautyCategory" name="beautyCategory" type="checkbox" ${ result.beautyCategory ? "checked" : "" } class="ml-2 form-check-input border-bottom" value="زیبایی">
						</div>
						<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
							<label for="${ result._id }-healthCategory" class="ml-auto text-info form-check-label">ابزار سلامت</label>
							<input id="${ result._id }-healthCategory" name="healthCategory" type="checkbox" ${ result.healthCategory ? "checked" : "" } class="ml-2 form-check-input border-bottom" value="ابزار-سلامت">
						</div>
						<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
							<label for="${ result._id }-clothCategory" class="ml-auto text-info form-check-label">مد و پوشاک</label>
							<input id="${ result._id }-clothCategory" name="clothCategory" type="checkbox" ${ result.clothCategory ? "checked" : "" } class="ml-2 form-check-input border-bottom" value="مد-و-پوشاک">
						</div>
						<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
							<label for="${ result._id }-foodCategory" class="ml-auto text-info form-check-label">خوراکی و نوشیدنی</label>
							<input id="${ result._id }-foodCategory" name="foodCategory" type="checkbox" ${ result.foodCategory ? "checked" : "" } class="ml-2 form-check-input border-bottom" value="خوراکی-نوشیدنی">
						</div>
						<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
							<label for="${ result._id }-digitalCategory" class="ml-auto text-info form-check-label">دیجیتال</label>
							<input id="${ result._id }-digitalCategory" name="digitalCategory" type="checkbox" ${ result.digitalCategory ? "checked" : "" } class="ml-2 form-check-input border-bottom" value="دیجیتال">
						</div>
					</div>
					<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
						<label for="${ result._id }-adStar" class="ml-auto text-danger w-100 form-check-label">تبلیغ ویژه</label>
						<input id="${ result._id }-adStar" ${ result.star ? "checked" : "" } name="star" type="checkbox" class="ml-2 form-check-input border-bottom" value="1">
					</div>
					<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
						<label for="${ result._id }-adStar2" class="ml-auto text-warning w-100 form-check-label">تبلیغ طلایی</label>
						<input id="${ result._id }-adStar2" ${ result.star ? "checked" : "" } name="star2" type="checkbox" class="ml-2 form-check-input border-bottom" value="1">
					</div>
					<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
						<label for="${ result._id }-adStarHome" class="ml-auto text-danger w-100 form-check-label"> تبلیغ ویژه (صفحه اصلی)</label>
						<input id="${ result._id }-adStarHome" ${ result.adStarHome ? "checked" : "" } name="adStarHome" type="checkbox" class="ml-2 form-check-input border-bottom" value="1">
					</div>
					<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
						<label for="${ result._id }-adStar2Home" class="ml-auto text-warning w-100 form-check-label">تبلیغ طلایی (صفحه اصلی)</label>
						<input id="${ result._id }-adStar2Home" ${ result.adStar2Home ? "checked" : "" } name="adStar2Home" type="checkbox" class="ml-2 form-check-input border-bottom" value="1">
					</div>
					<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
						<label for="${ result._id }-inCategoryPage" class="ml-auto text-success w-100 form-check-label">آیا در صفحه دسته بندی مربوطه هم قرار گیرد؟</label>
						<input id="${ result._id }-inCategoryPage" ${ result.inCategoryPage ? "checked" : "" } name="inCategoryPage" type="checkbox" class="ml-2 form-check-input border-bottom" value="1">
					</div>
					<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
						<label for="${ result._id }-inHomePage" class="ml-auto text-success w-100 form-check-label">آیا در صفحه اول هم قرار گیرد؟</label>
						<input id="${ result._id }-inHomePage" ${ result.inHomePage ? "checked" : "" } name="inHomePage" type="checkbox" class="ml-2 form-check-input border-bottom" value="1">
					</div>
					<div class="py-2 mx-0 w-100 form-check form-check-inline reverse">
						<label for="${ result._id }-confirmed" class="ml-auto text-success w-100 form-check-label">تأیید تبلیغ</label>
						<input id="${ result._id }-confirmed" ${ result.confirmed ? "checked" : "" } name="confirmed" type="checkbox" class="ml-2 form-check-input border-bottom" value="1">
					</div>
					<div class="w-100">
						<button type="submit" class="mt-2 btn btn-info mt-md-0 rounded-0 w-100">ذخیره</button>
					</div>
					<div class="w-100">
						<a class="mt-2 btn btn-danger mt-md-0 rounded-0 w-100" target="_blank" href="/new/advertizement/delete/${ result._id }">حذف</a>
					</div>
				</form>
			</div>
		</div>
	</div>
	`;
	pathId.innerHTML = adSearchResultTemplate;
	}
	const adSearchBox = document.getElementById("adSearchBox")
	const searchForAd_field = document.getElementById("searchForAd")
	const findTheAdBtn = document.getElementById("findTheAdBtn")
	findTheAdBtn.addEventListener("click",function(){
		if(searchForAd_field.value === "" || searchForAd_field.value === null) return show_alert("لطفا آیدی تبلیغ مورد نظر را وارد کنید.","failed")
			axios.get("/new/search-ad",{
				params:{
					id:searchForAd_field.value.trim()
				}
			}).then((res)=>{
				if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
				show_alert(res.data.message,"success")
				showAdResult(res.data.result,adSearchBox)
			}).catch(err=>{
				show_alert(err.response.data.message,"failed")
			})
		})
	{
		const findContentToEditByTopic_Form = document.getElementById("search_for_post_by_topic_edit_form")
		const findContentToEditByID_Form = document.getElementById("search_for_post_by_id_edit_form")
		const findContentToEditByTopic_Input = document.getElementById("search_for_post_by_topic_edit")
		const findContentToEditByID_Input = document.getElementById("search_for_post_by_id_edit")
		const resultofsearchforediting = document.getElementById("resultofsearchforediting")
		findContentToEditByID_Form.addEventListener("submit", function(e){
			e.preventDefault()
			if(findContentToEditByID_Input.value.trim() === null  || findContentToEditByID_Input.value.trim() === "") {
				show_alert("لطفا آیدی محتوایی را که می خواهید ویرایش کنیم وارد کنید.","failed")
				return;
			} 
			const findContentToEdit_Value = {id:findContentToEditByID_Input.value.trim()};
			sendDataToFindTheContentToEdit(findContentToEdit_Value)
		})
		findContentToEditByTopic_Form.addEventListener("submit", function(e){
			e.preventDefault()
			if(findContentToEditByTopic_Input.value.trim() === null  || findContentToEditByTopic_Input.value.trim() === "") {
				show_alert("لطفا موضوع محتوایی را که می خواهید ویرایش کنیم وارد کنید.","failed")
				return;
			} 
			const findContentToEdit_Value = {topic:findContentToEditByTopic_Input.value.trim()};
			sendDataToFindTheContentToEdit(findContentToEdit_Value)
		})
		function sendDataToFindTheContentToEdit(data){
			axios.get("/new/findContentToEdit",{
				params: data
			})
				.then( res => {
					if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
					show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
					return
				}
					displayContentToEdit(resultofsearchforediting,res.data.content)
				})
				.catch(err => {
					show_alert(err.response.data.message,"failed")
				})
		}
		function displayContentToEdit(resultContainerToEdit,contentToEdit){
			let kws = ''
			for(let i =0;i < contentToEdit.keywords.length; i++){
				if(i===contentToEdit.keywords.length-1){
					kws+= contentToEdit.keywords[i]
				}else{
					kws+= contentToEdit.keywords[i] + ' ، '
				}
			}
			const template = `
				<h1 class="mt-4 text-center">ویرایش پست</h1>
				<form id="editForm" class="needs-validation was-validated" enctype="multipart/form-data" novalidate>
					<div class="text-right row max-width-1300">
						<div class="my-2 col-lg-6">
							<label for="post_topic_Edit" class="m-0">موضوع اصلی پست : </label>
							<input name="post_topic_Edit" type="text" id="post_topic_Edit"
								class="py-2 my-2 form-control bg-white-transparent-7 custom-input input-border-bottom-black rounded-0 w-100 "
								placeholder="برنامه منظم برای پیاده روی و لاغری" value="${contentToEdit.topic}" maxlength="80" required>
							<div class="invalid-feedback text-danger">
								پر کردن این فیلد ضروریست.
							</div>
							<div class="valid-feedback text-success">
								صحیح
							</div>
						</div>
						<div class="my-2 col-lg-6">
							<label for="post_resource_Edit" class="m-0">منبع : </label>
							<input name="post_resource_Edit" type="text" id="post_resource_Edit"
								class="py-2 my-2 form-control custom-input bg-white-transparent-7 Parastoo input-border-bottom-black rounded-0 w-100 "
								placeholder="www.digikala.com یا ${contentToEdit.resource} " maxlength="30"
								value="${contentToEdit.resource}">
							<br>
							<div class="valid-feedback text-success">
								صحیح
							</div>
							<div class="invalid-feedback text-danger">
								پر کردن این فیلد ضروریست.
							</div>
						</div>
						<div class="my-2 col-lg-6">
							<label for="post_keywords_Edit" class="m-0">کلمات کلیدی و مرتبط با محتوا : </label>
							<input name="post_keywords_Edit" type="text" id="post_keywords_Edit"
								class="py-2 my-2 form-control custom-input Parastoo input-border-bottom-black rounded-0 w-100 bg-white-transparent-7"
								placeholder="ورزشی ، پیاده روی ،پیاده روی سریع ، پیاده روی روزانه ،کفش مخصوص پیاده روی ، مدت زمان پیاده روی ..."
								value="${kws}" required>
							<small class="text-info">
								کلمات کلیدی را با ویرگول از هم جدا کنید.
							</small>
							<br>
							<small class="text-info">
								حداقل 5 و حداکثر 20 کلمه کلیدی ، محتوایی با بیشتر یا کمتر ازاین مقادیر در سایت
								منتشر
								نخواهد شد.
							</small>
							<br>
							<div class="invalid-feedback text-danger">
								پر کردن این فیلد ضروریست.
							</div>
							<div class="valid-feedback text-success">
								صحیح
							</div>
						</div>
						<div class="my-2 col-12">
							<div class="custom-file">
								<label for="post_main_picture_Edit" class="m-0 text-center custom-file-label bg-white-transparent-7">تصویر اصلی
									پست را انتخاب
									کنید</label>
								<input name="post_main_picture_Edit" type="file" id="post_main_picture_Edit"
									class="py-2 my-2 form-control custom-file-input rounded-0 w-100 "data-browse="جستجو" required>
								<div class="invalid-feedback text-danger">
									انتخاب این عکس الزامیست.
								</div>
								<div class="valid-feedback text-success">
									تصویر انتخاب شد.
								</div>
							</div>
						</div>
						<div class="mt-3 text-right col-12">
							<label for="post_summary_Edit" class="m-0">خلاصه متن : </label>
							<textarea name="post_summary_Edit" id="post_summary_Edit" class="py-2 my-2 border bg-white-transparent-8 form-control"
								rows="8" placeholder="حداکثر 500 حرف و حداقل 100 حرف" minlength="100" maxlength="500" required></textarea>
							<div class="invalid-feedback text-danger">
								پر کردن این فیلد ضروریست.
							</div>
							<div class="valid-feedback text-success">
								صحیح
							</div>
						</div>
						<div class="mt-3 text-right col-12">
							<label for="post_metaTagDescription_Edit" class="m-0">توضیح برای تگ متا در نتایج گوگل : </label>
							<textarea name="post_metaTagDescription_Edit" id="post_metaTagDescription_Edit"
								class="py-2 my-2 border bg-white-transparent-8 form-control" rows="8" placeholder="حداکثر 150 و حداقل 60 حرف"
								minlength="60" maxlength="150" required></textarea>
							<div class="invalid-feedback text-danger">
								پر کردن این فیلد ضروریست.
							</div>
							<div class="valid-feedback text-success">
								صحیح
							</div>
						</div>
					</div>
					<input id="contentId_Edit" value="${contentToEdit._id}" hidden>
					<div class="mt-4">
						<div class="my-2 text-center col-12">
							<button id="saveChanges_Edit" type="submit" class="btn btn-success w-50">ذخیره</button>
						</div>
					</div>
				</form>		
			`;
			resultContainerToEdit.innerHTML = template; 
			document.getElementById("post_summary_Edit").value = contentToEdit.summary 
			document.getElementById("post_metaTagDescription_Edit").value = contentToEdit.metaDescription 
			document.getElementById("saveChanges_Edit").addEventListener("click",function(e){
				e.preventDefault()
				checkTheInputs()
			})
		}
		  let contentId_Edit;
			let topic_ToEdit;
			let resource_ToEdit;
			let keywords_ToEdit;
			let mailPicture_ToEdit;
			let summary_ToEdit;
			let metaTageDescription_ToEdit;
			function checkTheInputs(){
				contentId_Edit = document.getElementById("contentId_Edit")
				topic_ToEdit = document.getElementById("post_topic_Edit")
				resource_ToEdit = document.getElementById("post_resource_Edit")
				keywords_ToEdit = document.getElementById("post_keywords_Edit")
				mailPicture_ToEdit = document.getElementById("post_main_picture_Edit")
				summary_ToEdit = document.getElementById("post_summary_Edit")
				metaTageDescription_ToEdit = document.getElementById("post_metaTagDescription_Edit")
				let errorMessages_ToEdit = [];
				if(contentId_Edit.value.trim() === null || contentId_Edit.value.trim() === "") errorMessages_ToEdit.push("آیدی دستکاری شده لطفا دوباره برای این محتوا جستجو کنید.")
				if(topic_ToEdit.value.trim() === null || topic_ToEdit.value.trim() === "") errorMessages_ToEdit.push("لطفا موضوع محتوا را وارد کنید.")
				if(resource_ToEdit.value.trim() === null || resource_ToEdit.value.trim() === "") errorMessages_ToEdit.push("لطفا منبع محتوا را مشخص کنید.")
				if(mailPicture_ToEdit.value.trim() === null || mailPicture_ToEdit.value.trim() === "") errorMessages_ToEdit.push("لطفا تصویررا برای محتوا وارد کنید.")
				if (!keywords_ToEdit.value.trim() || keywords_ToEdit.value.trim() === '' || keywords_ToEdit.value.trim() === null) errorMessages_ToEdit.push("وارد کردن کلمات کلیدی برای محتوا حداقل10 کلمه ضروری است.")
				if (keywords_ToEdit.value.includes("،")) {
					if (keywords_ToEdit.value.split("،").length < 10)
						errorMessages_ToEdit.push("تعداد کلمات کلیدی باید حداقل 10 تا باشد.")
				} else if (keywords_ToEdit.value.includes(",")) {
					if (keywords_ToEdit.value.split(",").length < 10)
						errorMessages_ToEdit.push("تعداد کلمات کلیدی باید حداقل 10 تا باشد.")
				} else {
					if (keywords_ToEdit.value.split(",").length < 10)
						errorMessages_ToEdit.push("تعداد کلمات کلیدی باید حداقل 10 تا باشد.")
				}
				if (!summary_ToEdit.value.trim() || summary_ToEdit.value.trim() === '' || summary_ToEdit.value.trim() === null) errorMessages_ToEdit.push("وارد کردن خلاصه ای از محتوا حداقل 3 خط ضروری است.")
				if (summary_ToEdit.value.trim().length < 100) errorMessages_ToEdit.push("وارد کردن خلاصه ای از محتوا حداقل 100 حرف خط ضروری است.")
				if (summary_ToEdit.value.trim().length > 500) errorMessages_ToEdit.push("محتوا حداکثر باید 500 حرف باشد.")
				if (!metaTageDescription_ToEdit.value.trim() || metaTageDescription_ToEdit.value.trim() === '' || metaTageDescription_ToEdit.value.trim() === null) errorMessages_ToEdit.push("وارد کردن خلاصه ای از محتوا حداقل60 حرف برای قرارگرفتن در تگ متا است.")
				if (metaTageDescription_ToEdit.value.trim().length < 60) errorMessages_ToEdit.push("وارد کردن خلاصه ای از محتوا حداقل60 حرف برای قرارگرفتن در تگ متا ضروری است.")
				if (metaTageDescription_ToEdit.value.trim().length > 150) errorMessages_ToEdit.push("توضیح متا تگ باید حداکثر150 حرف باشد.")		
				if(errorMessages_ToEdit.length > 0){
					show_alert(errorMessages_ToEdit,"failed")
					return
				}
				applyTheChanges()
			}
			function applyTheChanges(){
				const data = new FormData()
				data.append("id",contentId_Edit.value.trim())
				data.append("topic",topic_ToEdit.value.trim())
				data.append("resource",resource_ToEdit.value.trim())
				data.append("keywords",keywords_ToEdit.value.trim())
				data.append("image",mailPicture_ToEdit.files[0])
				data.append("summary",summary_ToEdit.value.trim())
				data.append("metaDescription",metaTageDescription_ToEdit.value.trim())
				axios.post("/new/applyChanges",data,{
					headers:{
						"Content-Type":"multipart/form-data"
					}
				})
				.then(res => {
					if(typeof res.data === 'string' &&res.data.startsWith("<!DOCTYPE")){
						show_alert("لطفا دوباره وارد شوید و مجددا امتحان کنید.","failed")
						return
					}
					show_alert(res.data.message,"success")
				})
				.catch(err=> show_alert(err.response.data.message,"failed"))
			}
		
		}
}
