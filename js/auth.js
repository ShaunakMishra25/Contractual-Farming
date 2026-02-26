// =============================================
// AGRICONTRACT - Authentication Module (auth.js)
// =============================================
// Handles user registration, login, logout,
// session management, and route protection.
// All data stored in localStorage.
// =============================================


// ===== SIMPLE HASH FUNCTION =====
// Basic hash for password storage (NOT cryptographically secure - demo only)
function simpleHash(str) {
  var hash = 0;
  if (str.length === 0) return 'hash_0';
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return 'hash_' + Math.abs(hash).toString(16);
}


// ===== USER STORAGE =====

// Get all registered users from localStorage
function getUsers() {
  var stored = localStorage.getItem('agricontract_users');
  return stored ? JSON.parse(stored) : [];
}

// Save users array to localStorage
function saveUsers(users) {
  localStorage.setItem('agricontract_users', JSON.stringify(users));
}

// Find a user by email
function findUserByEmail(email) {
  var users = getUsers();
  return users.find(function(u) {
    return u.email.toLowerCase() === email.toLowerCase().trim();
  }) || null;
}


// ===== SESSION MANAGEMENT =====

// Get the currently logged-in user from localStorage
function getCurrentUser() {
  var stored = localStorage.getItem('agricontract_currentUser');
  return stored ? JSON.parse(stored) : null;
}

// Store current user session (without password)
function setCurrentUser(user) {
  var session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  localStorage.setItem('agricontract_currentUser', JSON.stringify(session));
}

// Check if a user is currently logged in
function isLoggedIn() {
  return getCurrentUser() !== null;
}


// ===== REGISTRATION =====
// Register a new user with name, email, password, and role
function registerUser(name, email, password, role) {
  // Validate inputs
  if (!name || !email || !password || !role) {
    return { success: false, message: 'All fields are required.' };
  }

  // Validate email format
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // Validate password length
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }

  // Validate role
  if (role !== 'farmer' && role !== 'factory') {
    return { success: false, message: 'Please select a valid role.' };
  }

  // Check for duplicate email
  if (findUserByEmail(email)) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  // Create new user object
  var newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: simpleHash(password),
    role: role,
    createdAt: new Date().toISOString()
  };

  // Save to users array
  var users = getUsers();
  users.push(newUser);
  saveUsers(users);

  return { success: true, user: newUser };
}


// ===== LOGIN =====
// Authenticate user with email and password
function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Please enter both email and password.' };
  }

  var users = getUsers();
  var hashedPassword = simpleHash(password);

  var user = users.find(function(u) {
    return u.email.toLowerCase() === email.toLowerCase().trim() && u.password === hashedPassword;
  });

  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  // Set session
  setCurrentUser(user);
  return { success: true, user: user };
}


// ===== LOGOUT =====
// Clear the current session and redirect to login page
function logoutUser() {
  localStorage.removeItem('agricontract_currentUser');
  window.location.href = 'login.html';
}


// ===== ROUTE PROTECTION =====
// Require authentication and optionally a specific role.
// Returns the current user if authorized, or redirects away.
function requireAuth(requiredRole) {
  var user = getCurrentUser();

  // Not logged in -> redirect to login
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }

  // Wrong role -> redirect to correct dashboard
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'farmer') {
      window.location.href = 'farmer.html';
    } else if (user.role === 'factory') {
      window.location.href = 'factory.html';
    } else {
      window.location.href = 'login.html';
    }
    return null;
  }

  return user;
}
