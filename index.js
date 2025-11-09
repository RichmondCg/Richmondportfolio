// Minimal interactivity for the portfolio dashboard

// Global variables for project management
let currentPage = 0;
const itemsPerPage = 2;

document.addEventListener("DOMContentLoaded", () => {
  // Project filtering for projects.html
  const filterBtns = document.querySelectorAll(".project-filter-btn");
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active style from all
        filterBtns.forEach((b) =>
          b.classList.remove(
            "bg-blue-200",
            "dark:bg-blue-800",
            "text-blue-900",
            "dark:text-blue-100"
          )
        );
        // Add active style to clicked
        btn.classList.add(
          "bg-blue-200",
          "dark:bg-blue-800",
          "text-blue-900",
          "dark:text-blue-100"
        );
        // Set filter
        currentPage = 0;
        updateProjectDisplay(btn.getAttribute("data-category"));
      });
    });
  }
  // Mobile Menu Toggle
  const burgerMenu = document.getElementById("burger-menu");
  const closeMenuBtn = document.getElementById("close-menu");
  const sidebar = document.getElementById("sidebar");
  const mobileOverlay = document.getElementById("mobile-overlay");

  function openMobileMenu() {
    sidebar.classList.add("active");
    mobileOverlay.classList.add("active");
    burgerMenu.classList.add("hidden");
  }

  function closeMobileMenu() {
    sidebar.classList.remove("active");
    mobileOverlay.classList.remove("active");
    burgerMenu.classList.remove("hidden");
  }

  if (burgerMenu) {
    burgerMenu.addEventListener("click", openMobileMenu);
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileMenu);
  }

  // Dark Mode Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  const sunIconMobile = document.getElementById("sun-icon-mobile");
  const moonIconMobile = document.getElementById("moon-icon-mobile");
  const html = document.documentElement;

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") {
    html.classList.remove("light");
    html.classList.add("dark");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
    sunIconMobile.classList.remove("hidden");
    moonIconMobile.classList.add("hidden");
  }

  // Function to toggle theme
  const toggleTheme = () => {
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
      sunIconMobile.classList.add("hidden");
      moonIconMobile.classList.remove("hidden");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
      sunIconMobile.classList.remove("hidden");
      moonIconMobile.classList.add("hidden");
    }
  };

  // Add event listeners to both toggles
  themeToggle.addEventListener("click", toggleTheme);
  themeToggleMobile.addEventListener("click", toggleTheme);

  // Set current year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Auto-highlight active nav link based on current page
  (function setActiveNav() {
    const links = document.querySelectorAll("aside nav a");
    if (!links || links.length === 0) return;
    let path = window.location.pathname || "";
    // e.g., '/index.html' or '/C:/.../index.html'; take the last segment
    let current = path.split("/").pop();
    if (!current || current.trim() === "") current = "index.html";
    current = current.toLowerCase();

    links.forEach((a) => {
      a.classList.remove("tab-active");
      a.removeAttribute("aria-current");
      try {
        const hrefPath = new URL(a.href).pathname || "";
        const hrefFile = (hrefPath.split("/").pop() || "").toLowerCase();
        if (hrefFile === current) {
          a.classList.add("tab-active");
          a.setAttribute("aria-current", "page");
        }
      } catch (_) {
        const rawHref = (a.getAttribute("href") || "").toLowerCase();
        if (rawHref === current) {
          a.classList.add("tab-active");
          a.setAttribute("aria-current", "page");
        }
      }
    });
  })();

  // Sample stats (replace with real data or fetch from APIs)
  const stats = {
    projects: 8,
    certificates: 5,
    githubStatus: "Active",
  };

  const projectsEl = document.getElementById("total-projects");
  const certsEl = document.getElementById("total-certificates");
  const ghEl = document.getElementById("github-status");
  if (projectsEl) projectsEl.textContent = stats.projects;
  if (certsEl) certsEl.textContent = stats.certificates;
  if (ghEl) ghEl.textContent = stats.githubStatus;

  // (Removed legacy SPA tab behavior and dynamic section handling)

  // Project preview modal logic
  const previewModal = document.getElementById("project-preview");
  const previewOverlay = document.getElementById("preview-overlay");
  const previewTitle = document.getElementById("preview-title");
  const previewDescription = document.getElementById("preview-description");
  const previewTechStack = document.getElementById("preview-tech-stack");
  const previewStory = document.getElementById("preview-story");
  const closePreviewBtn = document.getElementById("close-preview");

  function showProjectPreview(card) {
    if (!card) return;
    previewTitle.textContent = card.getAttribute("data-title") || "";
    previewDescription.textContent =
      card.getAttribute("data-description") || "";
    previewStory.textContent = card.getAttribute("data-story") || "";
    // Tech stack as chips
    const techs = (card.getAttribute("data-tech") || "").split(",");
    previewTechStack.innerHTML = "";
    techs.forEach((t) => {
      if (t.trim()) {
        const span = document.createElement("span");
        span.className =
          "px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded text-xs mr-1 mb-1 inline-block";
        span.textContent = t.trim();
        previewTechStack.appendChild(span);
      }
    });
    // Awards (data-award) - comma separated values
    try {
      const awardsRaw = card.getAttribute("data-award") || "";
      const awardsWrapper = document.getElementById("preview-awards-wrapper");
      const awardsContainer = document.getElementById("preview-awards");
      if (awardsContainer && awardsWrapper) {
        awardsContainer.innerHTML = "";
        if (awardsRaw.trim()) {
          const awards = awardsRaw
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);
          awards.forEach((a) => {
            const sp = document.createElement("span");
            sp.className =
              "px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded text-xs mr-1 mb-1 inline-block";
            sp.textContent = a;
            awardsContainer.appendChild(sp);
          });
          awardsWrapper.style.display = "";
        } else {
          awardsWrapper.style.display = "none";
        }
      }
    } catch (e) {
      /* ignore DOM errors */
    }
    // Load image into preview from card's data-image attribute (fallback to placeholder)
    try {
      const previewImgEl = document.querySelector("#preview-image img");
      if (previewImgEl) {
        const imgSrc =
          card.getAttribute("data-image") ||
          "./images/projects/placeholder.svg";
        previewImgEl.src = imgSrc;
        previewImgEl.alt = card.getAttribute("data-title") || "Project image";
      }
    } catch (e) {
      // silently ignore if DOM not present
    }
    previewModal.classList.add("active");
    previewOverlay.classList.add("active");
  }

  function hideProjectPreview() {
    previewModal.classList.remove("active");
    previewOverlay.classList.remove("active");
    // clear preview image to free memory
    try {
      const previewImgEl = document.querySelector("#preview-image img");
      if (previewImgEl) {
        previewImgEl.src = "";
        previewImgEl.alt = "";
      }
    } catch (e) {}
  }

  // Attach click listeners to project cards
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", function () {
      showProjectPreview(card);
    });
  });
  if (closePreviewBtn)
    closePreviewBtn.addEventListener("click", hideProjectPreview);
  if (previewOverlay)
    previewOverlay.addEventListener("click", hideProjectPreview);

  // Project filtering and pagination
  // Initial setup
  updateProjectDisplay();

  // Resume Preview Modal
  const viewResumeBtn = document.getElementById("view-resume-btn");
  const closeResumeBtn = document.getElementById("close-resume");
  const resumeOverlay = document.getElementById("resume-overlay");

  // Resume button click
  if (viewResumeBtn) {
    viewResumeBtn.addEventListener("click", showResume);
  }

  // Close resume handlers
  if (closeResumeBtn) {
    closeResumeBtn.addEventListener("click", hideResume);
  }
  if (resumeOverlay) {
    resumeOverlay.addEventListener("click", hideResume);
  }

  // Close on Escape key (for both modals)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hidePreview();
      hideResume();
    }
  });
});

