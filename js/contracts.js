// =============================================
// AGRICONTRACT - Contracts Module (contracts.js)
// =============================================
// Manages contract creation, viewing, application
// submission, duplicate prevention, and status
// updates. All data persisted via localStorage.
// =============================================


// ===== DEFAULT MOCK DATA =====
// Pre-seeded contracts for demonstration
var defaultContracts = [
  {
    id: 1,
    crop: "Wheat",
    quantity: 50,
    pricePerUnit: 2500,
    duration: 6,
    description: "Looking for quality wheat suppliers for our flour mill. Must meet organic standards.",
    createdBy: "Sunrise Foods Pvt. Ltd.",
    createdById: "system",
    status: "OPEN"
  },
  {
    id: 2,
    crop: "Rice",
    quantity: 100,
    pricePerUnit: 3200,
    duration: 8,
    description: "Basmati rice required for export. Premium grade only.",
    createdBy: "Golden Grain Exports",
    createdById: "system",
    status: "OPEN"
  },
  {
    id: 3,
    crop: "Sugarcane",
    quantity: 200,
    pricePerUnit: 350,
    duration: 12,
    description: "Year-long supply contract for our sugar refinery.",
    createdBy: "SweetLife Sugar Mills",
    createdById: "system",
    status: "OPEN"
  },
  {
    id: 4,
    crop: "Cotton",
    quantity: 75,
    pricePerUnit: 6500,
    duration: 10,
    description: "High-quality cotton for textile manufacturing. Competitive pricing guaranteed.",
    createdBy: "FabriCo Textiles",
    createdById: "system",
    status: "OPEN"
  }
];

// Default empty applications array
var defaultApplications = [];


// ===== DATA PERSISTENCE =====

// Load contracts from localStorage or use defaults
function loadContracts() {
  var stored = localStorage.getItem('agricontract_contracts');
  if (stored) {
    return JSON.parse(stored);
  }
  return JSON.parse(JSON.stringify(defaultContracts));
}

// Load applications from localStorage or use defaults
function loadApplications() {
  var stored = localStorage.getItem('agricontract_applications');
  if (stored) {
    return JSON.parse(stored);
  }
  return JSON.parse(JSON.stringify(defaultApplications));
}

// Save contracts to localStorage
function saveContracts() {
  localStorage.setItem('agricontract_contracts', JSON.stringify(contracts));
}

// Save applications to localStorage
function saveApplications() {
  localStorage.setItem('agricontract_applications', JSON.stringify(applications));
}

// Initialize data arrays
var contracts = loadContracts();
var applications = loadApplications();

// Helper to generate unique IDs
function generateUID() {
  return Date.now() + Math.floor(Math.random() * 1000);
}


// ===== CROP CONFIGURATION =====
// Visual configuration for different crop types (images, tag colors, icons)
var cropConfig = {
  "Wheat": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-orange-50", tagText: "text-orange-800", tagRing: "ring-orange-600/20",
    thumbBg: "bg-orange-100",
    icon: "grass", iconBg: "bg-orange-100 dark:bg-orange-900/30", iconText: "text-orange-600 dark:text-orange-400"
  },
  "Rice": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoHNSjgQ8WzMDx2pJL2SBCw79DIZsFuE1VdGXUYQwTf8-AmQLE6OsSdM60hUF7H6BBgYKb7xjxtRbUEdf-cvOgj4cSxjiuLRTjqPL1r1ZGETE4glWWLYz2Utc_mmXxfqcF5-VxYlIj-xpK0p88FAlAKj0IeSwSLHDMhEy7tF32mx0l6m92fXScssvxZAT4MLAU8rIwOezuhGPbSnNT4M0exMiiCWNegKV9i2bVxhU6FyGqxu44NUzqnoa3QEl6MTkXjXIcjqm9KwR",
    tagBg: "bg-green-50", tagText: "text-green-700", tagRing: "ring-green-600/20",
    thumbBg: "bg-green-100",
    icon: "rice_bowl", iconBg: "bg-green-100 dark:bg-green-900/30", iconText: "text-green-600 dark:text-green-400"
  },
  "Sugarcane": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUF4mP_6ZRhDi9pdLEIIB9jjFVcl32xJjUZIqKSqWq5nMW4uCiOVsTs9eBzj8Y9otfEpqjmgQaedf9JNYGpokFjYR42EEPu61-B3_sle6_CJQTQwQ4IL-ts4cVuBOJ7xhuDGwEHD9fT91osfhtU-4anBYjbKlj6EdRngtaMESMU_uIs5NER8ARF2x19R4IqyqSGZvQNMgUlDDi1sUvk_7as9dLE_xqxsvcznOvltutdp_cP5t610lx-jppln_Bph1mzLpAAZ3SH9eq",
    tagBg: "bg-yellow-50", tagText: "text-yellow-800", tagRing: "ring-yellow-600/20",
    thumbBg: "bg-yellow-100",
    icon: "park", iconBg: "bg-yellow-100 dark:bg-yellow-900/30", iconText: "text-yellow-600 dark:text-yellow-400"
  },
  "Cotton": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-purple-50", tagText: "text-purple-700", tagRing: "ring-purple-600/20",
    thumbBg: "bg-purple-100",
    icon: "eco", iconBg: "bg-purple-100 dark:bg-purple-900/30", iconText: "text-purple-600 dark:text-purple-400"
  },
  "Corn": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-amber-50", tagText: "text-amber-700", tagRing: "ring-amber-600/20",
    thumbBg: "bg-amber-100",
    icon: "agriculture", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconText: "text-amber-600 dark:text-amber-400"
  },
  "Soybean": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-lime-50", tagText: "text-lime-700", tagRing: "ring-lime-600/20",
    thumbBg: "bg-lime-100",
    icon: "spa", iconBg: "bg-lime-100 dark:bg-lime-900/30", iconText: "text-lime-600 dark:text-lime-400"
  }
};

