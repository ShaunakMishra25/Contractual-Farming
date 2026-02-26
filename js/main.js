// =============================================
// AGRICONTRACT - Main Module (main.js)
// =============================================


// ===== SECURITY UTILITIES =====

// Escapes special characters for HTML to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


// ===== FARMER DASHBOARD FUNCTIONS =====

// Updates the stat cards on the farmer dashboard
function updateFarmerStats() {
  var statActive = document.getElementById('statActiveContracts');
  var statPending = document.getElementById('statPendingApps');
  var statAvailable = document.getElementById('statAvailableContracts');
  if (!statActive) return;

  var user = getCurrentUser();
  if (!user) return;

  // Get this farmer's applications
  var myApplications = applications.filter(function(app) {
    return app.farmerId === user.id;
  });

  var myAppliedContractIds = myApplications.map(function(app) {
    return app.contractId;
  });

  var availableCount = contracts.filter(function(c) {
    return myAppliedContractIds.indexOf(c.id) === -1;
  }).length;

  var pendingCount = myApplications.filter(function(a) {
    return a.status === 'Applied';
  }).length;

  var activeCount = myApplications.filter(function(a) {
    return a.status === 'Approved';
  }).length;

  statActive.textContent = activeCount;
  statPending.textContent = pendingCount;
  statAvailable.textContent = availableCount;
}

