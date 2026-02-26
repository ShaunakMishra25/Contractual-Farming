// =============================================
// AGRICONTRACT - Main Script
// =============================================
// This file contains all the logic for the
// Contract Farming Platform prototype. Data is
// stored in JavaScript arrays and persisted
// across pages using localStorage.
// =============================================


// ===== MOCK DATA =====
// Default contracts created by factory owners
var defaultContracts = [
  {
    id: 1,
    crop: "Wheat",
    quantity: 50,
    pricePerUnit: 2500,
    duration: 6,
    description: "Looking for quality wheat suppliers for our flour mill. Must meet organic standards.",
    createdBy: "Sunrise Foods Pvt. Ltd.",
  },
  {
    id: 2,
    crop: "Rice",
    quantity: 100,
    pricePerUnit: 3200,
    duration: 8,
    description: "Basmati rice required for export. Premium grade only.",
    createdBy: "Golden Grain Exports",
  },
  {
    id: 3,
    crop: "Sugarcane",
    quantity: 200,
    pricePerUnit: 350,
    duration: 12,
    description: "Year-long supply contract for our sugar refinery.",
    createdBy: "SweetLife Sugar Mills",
  },
  {
    id: 4,
    crop: "Cotton",
    quantity: 75,
    pricePerUnit: 6500,
    duration: 10,
    description: "High-quality cotton for textile manufacturing. Competitive pricing guaranteed.",
    createdBy: "FabriCo Textiles",
  },
];

// Default applications (empty at start)
var defaultApplications = [];


// ===== DATA PERSISTENCE =====
// Load data from localStorage or use defaults
function loadContracts() {
  var stored = localStorage.getItem("agricontract_contracts");
  if (stored) {
    return JSON.parse(stored);
  }
  return JSON.parse(JSON.stringify(defaultContracts));
}

function loadApplications() {
  var stored = localStorage.getItem("agricontract_applications");
  if (stored) {
    return JSON.parse(stored);
  }
  return JSON.parse(JSON.stringify(defaultApplications));
}

// Save data to localStorage
function saveContracts() {
  localStorage.setItem("agricontract_contracts", JSON.stringify(contracts));
}

function saveApplications() {
  localStorage.setItem("agricontract_applications", JSON.stringify(applications));
}

// Initialize data from localStorage
var contracts = loadContracts();
var applications = loadApplications();

// Calculate next available IDs based on existing data
var nextContractId = contracts.length > 0
  ? Math.max.apply(null, contracts.map(function (c) { return c.id; })) + 1
  : 1;
var nextApplicationId = applications.length > 0
  ? Math.max.apply(null, applications.map(function (a) { return a.id; })) + 1
  : 1;


// ===== CROP CONFIGURATION =====
// Maps crop names to images and tag colors for the Tailwind-based farmer dashboard
var cropConfig = {
  "Wheat": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-orange-50", tagText: "text-orange-800", tagRing: "ring-orange-600/20",
    thumbBg: "bg-orange-100"
  },
  "Rice": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoHNSjgQ8WzMDx2pJL2SBCw79DIZsFuE1VdGXUYQwTf8-AmQLE6OsSdM60hUF7H6BBgYKb7xjxtRbUEdf-cvOgj4cSxjiuLRTjqPL1r1ZGETE4glWWLYz2Utc_mmXxfqcF5-VxYlIj-xpK0p88FAlAKj0IeSwSLHDMhEy7tF32mx0l6m92fXScssvxZAT4MLAU8rIwOezuhGPbSnNT4M0exMiiCWNegKV9i2bVxhU6FyGqxu44NUzqnoa3QEl6MTkXjXIcjqm9KwR",
    tagBg: "bg-green-50", tagText: "text-green-700", tagRing: "ring-green-600/20",
    thumbBg: "bg-green-100"
  },
  "Sugarcane": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUF4mP_6ZRhDi9pdLEIIB9jjFVcl32xJjUZIqKSqWq5nMW4uCiOVsTs9eBzj8Y9otfEpqjmgQaedf9JNYGpokFjYR42EEPu61-B3_sle6_CJQTQwQ4IL-ts4cVuBOJ7xhuDGwEHD9fT91osfhtU-4anBYjbKlj6EdRngtaMESMU_uIs5NER8ARF2x19R4IqyqSGZvQNMgUlDDi1sUvk_7as9dLE_xqxsvcznOvltutdp_cP5t610lx-jppln_Bph1mzLpAAZ3SH9eq",
    tagBg: "bg-yellow-50", tagText: "text-yellow-800", tagRing: "ring-yellow-600/20",
    thumbBg: "bg-yellow-100"
  },
  "Cotton": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-purple-50", tagText: "text-purple-700", tagRing: "ring-purple-600/20",
    thumbBg: "bg-purple-100"
  }
};

