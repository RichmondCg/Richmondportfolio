// Minimal interactivity for the portfolio dashboard

// Global variables for project management
let currentPage = 0;
const itemsPerPage = 2;

document.addEventListener("DOMContentLoaded", () => {
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

  // Tabs behavior
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tab = btn.getAttribute("data-tab");
      handleTab(tab);
      // mark active
      tabButtons.forEach((b) => b.classList.remove("tab-active"));
      btn.classList.add("tab-active");

      // Close mobile menu on mobile devices
      if (window.innerWidth < 768) {
        closeMobileMenu();
      }
    });
  });

  // Store original projects HTML
  const dynamic = document.getElementById("dynamic-section");
  if (dynamic) {
    dynamic.setAttribute("data-original-html", dynamic.innerHTML);
  }

  // default active tab - mark as active but don't call handleTab to avoid overwriting
  const defaultBtn = document.querySelector('.tab-btn[data-tab="about"]');
  if (defaultBtn) {
    tabButtons.forEach((b) => b.classList.remove("tab-active"));
    defaultBtn.classList.add("tab-active");
  }

  // Project filtering and pagination

  // Initial setup
  attachProjectListeners();
  updateProjectDisplay();

  // Project Preview Modal
  const preview = document.getElementById("project-preview");
  const previewOverlay = document.getElementById("preview-overlay");
  const closePreviewBtn = document.getElementById("close-preview");

  // Close preview handlers
  closePreviewBtn.addEventListener("click", hidePreview);
  previewOverlay.addEventListener("click", hidePreview);

  // Initial attachment
  attachProjectClickListeners();

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
  const resumePreview = document.getElementById("resume-preview");
  const resumeOverlay = document.getElementById("resume-overlay");

  if (resumeIframe && resumePreview && resumeOverlay) {
    resumeIframe.src = "Richmond Gillaco Resume.pdf";
    resumePreview.classList.add("active");
    resumeOverlay.classList.add("active");
  }
}

function hideResume() {
  const resumePreview = document.getElementById("resume-preview");
  const resumeOverlay = document.getElementById("resume-overlay");
  const resumeIframe = document.getElementById("resume-iframe");

  if (resumePreview && resumeOverlay) {
    resumePreview.classList.remove("active");
    resumeOverlay.classList.remove("active");
    // Optional: clear iframe src when closing to stop loading
    if (resumeIframe) {
      setTimeout(() => {
        resumeIframe.src = "";
      }, 300);
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

  // Calculate start and end indices
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;

  // Show only projects for current page
  filteredProjects.slice(start, end).forEach((card) => {
    card.style.display = "block";
  });

  // Show/hide next button based on remaining projects
  if (nextBtn) {
    nextBtn.style.display = end >= filteredProjects.length ? "none" : "flex";
  }

  // Show/hide back button based on current page
  if (backBtn) {
    backBtn.style.display = currentPage > 0 ? "flex" : "none";
  }
}

// Global function for attaching project listeners
function attachProjectListeners() {
  const filterButtons = document.querySelectorAll(".project-filter-btn");
  const nextBtn = document.getElementById("next-projects-btn");
  const backBtn = document.getElementById("back-projects-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");
      currentPage = 0; // Reset to first page

      // Update active button
      filterButtons.forEach((b) => {
        b.classList.remove("bg-blue-100", "text-blue-700");
        b.classList.add("bg-gray-100", "text-gray-700");
      });
      btn.classList.remove("bg-gray-100", "text-gray-700");
      btn.classList.add("bg-blue-100", "text-blue-700");

      updateProjectDisplay(category);
    });
  });

  // Next button handler
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentPage++;
      const activeFilter = document.querySelector(
        ".project-filter-btn.bg-blue-100"
      );
      const category = activeFilter
        ? activeFilter.getAttribute("data-category")
        : "all";
      updateProjectDisplay(category);
    });
  }

  // Back button handler
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        const activeFilter = document.querySelector(
          ".project-filter-btn.bg-blue-100"
        );
        const category = activeFilter
          ? activeFilter.getAttribute("data-category")
          : "all";
        updateProjectDisplay(category);
      }
    });
  }
}

// Global function for showing preview
function showPreview(projectCard) {
  const preview = document.getElementById("project-preview");
  const previewOverlay = document.getElementById("preview-overlay");

  const title = projectCard.getAttribute("data-title");
  const description = projectCard.getAttribute("data-description");
  const techStack = projectCard.getAttribute("data-tech-stack");
  const story = projectCard.getAttribute("data-story");
  const image = projectCard.getAttribute("data-image");

  // Update preview content
  document.getElementById("preview-title").textContent = title;
  document.getElementById("preview-description").textContent = description;
  document.getElementById("preview-story").textContent = story;

  // Update image
  const imgElement = document.querySelector("#preview-image img");
  if (image) {
    imgElement.src = image;
    imgElement.alt = title;
  }

  // Update tech stack
  const techStackContainer = document.getElementById("preview-tech-stack");
  techStackContainer.innerHTML = "";
  if (techStack) {
    techStack.split(",").forEach((tech) => {
      const badge = document.createElement("span");
      badge.className =
        "px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs";
      badge.textContent = tech.trim();
      techStackContainer.appendChild(badge);
    });
  }

  // Show preview
  preview.classList.add("active");
  previewOverlay.classList.add("active");
}

// Global function for hiding preview
function hidePreview() {
  const preview = document.getElementById("project-preview");
  const previewOverlay = document.getElementById("preview-overlay");

  preview.classList.remove("active");
  previewOverlay.classList.remove("active");
}

// Global function for attaching click listeners to project cards
function attachProjectClickListeners() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      showPreview(card);
    });
  });
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

      // Re-attach all project-related listeners
      attachProjectListeners();
      attachProjectClickListeners();

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
