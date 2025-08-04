console.log("✅ script.js loaded");

const supabase = supabase.createClient(
  'https://omcaquhsmeqfhxpusawu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2FxdWhzbWVxZmh4cHVzYXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTE2ODIsImV4cCI6MjA2ODc4NzY4Mn0.efl5MQ-lbY6kkeMujJQ8NDTLdc_7r_bkTj_AZzwcj4Y'
);

// === Login ===
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const { data, error } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    alert("Invalid username or password.");
    console.error(error);
  } else {
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "game.html";
  }
});

// === Registration ===
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const referrer = document.getElementById("register-referrer").value;

  const { data: existingUser } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return alert("Username already exists!");
  }

  const { error } = await supabase.rpc("handle_user_signup", {
    username,
    password,
    referrer: referrer || null,
  });

  if (error) {
    console.error("Error during signup:", error);
    return alert("Registration failed.");
  }

  // Auto-login after registration
  const { data: newUser } = await supabase
    .from("skyburst_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (newUser) {
    localStorage.setItem("user", JSON.stringify(newUser));
    window.location.href = "game.html";
  }
});