// Renders the list of available contracts for the farmer (Tailwind cards)
function renderFarmerContracts() {
  var container = document.getElementById('farmerContractsList');
  var emptyState = document.getElementById('farmerEmptyContracts');
  if (!container || !emptyState) return;

  var user = getCurrentUser();
  if (!user) return;

  // Get this farmer's applied contract IDs
  var myAppliedContractIds = applications
    .filter(function(app) { return app.farmerId === user.id; })
    .map(function(app) { return app.contractId; });

  // Show only contracts the farmer hasn't applied to yet
  var availableContracts = contracts.filter(function(contract) {
    return myAppliedContractIds.indexOf(contract.id) === -1;
  });

  if (availableContracts.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = availableContracts.map(function(contract) {
    var config = getCropConfig(contract.crop);
    return (
      '<div class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md border border-gray-100">' +
        '<div class="h-48 w-full bg-cover bg-center" style="background-image: url(\'' + config.image + '\');"></div>' +
        '<div class="flex flex-1 flex-col p-5">' +
          '<div class="mb-4">' +
            '<div class="flex items-center gap-2 mb-1">' +
              '<span class="inline-flex items-center rounded-md ' + config.tagBg + ' px-2 py-1 text-xs font-medium ' + config.tagText + ' ring-1 ring-inset ' + config.tagRing + '">' + escapeHTML(contract.crop) + '</span>' +
            '</div>' +
            '<h3 class="text-lg font-bold text-gray-900">' + escapeHTML(contract.crop) + ' Contract</h3>' +
            '<p class="text-sm text-gray-500">' + escapeHTML(contract.createdBy) + '</p>' +
          '</div>' +
          (contract.description ? '<p class="text-sm text-gray-600 mb-3">' + escapeHTML(contract.description) + '</p>' : '') +
          '<div class="mt-auto space-y-3">' +
            '<div class="flex items-center justify-between border-t border-gray-100 pt-3">' +
              '<span class="text-sm text-gray-500">Quantity</span>' +
              '<span class="font-semibold text-gray-900">' + parseInt(contract.quantity) + ' tons</span>' +
            '</div>' +
            '<div class="flex items-center justify-between">' +
              '<span class="text-sm text-gray-500">Price / Unit</span>' +
              '<span class="font-semibold text-gray-900">Rs. ' + parseInt(contract.pricePerUnit).toLocaleString() + '</span>' +
            '</div>' +
            '<div class="flex items-center justify-between">' +
              '<span class="text-sm text-gray-500">Duration</span>' +
              '<span class="font-semibold text-gray-900">' + (contract.duration ? parseInt(contract.duration) + ' Months' : escapeHTML(contract.deliveryDate || 'N/A')) + '</span>' +
            '</div>' +
            '<button onclick="applyToContract(' + contract.id + ')" class="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mt-2 transition-colors">' +
              'Apply Now' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// Renders the farmer's submitted applications as table rows (Tailwind table)
function renderFarmerApplications() {
  var container = document.getElementById('farmerApplicationsList');
  var emptyState = document.getElementById('farmerEmptyApplications');
  var tableWrapper = document.getElementById('farmerApplicationsTable');
  if (!container || !emptyState) return;

  var user = getCurrentUser();
  if (!user) return;

  // Filter to only this farmer's applications
  var myApplications = applications.filter(function(app) {
    return app.farmerId === user.id;
  });

  if (myApplications.length === 0) {
    container.innerHTML = '';
    if (tableWrapper) tableWrapper.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  if (tableWrapper) tableWrapper.style.display = 'block';

  container.innerHTML = myApplications.map(function(app) {
    var contract = contracts.find(function(c) { return c.id === app.contractId; });
    if (!contract) return '';

    var config = getCropConfig(contract.crop);

    // Determine status badge styles
    var statusBadge = '';
    if (app.status === 'Approved') {
      statusBadge = '<span class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Approved</span>';
    } else if (app.status === 'Rejected') {
      statusBadge = '<span class="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Rejected</span>';
    } else {
      statusBadge = '<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Under Review</span>';
    }

    return (
      '<tr>' +
        '<td class="whitespace-nowrap px-6 py-4">' +
          '<div class="flex items-center gap-3">' +
            '<div class="h-10 w-10 rounded-lg bg-cover bg-center ' + config.thumbBg + '" style="background-image: url(\'' + config.image + '\');"></div>' +
            '<span class="text-sm font-medium text-gray-900">' + escapeHTML(contract.crop) + '</span>' +
          '</div>' +
        '</td>' +
        '<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">' + escapeHTML(contract.createdBy) + '</td>' +
        '<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">' + parseInt(contract.quantity) + ' tons</td>' +
        '<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Rs. ' + parseInt(contract.pricePerUnit).toLocaleString() + '</td>' +
        '<td class="whitespace-nowrap px-6 py-4">' + statusBadge + '</td>' +
      '</tr>'
    );
  }).join('');
}


// ===== FACTORY DASHBOARD FUNCTIONS =====

// Updates the stat cards on the factory dashboard
function updateFactoryStats() {
  var statTotal = document.getElementById('statTotalContracts');
  var statActive = document.getElementById('statActiveHarvests');
  var statPending = document.getElementById('statPendingApprovals');
  var statPayout = document.getElementById('statMonthlyPayout');
  if (!statTotal) return;

  var user = getCurrentUser();
  if (!user) return;

  // Get ONLY this factory's contracts (strict isolation)
  var myContracts = contracts.filter(function(c) {
    return c.createdById === user.id;
  });

  var myContractIds = myContracts.map(function(c) { return c.id; });

  // Get applications for this factory's contracts
  var myApps = applications.filter(function(app) {
    return myContractIds.indexOf(app.contractId) !== -1;
  });

  var totalContracts = myContracts.length;
  var activeHarvests = myApps.filter(function(a) { return a.status === 'Approved'; }).length;
  var pendingApprovals = myApps.filter(function(a) { return a.status === 'Applied'; }).length;

  // Calculate total contract value
  var totalValue = 0;
  myContracts.forEach(function(c) {
    totalValue += c.quantity * c.pricePerUnit;
  });

  statTotal.textContent = totalContracts;
  if (statActive) statActive.textContent = activeHarvests;
  if (statPending) statPending.textContent = pendingApprovals;
  if (statPayout) {
    if (totalValue >= 1000000) {
      statPayout.textContent = 'Rs. ' + (totalValue / 1000000).toFixed(1) + 'M';
    } else if (totalValue >= 1000) {
      statPayout.textContent = 'Rs. ' + (totalValue / 1000).toFixed(0) + 'k';
    } else {
      statPayout.textContent = 'Rs. ' + totalValue;
    }
  }

  // Update pending count badge
  var pendingBadge = document.getElementById('factoryPendingCount');
  if (pendingBadge) {
    pendingBadge.textContent = pendingApprovals + ' Pending';
  }
}

// Renders the factory's contracts list (Tailwind cards matching factory.html style)
function renderFactoryContracts() {
  var container = document.getElementById('factoryContractsList');
  if (!container) return;

  var user = getCurrentUser();
  if (!user) return;

  // Get ONLY this factory's contracts
  var myContracts = contracts.filter(function(c) {
    return c.createdById === user.id;
  });

  if (myContracts.length === 0) {
    container.innerHTML = '<p class="text-center text-slate-500 py-8">No contracts created yet. Use the form above to create your first contract.</p>';
    return;
  }

  container.innerHTML = myContracts.map(function(contract) {
    var config = getCropConfig(contract.crop);

    // Count applications for this contract
    var appCount = applications.filter(function(app) {
      return app.contractId === contract.id;
    }).length;

    var approvedCount = applications.filter(function(app) {
      return app.contractId === contract.id && app.status === 'Approved';
    }).length;

    // Status badge
    var statusBadge = '';
    if (contract.status === 'APPROVED' || approvedCount > 0) {
      statusBadge = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Active</span>';
    } else if (contract.status === 'APPLIED' || appCount > 0) {
      statusBadge = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Has Applicants</span>';
    } else {
      statusBadge = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Open</span>';
    }

    return (
      '<div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">' +
        '<div class="flex items-start justify-between">' +
          '<div class="flex gap-4">' +
            '<div class="w-12 h-12 rounded-lg ' + config.iconBg + ' flex items-center justify-center ' + config.iconText + ' shrink-0">' +
              '<span class="material-symbols-outlined">' + config.icon + '</span>' +
            '</div>' +
            '<div>' +
              '<h4 class="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">' + escapeHTML(contract.crop) + ' Contract</h4>' +
              '<div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">' +
                '<span>#CNT-' + escapeHTML(contract.id.toString()) + '</span>' +
                '<span class="w-1 h-1 rounded-full bg-slate-300"></span>' +
                '<span>' + parseInt(contract.quantity) + ' Tons</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          statusBadge +
        '</div>' +
        '<div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">' +
          '<div class="flex items-center gap-6">' +
            '<div class="flex flex-col">' +
              '<span class="text-xs text-slate-400 font-medium uppercase tracking-wide">Price/Unit</span>' +
              '<span class="font-semibold text-slate-700 dark:text-slate-300">Rs. ' + parseInt(contract.pricePerUnit).toLocaleString() + '</span>' +
            '</div>' +
            '<div class="flex flex-col">' +
              '<span class="text-xs text-slate-400 font-medium uppercase tracking-wide">Applications</span>' +
              '<span class="font-semibold text-slate-700 dark:text-slate-300">' + appCount + ' received</span>' +
            '</div>' +
            (contract.deliveryDate ? '<div class="flex flex-col"><span class="text-xs text-slate-400 font-medium uppercase tracking-wide">Deadline</span><span class="font-semibold text-slate-700 dark:text-slate-300">' + escapeHTML(contract.deliveryDate) + '</span></div>' : '') +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// Renders farmer applications for factory review
function renderFactoryApplications() {
  var container = document.getElementById('factoryApplicationsList');
  if (!container) return;

  var user = getCurrentUser();
  if (!user) return;

  // Get ONLY this factory's contract IDs
  var myContractIds = contracts
    .filter(function(c) { return c.createdById === user.id; })
    .map(function(c) { return c.id; });

  // Get applications for this factory's contracts
  var myApps = applications.filter(function(app) {
    return myContractIds.indexOf(app.contractId) !== -1;
  });

  if (myApps.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-slate-500 text-sm">No applications received yet.</div>';
    return;
  }

  container.innerHTML = myApps.map(function(app) {
    var contract = contracts.find(function(c) { return c.id === app.contractId; });
    if (!contract) return '';

    // Get initials for avatar
    var initials = app.farmerName.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase();

    // Determine status badge
    var statusBadge = '';
    if (app.status === 'Approved') {
      statusBadge = '<span class="text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">Approved</span>';
    } else if (app.status === 'Rejected') {
      statusBadge = '<span class="text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">Rejected</span>';
    } else {
      statusBadge = '<span class="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">Pending</span>';
    }

    // Action buttons
    var actionButtons = '';
    if (app.status === 'Applied') {
      actionButtons =
        '<button onclick="rejectApplication(' + app.id + ')" class="flex-1 bg-white dark:bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 transition-colors">Reject</button>' +
        '<button onclick="approveApplication(' + app.id + ')" class="flex-1 bg-primary text-white text-xs font-semibold py-2 rounded hover:bg-green-600 transition-colors shadow-sm shadow-primary/20">Approve</button>';
    } else {
      actionButtons = '<button disabled class="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold py-2 rounded cursor-not-allowed">' + app.status + '</button>';
    }

    return (
      '<div class="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">' +
        '<div class="flex items-start gap-3">' +
          '<div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">' + initials + '</div>' +
          '<div class="flex-1 min-w-0">' +
            '<p class="text-sm font-bold text-slate-900 dark:text-white truncate">' + escapeHTML(app.farmerName) + '</p>' +
            '<p class="text-xs text-slate-500 truncate">Applying for: ' + escapeHTML(contract.crop) + ' Contract #' + escapeHTML(contract.id.toString()) + '</p>' +
            '<div class="flex items-center gap-2 mt-1">' + statusBadge + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="flex gap-2 mt-4">' + actionButtons + '</div>' +
      '</div>'
    );
  }).join('');
}


// ===== INITIALIZATION =====
// Auto-detect which page we are on and render appropriate content
document.addEventListener('DOMContentLoaded', function() {

  // --- Farmer Dashboard ---
  if (document.getElementById('farmerContractsList')) {
    var farmerUser = requireAuth('farmer');
    if (!farmerUser) return; // Redirect will happen

    // Display user name in sidebar and welcome message
    var sidebarName = document.getElementById('sidebarUserName');
    var sidebarRole = document.getElementById('sidebarUserRole');
    var welcomeName = document.getElementById('welcomeUserName');

    if (sidebarName) sidebarName.textContent = farmerUser.name;
    if (sidebarRole) sidebarRole.textContent = 'Farmer';
    if (welcomeName) welcomeName.textContent = farmerUser.name.split(' ')[0];

    // Render dashboard content
    renderFarmerContracts();
    renderFarmerApplications();
    updateFarmerStats();
  }

  // --- Factory Dashboard ---
  if (document.getElementById('factoryContractsList')) {
    var factoryUser = requireAuth('factory');
    if (!factoryUser) return; // Redirect will happen

    // Display user name in sidebar and welcome message
    var fSidebarName = document.getElementById('sidebarUserName');
    var fSidebarRole = document.getElementById('sidebarUserRole');
    var fWelcomeName = document.getElementById('welcomeUserName');

    if (fSidebarName) fSidebarName.textContent = factoryUser.name;
    if (fSidebarRole) fSidebarRole.textContent = 'Factory Admin';
    if (fWelcomeName) fWelcomeName.textContent = factoryUser.name.split(' ')[0];

    // Set minimum delivery date to today
    var deliveryInput = document.getElementById('deliveryDate');
    if (deliveryInput) {
      deliveryInput.min = new Date().toISOString().split('T')[0];
    }

    // Render dashboard content
    renderFactoryContracts();
    renderFactoryApplications();
    updateFactoryStats();
  }

  // --- Login Page ---
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // If already logged in, redirect to dashboard
    if (isLoggedIn()) {
      var currentUser = getCurrentUser();
      window.location.href = currentUser.role === 'farmer' ? 'farmer.html' : 'factory.html';
      return;
    }

    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var email = document.getElementById('loginEmail').value.trim();
      var password = document.getElementById('loginPassword').value;
      var errorEl = document.getElementById('loginError');

      // Clear previous error
      if (errorEl) errorEl.textContent = '';

      var result = loginUser(email, password);

      if (result.success) {
        // Redirect based on role
        if (result.user.role === 'farmer') {
          window.location.href = 'farmer.html';
        } else {
          window.location.href = 'factory.html';
        }
      } else {
        if (errorEl) errorEl.textContent = result.message;
      }
    });
  }

  // --- Register Page ---
  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    // If already logged in, redirect to dashboard
    if (isLoggedIn()) {
      var currentUser = getCurrentUser();
      window.location.href = currentUser.role === 'farmer' ? 'farmer.html' : 'factory.html';
      return;
    }

    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = document.getElementById('registerName').value.trim();
      var email = document.getElementById('registerEmail').value.trim();
      var password = document.getElementById('registerPassword').value;
      var confirmPassword = document.getElementById('registerConfirmPassword').value;
      var role = document.getElementById('registerRole').value;
      var errorEl = document.getElementById('registerError');

      // Clear previous error
      if (errorEl) errorEl.textContent = '';

      // Validate confirm password
      if (password !== confirmPassword) {
        if (errorEl) errorEl.textContent = 'Passwords do not match.';
        return;
      }

      var result = registerUser(name, email, password, role);

      if (result.success) {
        // Auto-login after registration
        setCurrentUser(result.user);
        // Redirect based on role
        if (result.user.role === 'farmer') {
          window.location.href = 'farmer.html';
        } else {
          window.location.href = 'factory.html';
        }
      } else {
        if (errorEl) errorEl.textContent = result.message;
      }
    });
  }

  // --- Landing Page (index.html) ---
  // Update nav links based on auth state
  var navAuthBtn1 = document.getElementById('navAuthBtn1');
  var navAuthBtn2 = document.getElementById('navAuthBtn2');
  var mobileAuthBtn1 = document.getElementById('mobileAuthBtn1');
  var mobileAuthBtn2 = document.getElementById('mobileAuthBtn2');
  var heroBtn1 = document.getElementById('heroBtn1');
  var heroBtn2 = document.getElementById('heroBtn2');
  var ctaBtn1 = document.getElementById('ctaBtn1');
  var ctaBtn2 = document.getElementById('ctaBtn2');

  if (navAuthBtn1 && isLoggedIn()) {
    var landingUser = getCurrentUser();
    var dashboardUrl = landingUser.role === 'farmer' ? 'farmer.html' : 'factory.html';

    // Update desktop nav
    navAuthBtn1.href = dashboardUrl;
    navAuthBtn1.textContent = 'Dashboard';
    navAuthBtn2.href = '#';
    navAuthBtn2.textContent = 'Logout';
    navAuthBtn2.addEventListener('click', function(e) { e.preventDefault(); logoutUser(); });

    // Update mobile nav
    if (mobileAuthBtn1) {
      mobileAuthBtn1.href = dashboardUrl;
      mobileAuthBtn1.textContent = 'Dashboard';
    }
    if (mobileAuthBtn2) {
      mobileAuthBtn2.href = '#';
      mobileAuthBtn2.textContent = 'Logout';
      mobileAuthBtn2.addEventListener('click', function(e) { e.preventDefault(); logoutUser(); });
    }

    // Update hero CTA buttons
    if (heroBtn1) {
      heroBtn1.href = dashboardUrl;
      heroBtn1.textContent = 'Go to Dashboard';
    }
    if (heroBtn2) {
      heroBtn2.href = dashboardUrl;
      heroBtn2.textContent = 'View Contracts';
    }

    // Update bottom CTA buttons
    if (ctaBtn1) {
      ctaBtn1.href = dashboardUrl;
      ctaBtn1.textContent = 'Go to Dashboard';
    }
    if (ctaBtn2) {
      ctaBtn2.href = dashboardUrl;
      ctaBtn2.textContent = 'View Contracts';
    }
  }
});