// Global resume functions (accessible from HTML onclick)
function showResume() {
  const resumeIframe = document.getElementById("resume-iframe");
  const resumeObject = document.getElementById("resume-object");
  const resumePreview = document.getElementById("resume-preview");
  const resumeOverlay = document.getElementById("resume-overlay");
  const resumeOpenLink = document.getElementById("open-resume-newtab");
  const resumeOpenLinkFallback = document.getElementById(
    "open-resume-newtab-fallback"
  );

  if ((resumeIframe || resumeObject) && resumePreview && resumeOverlay) {
    const resumeUrl = "resume.pdf#view=FitH";
    if (resumeIframe) resumeIframe.src = resumeUrl;
    if (resumeObject) resumeObject.data = resumeUrl;
    if (resumeOpenLink) {
      resumeOpenLink.href = resumeUrl;
    }
    if (resumeOpenLinkFallback) {
      resumeOpenLinkFallback.href = resumeUrl;
    }
    // Show modal and overlay (fix for display)
    resumePreview.style.display = "block";
    resumeOverlay.style.display = "block";
    resumePreview.classList.add("active");
    resumeOverlay.classList.add("active");
    resumePreview.style.opacity = "1";
    resumePreview.style.pointerEvents = "auto";
    resumeOverlay.style.opacity = "1";
    resumeOverlay.style.pointerEvents = "auto";
  }
}

