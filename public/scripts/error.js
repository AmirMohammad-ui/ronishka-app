$(function () {
	setTimeout(function () {
		$('body').removeClass('loading');
	}, 1000);
});

const backToSite = document.getElementById("backtosite");
let register;
if (document.getElementById("registerloginButton")) {
	register = document.getElementById("registerloginButton");
	register.addEventListener("click", function () {
		location.assign("/signup-login");
	});
}

backToSite.addEventListener("click", function () {
	location.assign("/");
});

let search;

function show_error(message) {
	search.insertAdjacentHTML("afterend", `<div id="error-text" class="alert__failed">${message}</div>`)
	const smallErr = document.getElementById("error-text")
	setTimeout(function () {
		smallErr.parentElement.removeChild(smallErr);
	}, 3000)
}
if (document.getElementById("search")) {
	const searchInput = document.getElementById("search-input")
	search = document.getElementById("search")
	search.addEventListener('click', function () {
		if (!searchInput.value || searchInput.value === '' || searchInput.value === null) {
			if (document.getElementById("error-text")) return;
			searchInput.style.border = '2px solid red';
			show_error('لطفا فیلد را پر کنید.')
			return;
		}
		const search_input_value = searchInput.value;
		$.ajax({
			url: '/search?q=' + search_input_value,
			type: 'GET',
			success: function (data) {
				if (data.status === 'NOT FOUND' || data.statusCode === 404) return show_error(data.message)
				openSearchBox(data);
			}
		});
	})

}
function openSearchBox(data) {
	const template = `
	<div id="search-box-container" class="search-box-container animate__animated animate__fadeIn scrollify">
					<div id="close-btn">
							<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus"
								viewBox="0 0 16 16">
								<path fill-rule="evenodd"
										d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
							</svg>
					</div>
					<div id="results" class="results">
							<div class="numberOfResults">
									<span>نتیجه برای این جستجو یافت شد :</span>
									<span>${data.length}</span>
							</div>
					</div>
			</div>`;
	let resultsTemplate = '';
	data.forEach(data => {
		resultsTemplate += `
		<div class="result--card">
			<a href="/blog/content/${data.slug}">
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
					<a href="/blog/content/${data.slug}" class="link">برو به این صفحه</a>
				</div>
			</div>
		</div>`
	});
	setTimeout(()=>{
		document.body.insertAdjacentHTML('afterbegin', template);
		const searchBox = document.getElementById("search-box-container");
		const results = document.getElementById("results");
		results.insertAdjacentHTML("beforeend", resultsTemplate);
		const closeBtn = document.getElementById("close-btn");

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