document.addEventListener("DOMContentLoaded", () => {
  // Navigation Router Logic
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page-section");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Update nav active state
      navLinks.forEach(l => {
        l.classList.remove("active", "bg-blue-600/20", "text-blue-400", "border-blue-500/20", "shadow-[0_0_15px_rgba(37,99,235,0.1)]");
        l.classList.add("hover:bg-slate-800/50", "hover:text-slate-100");
      });
      link.classList.remove("hover:bg-slate-800/50", "hover:text-slate-100");
      link.classList.add("active", "bg-blue-600/20", "text-blue-400", "border-blue-500/20", "shadow-[0_0_15px_rgba(37,99,235,0.1)]");

      // Hide all pages
      pages.forEach(p => p.classList.remove("active", "block"));
      pages.forEach(p => p.classList.add("hidden"));

      // Show selected page
      const targetPageId = "page-" + link.dataset.page;
      const targetPage = document.getElementById(targetPageId);
      if (targetPage) {
        targetPage.classList.remove("hidden");
        targetPage.classList.add("active", "block");
      }
    });
  });

  // Render Stat Cards
  const statsContainer = document.getElementById("stats-container");
  
  const formatNumber = (num) => {
    if (num >= 100000) return (num / 100000).toFixed(2) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const statCardsData = [
    { title: "Total Students", value: formatNumber(dashboardMetrics.totalStudents), icon: "users", color: "bg-blue-50 text-blue-600", perc: "4.2%" },
    { title: "Total Colleges", value: dashboardMetrics.totalColleges, icon: "graduation-cap", color: "bg-indigo-50 text-indigo-600", perc: "1.5%" },
    { title: "Total Faculty", value: formatNumber(dashboardMetrics.totalFaculty), icon: "book-open", color: "bg-purple-50 text-purple-600", perc: "2.8%" },
    { title: "Placement Rate", value: dashboardMetrics.placementRate + "%", icon: "briefcase", color: "bg-emerald-50 text-emerald-600", perc: "5.1%" },
    { title: "Average CGPA", value: dashboardMetrics.averageCgpa, icon: "award", color: "bg-amber-50 text-amber-600", perc: "0.2%" },
    { title: "Scholarship", value: formatNumber(dashboardMetrics.scholarshipStudents), icon: "percent", color: "bg-rose-50 text-rose-600", perc: "8.4%" },
  ];

  statCardsData.forEach(stat => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full";
    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div class="flex flex-col">
          <span class="text-slate-500 font-medium text-sm mb-1">${stat.title}</span>
          <span class="text-3xl font-bold text-slate-800">${stat.value}</span>
        </div>
        <div class="p-3 rounded-lg flex items-center justify-center ${stat.color}">
          <i data-lucide="${stat.icon}" class="w-6 h-6"></i>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-auto">
        <span class="flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-dashboard-success/10 text-dashboard-success">
          <i data-lucide="arrow-up-right" class="w-3 h-3 mr-1"></i> ${stat.perc}
        </span>
        <span class="text-xs text-slate-400 font-medium">vs last year</span>
      </div>
    `;
    statsContainer.appendChild(card);
  });

  // Re-initialize icons for newly added elements
  lucide.createIcons();

  // Render Charts using Chart.js
  const ctx1 = document.getElementById('chart1').getContext('2d');
  new Chart(ctx1, {
    type: 'line',
    data: {
      labels: dashboardMetrics.studentAdmissionTrend.map(d => d.year),
      datasets: [{
        label: 'Students',
        data: dashboardMetrics.studentAdmissionTrend.map(d => d.students),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: false,
          grid: { display: false },
          border: { display: false }
        },
        x: {
          grid: { display: false },
          border: { display: false }
        }
      }
    }
  });

  const ctx2 = document.getElementById('chart2').getContext('2d');
  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: dashboardMetrics.studentsByBranch.map(d => d.name),
      datasets: [{
        data: dashboardMetrics.studentsByBranch.map(d => d.value),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // Render Colleges List
  const collegesContainer = document.getElementById("colleges-container");
  mockColleges.forEach(college => {
    const colCard = document.createElement("div");
    colCard.className = "bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer";
    colCard.innerHTML = `
      <div class="flex items-start justify-between mb-4">
        <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
          <i data-lucide="building-2" class="w-6 h-6"></i>
        </div>
        <span class="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
          ${college.naacGrade} Grade
        </span>
      </div>
      <h3 class="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2">${college.name}</h3>
      <div class="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <i data-lucide="map-pin" class="w-4 h-4"></i> ${college.district}
      </div>
      <div class="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-slate-100 pt-4">
        <div><p class="text-xs text-slate-400 mb-1">Students</p><p class="font-semibold text-slate-700">${college.totalStudents}</p></div>
        <div><p class="text-xs text-slate-400 mb-1">Faculty</p><p class="font-semibold text-slate-700">${college.facultyCount}</p></div>
        <div><p class="text-xs text-slate-400 mb-1">Avg CGPA</p><p class="font-semibold text-slate-700">${college.averageCgpa}</p></div>
        <div><p class="text-xs text-slate-400 mb-1">Placement</p><p class="font-semibold text-emerald-600">${college.placementRate}%</p></div>
      </div>
    `;
    collegesContainer.appendChild(colCard);
  });
  
  lucide.createIcons();
});