// Returns config for a crop, with fallback defaults
function getCropConfig(cropName) {
  if (cropConfig[cropName]) return cropConfig[cropName];
  return {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4u3hnQHIT2ZZDxzfUP2CXGxYISzYHxaWfM7-hMllEUL6AmEAltHUg52BP566do2YwpQoDIPfntQymtZ_9AyhViQSybGvIgcHIptZdkiDk1ddizMIY_lV55vIQUCtIic_RNMXM4MtsCMFQ-ZrbRq1NVElCJyoS25G7ADEhMrOuyPmtuniTTCzyZXGlpPTDvTPgc56cQr_j0FRfEv1iRsYO7SR2Em58Re0SDXH74Q-phyRyADFXCGmQcEjSYTo5i7ZH5n9OdwtoSRx",
    tagBg: "bg-gray-50", tagText: "text-gray-700", tagRing: "ring-gray-600/20",
    thumbBg: "bg-gray-100",
    icon: "grass", iconBg: "bg-gray-100 dark:bg-gray-900/30", iconText: "text-gray-600 dark:text-gray-400"
  };
}


// ===== TOAST NOTIFICATION =====
// Displays a brief message at the bottom-right of the screen
function showToast(message) {
  var existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  var toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;font-family:Inter,sans-serif;z-index:9999;opacity:0;transition:opacity 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:400px;';
  document.body.appendChild(toast);

  setTimeout(function() { toast.style.opacity = '1'; }, 10);
  setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}


// ===== CONTRACT CREATION (Factory Only) =====
// Handles the contract creation form submission
function createContract(event) {
  if (event) event.preventDefault();

  // Verify user is a factory
  var user = getCurrentUser();
  if (!user || user.role !== 'factory') {
    showToast('Only factory users can create contracts.');
    return;
  }

  // Read form values - supports both old and new form layouts
  var cropEl = document.getElementById('cropType') || document.getElementById('cropName');
  var quantityEl = document.getElementById('quantity');
  var priceEl = document.getElementById('pricePerUnit');
  var durationEl = document.getElementById('duration');
  var deliveryDateEl = document.getElementById('deliveryDate');
  var descriptionEl = document.getElementById('description');

  var crop = cropEl ? cropEl.value.trim() : '';
  var quantity = quantityEl ? parseInt(quantityEl.value) : 0;
  var pricePerUnit = priceEl ? parseInt(priceEl.value) : 0;
  var duration = durationEl ? parseInt(durationEl.value) : 0;
  var deliveryDate = deliveryDateEl ? deliveryDateEl.value : '';
  var description = descriptionEl ? descriptionEl.value.trim() : '';

  // Basic validation
  if (!crop || crop === 'Select Crop') {
    showToast('Please select a crop type.');
    return;
  }
  if (!quantity || quantity <= 0) {
    showToast('Please enter a valid quantity.');
    return;
  }
  if (!pricePerUnit || pricePerUnit <= 0) {
    showToast('Please enter a valid price per unit.');
    return;
  }

  // Create new contract object
  var newContract = {
    id: generateUID(),
    crop: crop,
    quantity: quantity,
    pricePerUnit: pricePerUnit,
    duration: duration || 0,
    deliveryDate: deliveryDate || '',
    description: description,
    createdBy: user.name,
    createdById: user.id,
    status: 'OPEN'
  };

  contracts.push(newContract);
  saveContracts();

  // Reset form
  var form = document.getElementById('createContractForm');
  if (form) form.reset();

  showToast('Contract for ' + crop + ' created successfully.');

  // Re-render the factory dashboard
  if (typeof renderFactoryContracts === 'function') renderFactoryContracts();
  if (typeof renderFactoryApplications === 'function') renderFactoryApplications();
  if (typeof updateFactoryStats === 'function') updateFactoryStats();
}


