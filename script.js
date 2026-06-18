const events = [
  {
    title: "AI Builders Summit",
    category: "AI",
    day: "14",
    month: "Jul",
    location: "San Francisco, CA",
    format: "Hybrid",
    description: "A focused event for teams building AI products, copilots, model infrastructure, and enterprise automation."
  },
  {
    title: "Cloud Operations Forum",
    category: "Cloud",
    day: "22",
    month: "Jul",
    location: "Austin, TX",
    format: "In person",
    description: "Cloud leaders discuss observability, cost control, serverless architecture, platform engineering, and reliability."
  },
  {
    title: "Endpoint Security Briefing",
    category: "Cybersecurity",
    day: "05",
    month: "Aug",
    location: "Remote",
    format: "Virtual",
    description: "Security practitioners cover EDR, AI-native threat detection, identity risk, vulnerability prioritization, and response workflows."
  },
  {
    title: "Founder Demo Night",
    category: "Startups",
    day: "18",
    month: "Aug",
    location: "Los Angeles, CA",
    format: "In person",
    description: "Early-stage founders demo products across developer tools, robotics, hardware design, health tech, and enterprise software."
  },
  {
    title: "Developer Tools Week",
    category: "Cloud",
    day: "09",
    month: "Sep",
    location: "Seattle, WA",
    format: "Hybrid",
    description: "A week of sessions on APIs, SDKs, cloud-native development, CI/CD, internal platforms, and engineering velocity."
  },
  {
    title: "Applied AI in Hardware Design",
    category: "AI",
    day: "16",
    month: "Sep",
    location: "Remote",
    format: "Virtual",
    description: "Explore how AI-assisted workflows are changing CAD, prototyping, simulation, and manufacturing collaboration."
  }
];

const news = [
  {
    title: "Security teams prioritize identity risk and endpoint visibility.",
    category: "Cybersecurity",
    description: "Organizations are tightening endpoint telemetry, cloud identity controls, and response playbooks as hybrid work expands."
  },
  {
    title: "Cloud cost management becomes a product discipline.",
    category: "Cloud",
    description: "FinOps practices are moving earlier into architecture decisions so teams can design reliable systems without runaway spend."
  },
  {
    title: "Startups focus on vertical AI products with clear workflow ownership.",
    category: "Startups",
    description: "Investors are paying closer attention to AI tools that own a specific job function instead of offering generic chat interfaces."
  }
];

const eventGrid = document.querySelector("#eventGrid");
const newsList = document.querySelector("#newsList");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll("[data-filter]");
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const modal = document.querySelector("#briefModal");
const modalTitle = document.querySelector("#modalTitle");
const modalCopy = document.querySelector("#modalCopy");
const newsletterForm = document.querySelector("#newsletterForm");
const formMessage = document.querySelector("#formMessage");

let activeFilter = "all";

function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = events.filter((event) => {
    const matchesFilter = activeFilter === "all" || event.category === activeFilter;
    const searchable = `${event.title} ${event.category} ${event.location} ${event.format} ${event.description}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });

  eventGrid.innerHTML = filtered.length
    ? filtered.map((event) => `
      <article class="event-card reveal visible">
        <div class="card-top">
          <span class="tag">${event.category}</span>
          <span class="date-pill"><span>${event.month}</span><strong>${event.day}</strong></span>
        </div>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <div class="meta">${event.location} · ${event.format}</div>
      </article>
    `).join("")
    : `<p class="empty-state">No matching events found. Try another category or search term.</p>`;
}

function renderNews() {
  newsList.innerHTML = news.map((item) => `
    <article class="news-item">
      <span class="tag">${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <button class="text-link" type="button" data-open-modal="${item.title}">Read brief →</button>
    </article>
  `).join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderEvents();
  });
});

searchInput.addEventListener("input", renderEvents);

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-open-modal]");
  if (!opener) return;
  modalTitle.textContent = opener.dataset.openModal;
  modalCopy.textContent = "This demo brief can later be connected to real article content, an API, or a CMS. For now, it shows the modal interaction and frontend structure.";
  modal.showModal();
});

document.querySelector("[data-close-modal]").addEventListener("click", () => modal.close());

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(newsletterForm).get("email");
  formMessage.textContent = `Thanks — ${email} has been added to the demo subscriber list.`;
  newsletterForm.reset();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();

renderEvents();
renderNews();
