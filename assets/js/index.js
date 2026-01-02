document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const isoDate = now.toISOString().split("T")[0];
  const prettyDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".app-section");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  function showSection(sectionId) {
    sections.forEach((section) => {
      section.classList.add("hidden");
      if (section.id === sectionId) section.classList.remove("hidden");
    });

    navLinks.forEach((link) => {
      if (link.getAttribute("data-section") === sectionId) {
        link.classList.add("bg-blue-500/10", "text-blue-400");
      } else {
        link.classList.remove("bg-blue-500/10", "text-blue-400");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");
      showSection(sectionId);

      if (sectionId === "launches") fetchUpcomingLaunches();

      if (window.innerWidth < 1024) sidebar.classList.add("-translate-x-full");
    });
  });

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });

  const dateInput = document.getElementById("apod-date-input");
  if (dateInput) {
    dateInput.value = isoDate;
    dateInput.max = isoDate;
    dateInput.nextElementSibling.textContent = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  document.getElementById(
    "apod-date"
  ).textContent = `Astronomy Picture of the Day - ${prettyDate}`;

  async function fetchNASAData(date) {
    const loading = document.getElementById("apod-loading");
    const container = document.getElementById("apod-image-container");
    loading.classList.remove("hidden");

    try {
      const data = await response.json();

      if (data.media_type === "image") {
        container.style.backgroundImage = `url('${data.url}')`;
        container.style.backgroundSize = "cover";
        container.style.backgroundPosition = "center";
      }
      document.getElementById("apod-title").textContent = data.title;
      document.getElementById("apod-explanation").textContent =
        data.explanation;
      document.getElementById("apod-date-info").textContent = data.date;
    } catch (error) {
    } finally {
      loading.classList.add("hidden");
    }
  }

  async function fetchUpcomingLaunches() {
    const grid = document.getElementById("launches-grid");
    const featured = document.getElementById("featured-launch");

    try {
      const data = await response.json();

      document.getElementById(
        "launches-count"
      ).textContent = `${data.count} Launches`;
      document.getElementById("launches-count-mobile").textContent = data.count;

      grid.innerHTML = data.results
        .map(
          (launch) => `
                <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden p-5 hover:border-blue-500/30 transition-all">
                    <span class="text-xs font-bold text-blue-400 uppercase">${
                      launch.rocket.configuration.name
                    }</span>
                    <h4 class="font-bold text-white mt-2">${launch.name}</h4>
                    <p class="text-xs text-slate-400 mt-2"><i class="fas fa-calendar mr-2"></i>${new Date(
                      launch.net
                    ).toLocaleDateString()}</p>
                    <p class="text-xs text-slate-500 mt-1"><i class="fas fa-map-marker-alt mr-2"></i>${
                      launch.pad.location.name
                    }</p>
                </div>
            `
        )
        .join("");
    } catch (error) {}
  }

  fetchNASAData(isoDate);
});

// #############################################
//1
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const isoDate = `${yyyy}-${mm}-${dd}`;

  const options = { year: "numeric", month: "short", day: "numeric" };
  const prettyDate = today.toLocaleDateString("en-US", options);

  const dateInput = document.getElementById("apod-date-input");
  if (dateInput) {
    dateInput.value = isoDate;
    dateInput.max = isoDate; // منع اختيار تاريخ مستقبلي
  }

  const dateSpan = document.querySelector(".date-input-wrapper span");
  if (dateSpan) {
    dateSpan.textContent = prettyDate;
  }

  const apodDateText = document.getElementById("apod-date");
  if (apodDateText) {
    apodDateText.textContent = `Astronomy Picture of the Day - ${prettyDate}`;
  }

  const apodDateInfo = document.getElementById("apod-date-info");
  if (apodDateInfo) {
    apodDateInfo.textContent = isoDate;
  }
});

const API_KEY = "DEMO_KEY";

