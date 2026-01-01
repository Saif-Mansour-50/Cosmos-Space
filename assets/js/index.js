document.addEventListener("DOMContentLoaded", () => {
  // 1. إعدادات التاريخ لعام 2026
  const now = new Date();
  const isoDate = now.toISOString().split("T")[0]; // 2026-01-01
  const prettyDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 2. عناصر التحكم في التنقل (Navigation)
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".app-section");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  // وظيفة التنقل بين الأقسام
  function showSection(sectionId) {
    sections.forEach((section) => {
      section.classList.add("hidden"); // إخفاء الكل
      if (section.id === sectionId) section.classList.remove("hidden"); // إظهار الهدف
    });

    navLinks.forEach((link) => {
      if (link.getAttribute("data-section") === sectionId) {
        link.classList.add("bg-blue-500/10", "text-blue-400");
      } else {
        link.classList.remove("bg-blue-500/10", "text-blue-400");
      }
    });
  }

  // إضافة مستمعات الأحداث للروابط
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");
      showSection(sectionId);

      // جلب البيانات بناءً على القسم المختار
      if (sectionId === "launches") fetchUpcomingLaunches();

      // إغلاق السايدبار في الموبايل
      if (window.innerWidth < 1024) sidebar.classList.add("-translate-x-full");
    });
  });

  // تبديل السايدبار (Mobile Toggle)
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });

  // 3. ضبط تواريخ الصفحة تلقائياً لعام 2026
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

  // 4. دالة جلب بيانات ناسا (Today in Space)
  async function fetchNASAData(date) {
    const loading = document.getElementById("apod-loading");
    const container = document.getElementById("apod-image-container");
    loading.classList.remove("hidden");

    try {
      const response = await fetch(`api.nasa.gov{date}`);
      const data = await response.json();

      // تحديث الصورة والبيانات
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
      console.error("NASA API Error:", error);
    } finally {
      loading.classList.add("hidden");
    }
  }

  // 5. دالة جلب رحلات الفضاء (SpaceDevs API)
  async function fetchUpcomingLaunches() {
    const grid = document.getElementById("launches-grid");
    const featured = document.getElementById("featured-launch");

    try {
      const response = await fetch("ll.thespacedevs.com");
      const data = await response.json();

      // تحديث العدادات في الهيدر
      document.getElementById(
        "launches-count"
      ).textContent = `${data.count} Launches`;
      document.getElementById("launches-count-mobile").textContent = data.count;

      // بناء محتوى الرحلات (تبسيطاً سنحدث الـ Grid)
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
    } catch (error) {
      console.log("Launch Data Error:", error);
    }
  }

  // تشغيل جلب بيانات ناسا فور فتح الصفحة
  fetchNASAData(isoDate);
});

// #############################################
//1
document.addEventListener("DOMContentLoaded", () => {
  // 1. الحصول على التاريخ الحالي (2026-01-01)
  const today = new Date();

  // تنسيق YYYY-MM-DD (للحقول البرمجية)
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const isoDate = `${yyyy}-${mm}-${dd}`;

  // تنسيق نصي جذاب (مثل Jan 1, 2026)
  const options = { year: "numeric", month: "short", day: "numeric" };
  const prettyDate = today.toLocaleDateString("en-US", options);

  // 2. تحديث حقل إدخال التاريخ (Input)
  const dateInput = document.getElementById("apod-date-input");
  if (dateInput) {
    dateInput.value = isoDate;
    dateInput.max = isoDate; // منع اختيار تاريخ مستقبلي
  }

  // 3. تحديث النص المكتوب بجانب أيقونة التقويم
  const dateSpan = document.querySelector(".date-input-wrapper span");
  if (dateSpan) {
    dateSpan.textContent = prettyDate;
  }

  // 4. تحديث نص عنوان القسم (Today in Space)
  const apodDateText = document.getElementById("apod-date");
  if (apodDateText) {
    apodDateText.textContent = `Astronomy Picture of the Day - ${prettyDate}`;
  }

  // 5. تحديث عنصر معلومات التاريخ (الذي أرسلته مؤخراً)
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

// 3