// ===== CONTRACT APPLICATION (Farmer Only) =====
// Handles a farmer applying to a contract
function applyToContract(contractId) {
  // Verify user is a farmer
  var user = getCurrentUser();
  if (!user || user.role !== 'farmer') {
    showToast('Only farmer users can apply to contracts.');
    return;
  }

  // Prevent duplicate applications (same farmer, same contract)
  var alreadyApplied = applications.some(function(app) {
    return app.contractId === contractId && app.farmerId === user.id;
  });
  if (alreadyApplied) {
    showToast('You have already applied to this contract.');
    return;
  }

  // Create application
  applications.push({
    id: generateUID(),
    contractId: contractId,
    farmerId: user.id,
    farmerName: user.name,
    status: 'Applied'
  });

  saveApplications();

  // Update contract status if this is the first application
  var contract = contracts.find(function(c) { return c.id === contractId; });
  if (contract && contract.status === 'OPEN') {
    contract.status = 'APPLIED';
    saveContracts();
  }

  showToast('Application submitted successfully.');

  // Re-render farmer dashboard
  if (typeof renderFarmerContracts === 'function') renderFarmerContracts();
  if (typeof renderFarmerApplications === 'function') renderFarmerApplications();
  if (typeof updateFarmerStats === 'function') updateFarmerStats();
}


// ===== APPLICATION MANAGEMENT (Factory Only) =====

// Factory approves a farmer's application
function approveApplication(applicationId) {
  var user = getCurrentUser();
  if (!user || user.role !== 'factory') {
    showToast('Only factory users can approve applications.');
    return;
  }

  var app = applications.find(function(a) { return a.id === applicationId; });
  if (!app) return;

  app.status = 'Approved';
  
  // Update contract status
  var contract = contracts.find(function(c) { return c.id === app.contractId; });
  if (contract) {
    contract.status = 'APPROVED';
    
    // Auto-rejection logic: Reject all other pending applications for this contract
    applications.forEach(function(otherApp) {
      if (otherApp.contractId === app.contractId && otherApp.id !== app.id && otherApp.status === 'Applied') {
        otherApp.status = 'Rejected';
      }
    });
    
    saveContracts();
  }

  saveApplications();
  showToast('Application from ' + app.farmerName + ' has been approved. Others auto-rejected.');

  // Re-render factory dashboard
  if (typeof renderFactoryContracts === 'function') renderFactoryContracts();
  if (typeof renderFactoryApplications === 'function') renderFactoryApplications();
  if (typeof updateFactoryStats === 'function') updateFactoryStats();
}

// Factory rejects a farmer's application
function rejectApplication(applicationId) {
  var user = getCurrentUser();
  if (!user || user.role !== 'factory') {
    showToast('Only factory users can reject applications.');
    return;
  }

  var app = applications.find(function(a) { return a.id === applicationId; });
  if (!app) return;

  app.status = 'Rejected';
  saveApplications();

  showToast('Application from ' + app.farmerName + ' has been rejected.');

  // Re-render factory dashboard
  if (typeof renderFactoryContracts === 'function') renderFactoryContracts();
  if (typeof renderFactoryApplications === 'function') renderFactoryApplications();
  if (typeof updateFactoryStats === 'function') updateFactoryStats();
}