document.addEventListener("DOMContentLoaded", () => {
  const apodDateInput = document.getElementById("apod-date-input");
  const loadDateBtn = document.getElementById("load-date-btn");
  const todayApodBtn = document.getElementById("today-apod-btn");
  const imageContainer = document.getElementById("apod-image-container");
  const loadingElement = document.getElementById("apod-loading");

  // 1. وظيفة جلب البيانات من ناسا
  async function fetchSpaceData(date = "") {
    // إظهار مؤشر التحميل وتفريغ المحتوى السابق
    loadingElement.classList.remove("hidden");
    imageContainer.style.backgroundImage = "none";

    let url = `https://api.nasa.gov/planetary/apod?api_key=7pXhpXtFXLjXMpcOcilivPXLTbfnGs9FnCgtu17J`;
    if (date) url += `&date=${date}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        displayData(data);
      } else {
        alert("خطأ في جلب البيانات: " + data.msg);
      }
    } catch (error) {
      console.error("حدث خطأ:", error);
    } finally {
      loadingElement.classList.add("hidden");
    }
  }

  // 2. وظيفة عرض البيانات في الصفحة
  function displayData(data) {
    // تحديث التاريخ المكتوب
    document.getElementById(
      "apod-date"
    ).innerText = `Astronomy Picture of the Day - ${data.date}`;

    // عرض الصورة أو الفيديو
    if (data.media_type === "image") {
      imageContainer.innerHTML = ""; // مسح أي محتوى سابق
      imageContainer.style.backgroundImage = `url('${data.url}')`;
      imageContainer.style.backgroundSize = "cover";
      imageContainer.style.backgroundPosition = "center";
    } else {
      // في حال كان المحتوى فيديو (مثل فيديوهات اليوتيوب)
      imageContainer.style.backgroundImage = "none";
      imageContainer.innerHTML = `<iframe class="w-full h-full rounded-2xl" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    }

    // تحديث العنوان والوصف (تأكد من إضافة هذه الـ IDs في الـ HTML لديك)
    const titleElem = document.getElementById("apod-title");
    const descElem = document.getElementById("apod-explanation");

    if (titleElem) titleElem.innerText = data.title;
    if (descElem) descElem.innerText = data.explanation;
  }

  // 3. مستمعات الأحداث (Event Listeners)

  // عند الضغط على زر Load
  loadDateBtn.addEventListener("click", () => {
    const selectedDate = apodDateInput.value;
    if (selectedDate) fetchSpaceData(selectedDate);
  });

  // عند الضغط على زر Today
  todayApodBtn.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    apodDateInput.value = today;
    fetchSpaceData(today);
  });

  // تشغيل الجلب التلقائي عند فتح الصفحة (لصورة اليوم 2026)
  const todayDate = new Date().toISOString().split("T")[0];
  apodDateInput.value = todayDate;
  fetchSpaceData(todayDate);
});

// 2

async function Launches() {
  try {
    let res = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?format=json"
    );
    // let res = await fetch(
    //   "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
    // );
    let finalres = await res.json();

    // نرسل المصفوفة results للدالة المسؤولة عن العرض
    displayLunch(finalres.results);
  } catch (error) {
    console.error("خطأ في جلب البيانات:", error);
  }
}

function displayLunch(zzz) {
  let cartona = "";
  for (let i = 0; i < zzz.length; i++) {
    // 1. معالجة التاريخ والوقت من حقل net
    const launchDate = new Date(zzz[i].net);
    const formattedDate = launchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = launchDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // 2. تحديد لون الحالة بناءً على abbrev
    let statusBg = "bg-blue-500/90"; // الافتراضي TBD
    if (zzz[i].status.abbrev === "Go") statusBg = "bg-green-500/90";
    if (zzz[i].status.abbrev === "TBC") statusBg = "bg-yellow-500/90";

    cartona += `
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
        <!-- مسار الصورة الصحيح من بياناتك -->
        <img src="${
          zzz[i].image.image_url
        }" class="w-full h-full object-cover" alt="${zzz[i].name}" />
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 ${statusBg} text-white backdrop-blur-sm rounded-full text-xs font-semibold">
            ${zzz[i].status.abbrev}
          </span>
        </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
          <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            ${zzz[i].name}
          </h4>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <i class="fas fa-building text-xs"></i>
            ${zzz[i].launch_service_provider.name}
          </p>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-calendar text-slate-500 w-4"></i>
            <span class="text-slate-300">${formattedDate}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-clock text-slate-500 w-4"></i>
            <span class="text-slate-300">${formattedTime} UTC</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-rocket text-slate-500 w-4"></i>
            <span class="text-slate-300">${
              zzz[i].rocket.configuration.full_name
            }</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
            <span class="text-slate-300 line-clamp-1">${
              zzz[i].pad?.location?.name || "Unknown Location"
            }</span>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
          <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
            Details
          </button>
          <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
    `;
  }
  // عرض النتيجة في الـ Grid
  document.getElementById("launches-grid").innerHTML = cartona;
}
function displayImg(mainImg) {
  let cartona = "";
  for (let i = 0; i < mainImg.length; i++) {
    // 1. معالجة التاريخ والوقت من حقل net
    const launchDate = new Date(mainImg[i].net);
    const formattedDate = launchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = launchDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // 2. تحديد لون الحالة بناءً على abbrev
    let statusBg = "bg-blue-500/90"; // الافتراضي TBD
    if (mainImg[i].status.abbrev === "Go") statusBg = "bg-green-500/90";
    if (mainImg[i].status.abbrev === "TBC") statusBg = "bg-yellow-500/90";

    cartona += `
    
        <img src="${mainImg[i].image.image_url}" class="w-full h-full object-cover" alt="${mainImg[i].name}" />
  
    `;
  }
  // عرض النتيجة في الـ Grid
  document.getElementById("hero-image-container").innerHTML = cartona;
}

// تشغيل الكود
Launches();

const imageUrl = `https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20221009234147.png`;

function setHeroImage(url) {
  const container = document.getElementById("main-hero-image");

  // إنشاء وسم الصورة الجديد
  const imgHtml = `
        <img 
            src="${url}" 
            class="absolute inset-0 w-full h-full object-cover" 
            alt="Rocket Launch 2026"
        />
        <!-- الحفاظ على الطبقة الشفافة فوق الصورة -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
    `;

  // تحديث المحتوى
  container.innerHTML = imgHtml;
}

// تنفيذ الإضافة
setHeroImage(imageUrl);