// Returns config for a crop, with fallback defaults
function getCropConfig(cropName) {
  if (cropConfig[cropName]) return cropConfig[cropName];
  return {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-gray-50", tagText: "text-gray-700", tagRing: "ring-gray-600/20",
    thumbBg: "bg-gray-100"
  };
}


// ===== TOAST NOTIFICATION =====
// Displays a brief message at the bottom-right of the screen
// Uses inline styles so it works on both Tailwind and CSS pages
function showToast(message) {
  var existingToast = document.querySelector(".toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  var toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;font-family:Inter,sans-serif;z-index:9999;opacity:0;transition:opacity 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:400px;";
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = "1";
  }, 10);

  setTimeout(function () {
    toast.style.opacity = "0";
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
}


// ===== FARMER DASHBOARD =====

// Updates the stat cards on the farmer dashboard
function updateFarmerStats() {
  var statActive = document.getElementById("statActiveContracts");
  var statPending = document.getElementById("statPendingApps");
  var statAvailable = document.getElementById("statAvailableContracts");
  if (!statActive) return;

  var appliedContractIds = applications.map(function (app) {
    return app.contractId;
  });
  var availableCount = contracts.filter(function (c) {
    return appliedContractIds.indexOf(c.id) === -1;
  }).length;
  var pendingCount = applications.filter(function (a) {
    return a.status === "Applied";
  }).length;
  var activeCount = applications.filter(function (a) {
    return a.status === "Approved";
  }).length;

  statActive.textContent = activeCount;
  statPending.textContent = pendingCount;
  statAvailable.textContent = availableCount;
}

// Renders the list of available contracts for the farmer (Tailwind cards)
function renderFarmerContracts() {
  var container = document.getElementById("farmerContractsList");
  var emptyState = document.getElementById("farmerEmptyContracts");
  if (!container || !emptyState) return;

  var appliedContractIds = applications.map(function (app) {
    return app.contractId;
  });

  var availableContracts = contracts.filter(function (contract) {
    return appliedContractIds.indexOf(contract.id) === -1;
  });

  if (availableContracts.length === 0) {
    container.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  container.innerHTML = availableContracts
    .map(function (contract) {
      var config = getCropConfig(contract.crop);
      return (
        '<div class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md border border-gray-100">' +
          '<div class="h-48 w-full bg-cover bg-center" style="background-image: url(\'' + config.image + '\');"></div>' +
          '<div class="flex flex-1 flex-col p-5">' +
            '<div class="mb-4">' +
              '<div class="flex items-center gap-2 mb-1">' +
                '<span class="inline-flex items-center rounded-md ' + config.tagBg + ' px-2 py-1 text-xs font-medium ' + config.tagText + ' ring-1 ring-inset ' + config.tagRing + '">' + contract.crop + '</span>' +
              '</div>' +
              '<h3 class="text-lg font-bold text-gray-900">' + contract.crop + ' Contract</h3>' +
              '<p class="text-sm text-gray-500">' + contract.createdBy + '</p>' +
            '</div>' +
            (contract.description ? '<p class="text-sm text-gray-600 mb-3">' + contract.description + '</p>' : '') +
            '<div class="mt-auto space-y-3">' +
              '<div class="flex items-center justify-between border-t border-gray-100 pt-3">' +
                '<span class="text-sm text-gray-500">Quantity</span>' +
                '<span class="font-semibold text-gray-900">' + contract.quantity + ' tons</span>' +
              '</div>' +
              '<div class="flex items-center justify-between">' +
                '<span class="text-sm text-gray-500">Price / Unit</span>' +
                '<span class="font-semibold text-gray-900">Rs. ' + contract.pricePerUnit.toLocaleString() + '</span>' +
              '</div>' +
              '<div class="flex items-center justify-between">' +
                '<span class="text-sm text-gray-500">Duration</span>' +
                '<span class="font-semibold text-gray-900">' + contract.duration + ' Months</span>' +
              '</div>' +
              '<button onclick="applyToContract(' + contract.id + ')" class="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mt-2 transition-colors">' +
                'Apply Now' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    })
    .join("");
}

// Renders the farmer's submitted applications as table rows (Tailwind table)
function renderFarmerApplications() {
  var container = document.getElementById("farmerApplicationsList");
  var emptyState = document.getElementById("farmerEmptyApplications");
  var tableWrapper = document.getElementById("farmerApplicationsTable");
  if (!container || !emptyState) return;

  if (applications.length === 0) {
    container.innerHTML = "";
    if (tableWrapper) tableWrapper.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  if (tableWrapper) tableWrapper.style.display = "block";

  container.innerHTML = applications
    .map(function (app) {
      var contract = contracts.find(function (c) {
        return c.id === app.contractId;
      });
      if (!contract) return "";

      var config = getCropConfig(contract.crop);

      // Determine status badge styles
      var statusBadge = '';
      if (app.status === "Approved") {
        statusBadge = '<span class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Approved</span>';
      } else if (app.status === "Rejected") {
        statusBadge = '<span class="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Rejected</span>';
      } else {
        statusBadge = '<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Under Review</span>';
      }

      return (
        '<tr>' +
          '<td class="whitespace-nowrap px-6 py-4">' +
            '<div class="flex items-center gap-3">' +
              '<div class="h-10 w-10 rounded-lg bg-cover bg-center ' + config.thumbBg + '" style="background-image: url(\'' + config.image + '\');"></div>' +
              '<span class="text-sm font-medium text-gray-900">' + contract.crop + '</span>' +
            '</div>' +
          '</td>' +
          '<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">' + contract.createdBy + '</td>' +
          '<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">' + contract.quantity + ' tons</td>' +
          '<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Rs. ' + contract.pricePerUnit.toLocaleString() + '</td>' +
          '<td class="whitespace-nowrap px-6 py-4">' + statusBadge + '</td>' +
        '</tr>'
      );
    })
    .join("");
}

// Handles farmer applying to a contract
function applyToContract(contractId) {
  var alreadyApplied = applications.some(function (app) {
    return app.contractId === contractId;
  });

  if (alreadyApplied) {
    showToast("You have already applied to this contract.");
    return;
  }

  applications.push({
    id: nextApplicationId++,
    contractId: contractId,
    farmerName: "Rajesh Kumar",
    status: "Applied",
  });

  saveApplications();
  showToast("Application submitted successfully.");

  // Re-render all farmer dashboard sections
  renderFarmerContracts();
  renderFarmerApplications();
  updateFarmerStats();
}


// ===== FACTORY DASHBOARD =====

// Renders the list of contracts created by the factory
function renderFactoryContracts() {
  var container = document.getElementById("factoryContractsList");
  var emptyState = document.getElementById("factoryEmptyContracts");
  if (!container || !emptyState) return;

  if (contracts.length === 0) {
    container.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  container.innerHTML = contracts
    .map(function (contract) {
      // Count total applications for this contract
      var appCount = applications.filter(function (app) {
        return app.contractId === contract.id;
      }).length;

      return (
        '<div class="card">' +
          "<h3>" + contract.crop + " Contract</h3>" +
          '<div class="card-detail"><span class="label">Factory</span><span class="value">' + contract.createdBy + "</span></div>" +
          '<div class="card-detail"><span class="label">Quantity</span><span class="value">' + contract.quantity + " tons</span></div>" +
          '<div class="card-detail"><span class="label">Price / Unit</span><span class="value">Rs. ' + contract.pricePerUnit.toLocaleString() + "</span></div>" +
          '<div class="card-detail"><span class="label">Duration</span><span class="value">' + contract.duration + " months</span></div>" +
          '<div class="card-detail"><span class="label">Applications</span><span class="value">' + appCount + " received</span></div>" +
          (contract.description ? '<p class="card-description">' + contract.description + "</p>" : "") +
        "</div>"
      );
    })
    .join("");
}

// Renders farmer applications for factory review (with Approve/Reject buttons)
function renderFactoryApplications() {
  var container = document.getElementById("factoryApplicationsList");
  var emptyState = document.getElementById("factoryEmptyApplications");
  if (!container || !emptyState) return;

  if (applications.length === 0) {
    container.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  container.innerHTML = applications
    .map(function (app) {
      var contract = contracts.find(function (c) {
        return c.id === app.contractId;
      });
      if (!contract) return "";

      // Determine badge class based on status
      var statusClass = "status-applied";
      if (app.status === "Approved") statusClass = "status-approved";
      if (app.status === "Rejected") statusClass = "status-rejected";

      // Check if application has already been decided
      var isDecided = app.status === "Approved" || app.status === "Rejected";

      // Build action buttons based on current status
      var actionButtons = "";
      if (isDecided) {
        actionButtons = '<button class="btn btn-sm btn-primary" disabled>' + app.status + "</button>";
      } else {
        actionButtons =
          '<button class="btn btn-primary btn-sm" onclick="approveApplication(' + app.id + ')">Approve</button>' +
          '<button class="btn btn-danger btn-sm" onclick="rejectApplication(' + app.id + ')">Reject</button>';
      }

      return (
        '<div class="card">' +
          "<h3>" + app.farmerName + "</h3>" +
          '<div class="card-detail"><span class="label">Contract</span><span class="value">' + contract.crop + " (" + contract.quantity + " tons)</span></div>" +
          '<div class="card-detail"><span class="label">Price / Unit</span><span class="value">Rs. ' + contract.pricePerUnit.toLocaleString() + "</span></div>" +
          '<div class="card-detail"><span class="label">Status</span><span class="value"><span class="status-badge ' + statusClass + '">' + app.status + "</span></span></div>" +
          '<div class="card-actions">' + actionButtons + "</div>" +
        "</div>"
      );
    })
    .join("");
}

// Factory approves a farmer's application
function approveApplication(applicationId) {
  var app = applications.find(function (a) {
    return a.id === applicationId;
  });
  if (!app) return;

  // Update status to Approved
  app.status = "Approved";
  saveApplications();

  showToast("Application from " + app.farmerName + " has been approved.");

  // Re-render factory dashboard sections
  renderFactoryContracts();
  renderFactoryApplications();
}

// Factory rejects a farmer's application
function rejectApplication(applicationId) {
  var app = applications.find(function (a) {
    return a.id === applicationId;
  });
  if (!app) return;

  // Update status to Rejected
  app.status = "Rejected";
  saveApplications();

  showToast("Application from " + app.farmerName + " has been rejected.");

  // Re-render factory dashboard sections
  renderFactoryContracts();
  renderFactoryApplications();
}


// ===== CONTRACT CREATION =====
// Handles the factory contract creation form submission
function createContract(event) {
  event.preventDefault();

  // Read form values
  var crop = document.getElementById("cropName").value.trim();
  var quantity = parseInt(document.getElementById("quantity").value);
  var pricePerUnit = parseInt(document.getElementById("pricePerUnit").value);
  var duration = parseInt(document.getElementById("duration").value);
  var description = document.getElementById("description").value.trim();

  // Basic validation
  if (!crop || !quantity || !pricePerUnit || !duration) {
    showToast("Please fill all required fields.");
    return;
  }

  // Create new contract object and add to array
  var newContract = {
    id: nextContractId++,
    crop: crop,
    quantity: quantity,
    pricePerUnit: pricePerUnit,
    duration: duration,
    description: description,
    createdBy: "Your Factory",
  };

  contracts.push(newContract);
  saveContracts();

  // Reset form fields
  document.getElementById("createContractForm").reset();

  showToast("Contract for " + crop + " created successfully.");

  // Re-render the contracts list
  renderFactoryContracts();
}


// ===== INITIALIZATION =====
// Auto-detect which page we are on and render the appropriate content
document.addEventListener("DOMContentLoaded", function () {
  // Check if we are on the farmer dashboard
  if (document.getElementById("farmerContractsList")) {
    renderFarmerContracts();
    renderFarmerApplications();
    updateFarmerStats();
  }

  // Check if we are on the factory dashboard
  if (document.getElementById("factoryContractsList")) {
    renderFactoryContracts();
    renderFactoryApplications();
  }
});
