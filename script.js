console.log("✅ script.js loaded");
// =======================
// Supabase Config
// =======================
const SUPABASE_URL = 'https://omcaquhsmeqfhxpusawu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2FxdWhzbWVxZmh4cHVzYXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1MjAyODksImV4cCI6MTczMjA1NjI4OX0.L6oLC9ljUQuU9GeEqgiAS9O1ngbQ6cKcx4V9E7pUeZs';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =======================
// Register Logic
// =======================
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const referrer = document.getElementById("register-referrer").value.trim();

  console.log("Attempting to register user:", { username, password, referrer });

  const { data: existingUser, error: checkError } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing user:", checkError.message);
    return alert("Error during registration.");
  }

  if (existingUser) {
    alert("Username already exists.");
    return;
  }

  const { error: signupError } = await supabase.rpc("handle_user_signup", {
    username,
    password,
    referrer: referrer || null,
  });

  if (signupError) {
    console.error("Signup error:", signupError.message);
    return alert("Failed to register.");
  }

  const { data: newUser, error: fetchError } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (fetchError || !newUser) {
    console.error("Error fetching new user after registration:", fetchError?.message);
    return alert("Registration succeeded but login failed.");
  }

  console.log("Registration successful, user data:", newUser);
  localStorage.setItem("user", JSON.stringify(newUser));
  window.location.href = "game.html";
});

// =======================
// Login Logic
// =======================
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  console.log("Attempting login:", { username, password });

  const { data: user, error } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .maybeSingle();

  if (error) {
    console.error("Login error:", error.message);
    return alert("Login failed. Please try again.");
  }

  if (!user) {
    console.warn("User not found or wrong credentials.");
    return alert("Invalid username or password.");
  }

  console.log("Login successful, user data:", user);
  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "game.html";
});