function hideResume() {
  const resumePreview = document.getElementById("resume-preview");
  const resumeOverlay = document.getElementById("resume-overlay");
  const resumeIframe = document.getElementById("resume-iframe");
  const resumeObject = document.getElementById("resume-object");
  const resumeOpenLink = document.getElementById("open-resume-newtab");

  if (resumePreview && resumeOverlay) {
    resumePreview.classList.remove("active");
    resumeOverlay.classList.remove("active");
    resumePreview.style.opacity = "0";
    resumePreview.style.pointerEvents = "none";
    resumeOverlay.style.opacity = "0";
    resumeOverlay.style.pointerEvents = "none";
    resumePreview.style.display = "none";
    resumeOverlay.style.display = "none";
    if (resumeIframe) {
      setTimeout(() => {
        resumeIframe.src = "";
      }, 300);
    }
    if (resumeObject) {
      setTimeout(() => {
        resumeObject.data = "";
      }, 300);
    }
    if (resumeOpenLink) {
      resumeOpenLink.removeAttribute("href");
    }
  }
}

// Global function for updating project display
function updateProjectDisplay(activeCategory = "all") {
  const projectCards = document.querySelectorAll(".project-card");
  const nextBtn = document.getElementById("next-projects-btn");
  const backBtn = document.getElementById("back-projects-btn");

  // Get filtered projects
  const filteredProjects = Array.from(projectCards).filter((card) => {
    return (
      activeCategory === "all" ||
      card.getAttribute("data-category") === activeCategory
    );
  });

  // Hide all projects first
  projectCards.forEach((card) => {
    card.style.display = "none";
  });

  // Calculate start and end indices for 3-column grid
  const perPage = 6; // 3 columns x 2 rows
  const start = currentPage * perPage;
  const end = start + perPage;

  // Show only projects for current page
  filteredProjects.slice(start, end).forEach((card) => {
    card.style.display = "flex";
  });

  // Show/hide next button based on remaining projects
  if (nextBtn) {
    nextBtn.style.display = end >= filteredProjects.length ? "none" : "flex";
  }

  // (Legacy handleTab removed)
  // (No project preview modal logic)
}

function handleTab(tab) {
  const dynamic = document.getElementById("dynamic-section");
  if (!dynamic) return;

  // Get the stored original HTML
  const originalHTML = dynamic.getAttribute("data-original-html");

  if (tab === "about" || tab === "projects") {
    // Restore original projects section
    if (originalHTML) {
      dynamic.innerHTML = originalHTML;

      // (No project listeners to re-attach)

      // Reset to first page and update display
      currentPage = 0;
      updateProjectDisplay("all");
    }
  } else if (tab === "certificates") {
    dynamic.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
        <h3 class="text-md font-semibold dark:text-white">Certificates</h3>
        <ul class="mt-3 space-y-3 text-gray-600 dark:text-gray-300">
          <li class="p-3 border dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-medium dark:text-white">Backend Development Certification</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Example Academy — 2024</div>
              </div>
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </li>
          <li class="p-3 border dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-medium dark:text-white">Distributed Systems Course</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Online Platform — 2023</div>
              </div>
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </li>
          <li class="p-3 border dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-medium dark:text-white">Database Design & Management</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Coursera — 2023</div>
              </div>
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </li>
        </ul>
      </div>
    `;
  } else if (tab === "achievements") {
    dynamic.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
        <h3 class="text-md font-semibold dark:text-white">Achievements</h3>
        <ul class="mt-3 space-y-3 text-gray-600 dark:text-gray-300">
          <li class="p-3 border dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-medium dark:text-white">Techno Day C++ Competition - 2nd Place</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">2023-2024</div>
              </div>
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </li>
          <li class="p-3 border dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-medium dark:text-white">Division Science and Technology Fair</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Investigatory Project - Representative</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">2018-2019</div>
              </div>
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </li>
        </ul>
      </div>
    `;
  } else if (tab === "blog") {
    dynamic.innerHTML = `
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-fit">
        <h3 class="text-md font-semibold">Blog</h3>
        <p class="mt-3 text-gray-600">No posts yet. Coming soon!</p>
      </div>
    `;
  } else if (tab === "contact") {
    dynamic.innerHTML = `
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-fit">
        <h3 class="text-md font-semibold">Contact</h3>
        <div class="mt-3 space-y-3 text-gray-600">
          <p><strong>Email:</strong> your.email@example.com</p>
          <p><strong>LinkedIn:</strong> linkedin.com/in/yourprofile</p>
          <p><strong>GitHub:</strong> github.com/yourusername</p>
        </div>
      </div>
    `;
  }
}
