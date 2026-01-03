document.addEventListener("DOMContentLoaded", function () {
  let navLinks = document.querySelectorAll(".nav-link");
  let sections = document.querySelectorAll(".app-section");
  let sidebar = document.getElementById("sidebar");
  let sidebarToggle = document.getElementById("sidebar-toggle");

  function showSection(sectionId) {
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.add("hidden");
      if (sections[i].id === sectionId) {
        sections[i].classList.remove("hidden");
      }
    }

    for (let j = 0; j < navLinks.length; j++) {
      if (navLinks[j].getAttribute("data-section") === sectionId) {
        navLinks[j].classList.add("bg-blue-500/10", "text-blue-400");
      } else {
        navLinks[j].classList.remove("bg-blue-500/10", "text-blue-400");
      }
    }
  }

  for (let k = 0; k < navLinks.length; k++) {
    navLinks[k].addEventListener("click", function (e) {
      e.preventDefault();
      let sectionId = this.getAttribute("data-section");

      showSection(sectionId);

      if (window.innerWidth < 1024 && sidebar) {
        sidebar.classList.add("-translate-x-full");
      }
    });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("-translate-x-full");
    });
  }
});

//1 Today in Space

document.addEventListener("DOMContentLoaded", () => {
  let today = new Date();

  let yyyy = today.getFullYear();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let realDate = `${yyyy}-${mm}-${dd}`;

  let options = { month: "short", day: "numeric", year: "numeric" };
  let prettyDate = today.toLocaleDateString("en-US", options);

  let dateInput = document.getElementById("apod-date-input");
  if (dateInput) {
    dateInput.value = realDate;
  }

  let dateSpan = document.querySelector(".date-input-wrapper span");
  if (dateSpan) {
    dateSpan.textContent = prettyDate;
  }

  let apodDateText = document.getElementById("apod-date");
  if (apodDateText) {
    apodDateText.textContent = `Astronomy Picture of the Day - ${prettyDate}`;
  }

  let apodDateInfo = document.getElementById("apod-date-info");
  if (apodDateInfo) {
    apodDateInfo.textContent = realDate;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let apodDateInput = document.getElementById("apod-date-input");
  let apodDateDetail = document.getElementById("apod-date-detail"); // الـ ID الجديد
  let loadDateBtn = document.getElementById("load-date-btn");
  let todayApodBtn = document.getElementById("today-apod-btn");
  let imageContainer = document.getElementById("apod-image-container");
  let loadingElement = document.getElementById("apod-loading");

  // 2. تجهيز تاريخ اليوم (January 3, 2026)
  let today = new Date();
  let options = { year: "numeric", month: "long", day: "numeric" };
  let prettyDate = today.toLocaleDateString("en-US", options);

  // 3. وضع التاريخ داخل الـ id الجديد بمجرد تشغيل الكود
  if (apodDateDetail) {
    apodDateDetail.textContent = prettyDate;
  }
  async function fetchSpaceData(date = "") {
    loadingElement.classList.remove("hidden");
    imageContainer.style.backgroundImage = "none";

    let url = `https://api.nasa.gov/planetary/apod?api_key=7pXhpXtFXLjXMpcOcilivPXLTbfnGs9FnCgtu17J`;
    if (date) url += `&date=${date}`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (response.status === 200) {
        displayData(data);
      } else {
        alert("erorr");
      }
    } catch (error) {
      console.error(" Erorr :", error);
    } finally {
      loadingElement.classList.add("hidden");
    }
  }

  function displayData(data) {
    document.getElementById(
      "apod-date"
    ).innerText = `Astronomy Picture of the Day - ${data.date}`;

    if (data.media_type === "image") {
      imageContainer.innerHTML = "";
      imageContainer.style.backgroundImage = `url('${data.url}')`;
      imageContainer.style.backgroundSize = "cover";
      imageContainer.style.backgroundPosition = "center";
    } else {
      imageContainer.style.backgroundImage = "none";
      imageContainer.innerHTML = `<iframe class="w-full h-full rounded-2xl" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    }

    let titleElem = document.getElementById("apod-title");
    let descElem = document.getElementById("apod-explanation");

    if (titleElem) titleElem.innerText = data.title;
    if (descElem) descElem.innerText = data.explanation;
  }

  loadDateBtn.addEventListener("click", () => {
    let selectedDate = apodDateInput.value;
    if (selectedDate) fetchSpaceData(selectedDate);
  });

  todayApodBtn.addEventListener("click", () => {
    let today = new Date().toISOString().split("T")[0];
    apodDateInput.value = today;
    fetchSpaceData(today);
  });

  let todayDate = new Date().toISOString().split("T")[0];
  apodDateInput.value = todayDate;
  fetchSpaceData(todayDate);
});

// 2

async function Launches() {
  try {
    let res = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?format=json"
    );

    let finalres = await res.json();

    displayLunch(finalres.results);
  } catch (error) {
    console.error("Erorr", error);
  }
}

function displayLunch(zzz) {
  let cartona = "";
  for (let i = 0; i < zzz.length; i++) {
    let launchDate = new Date(zzz[i].net);
    let formattedDate = launchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = launchDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let statusBg = "bg-blue-500/90";
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
  document.getElementById("launches-grid").innerHTML = cartona;
}

function displayImg(mainImg) {
  let cartona = "";
  for (let i = 0; i < mainImg.length; i++) {
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

    let statusBg = "bg-blue-500/90";
    if (mainImg[i].status.abbrev === "Go") statusBg = "bg-green-500/90";
    if (mainImg[i].status.abbrev === "TBC") statusBg = "bg-yellow-500/90";

    cartona += `
    
        <img src="${mainImg[i].image.image_url}" class="w-full h-full object-cover" alt="${mainImg[i].name}" />
  
    `;
  }

  document.getElementById("hero-image-container").innerHTML = cartona;
}

Launches();

const imageUrl = `https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20221009234147.png`;

function setHeroImage(url) {
  // تم تغيير الـ ID هنا ليتطابق مع الـ HTML الخاص بك
  const container = document.getElementById("hero-image-container");

  if (container) {
    container.innerHTML = `
        <img 
            src="${url}" 
            class="absolute inset-0 w-full h-full object-cover transition-all duration-1000" 
            alt="Rocket Launch 2026"
            onload="this.style.opacity='1'"
            style="opacity: 0"
        />
        <!-- الطبقة الشفافة (Gradient) -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
    `;
  } else {
    console.error("لم يتم العثور على عنصر باسم hero-image-container");
  }
}

// تنفيذ الإضافة
setHeroImage(imageUrl);

async function Planets() {
  try {
    let res = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets"
    );

    let finalres = await res.json();

    console.log(finalres.bodies);

    displayPlanets(finalres.bodies);
  } catch (error) {
    console.error(" Erorr  :", error);
  }
}

function displayPlanets(Planets) {
  let cartona = ``;

  const colors = {
    Mercury: "#eab308",
    Venus: "#f97316",
    Earth: "#3b82f6",
    Mars: "#ef4444",
    Jupiter: "#fb923c",
    Saturn: "#facc15",
    Uranus: "#06b6d4",
    Neptune: "#2563eb",
  };

  for (let i = 0; i < Planets.length; i++) {
    let planetColor = colors[Planets[i].englishName] || "#94a3b8";

    let distanceAU = (Planets[i].semimajorAxis / 149597871).toFixed(2);

    cartona += `
      <tr onclick="updatePlanetDetails('${
        Planets[i].id
      }')" class="hover:bg-slate-800/30 transition-colors cursor-pointer border-b border-slate-700/50">
        <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
          <div class="flex items-center space-x-2 md:space-x-3">
            <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                 style="background-color: ${planetColor}"></div>
            <span class="font-semibold text-sm md:text-base whitespace-nowrap">
              ${Planets[i].englishName}
            </span>
          </div>
        </td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${distanceAU}
        </td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${Planets[i].meanRadius.toLocaleString()}
        </td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${Planets[i].gravity}
        </td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${Math.floor(Planets[i].sideralOrbit)} days
        </td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
          ${Planets[i].moons ? Planets[i].moons.length : 0}
        </td>
        <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
          <span class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200">
            ${Planets[i].bodyType}
          </span>
        </td>
      </tr>
    `;
  }
  document.getElementById("planet-comparison-tbody").innerHTML = cartona;
}

function updatePlanetDetails(planetId) {
  const planet = window.allPlanetsData.find((p) => p.id === planetId);

  if (planet) {
    document.getElementById("planet-detail-name").innerText =
      planet.englishName;
    document.getElementById("discovered-by").innerText =
      planet.discoveredBy || "Ancient Astronomers";
    document.getElementById("discovery-date").innerText =
      planet.discoveryDate || "Known since antiquity";

    if (planet.image)
      document.getElementById("planet-detail-image").src = planet.image;
  }
}

Planets();
