console.log("🔥 script.js loaded");

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Supabase Credentials
const supabaseUrl = "https://omcaquhsmeqfhxpusawu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2FxdWhzbWVxZmh4cHVzYXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTE2ODIsImV4cCI6MjA2ODc4NzY4Mn0.efl5MQ-lbY6kkeMujJQ8NDTLdc_7r_bkTj_AZzwcj4Y";
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Login Logic
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("👉 Login submitted");

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const { data, error } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    console.error("Login failed:", error?.message);
    alert("Login failed!");
  } else {
    console.log("✅ Login success:", data);
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "game.html";
  }
});

// ✅ Register Logic
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("👉 Register submitted");

  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const referrer = document.getElementById("register-referrer").value.trim();

  // Check if username already exists
  const { data: existingUser, error: checkError } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (checkError) {
    console.error("❌ Error checking existing user:", checkError.message);
    return alert("Error during registration.");
  }

  if (existingUser) {
    alert("Username already exists.");
    return;
  }

  // Call stored procedure for registration
  const { error: signupError } = await supabase.rpc("handle_user_signup", {
    username,
    password,
    referrer: referrer || null,
  });

  if (signupError) {
    console.error("❌ Signup error:", signupError.message);
    return alert("Failed to register.");
  }

  // Fetch the new user to login them in
  const { data: newUser, error: loginError } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (loginError || !newUser) {
    console.error("❌ Post-register login failed:", loginError?.message);
    return alert("Registration succeeded but login failed.");
  }

  console.log("✅ Registration and login success:", newUser);
  localStorage.setItem("user", JSON.stringify(newUser));
  window.location.href = "game.html";
});
