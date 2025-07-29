// ✅ Your actual Supabase credentials
const SUPABASE_URL = "https://xbofjvlzrcspmqszbtov.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhib2Zqdmx6cmNzcG1xc3pidG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0OTI4NzUsImV4cCI6MjAzMjA2ODg3NX0.GU0bxlSfqR3nrpVnR_65XkzGhw_5e5fpGniHP_3TuWw";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("📦 Script loaded...");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// 🔐 LOGIN
if (loginForm) {
  console.log("🔐 Login form found");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🚀 Login form submitted");

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    console.log("🧑 Username:", username);
    console.log("🔑 Password:", password);

    const { data, error } = await supabase
      .from("skyburst_users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      console.log("❌ Login failed", error);
      alert("Login failed! Check your credentials.");
    } else {
      console.log("✅ Login successful", data);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "game.html";
    }
  });
}

// 🆕 SIGNUP
if (signupForm) {
  console.log("🆕 Signup form found");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🚀 Signup form submitted");

    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const referrer = document.getElementById("signup-referrer").value;

    console.log("🧑 Username:", username);
    console.log("🔑 Password:", password);
    console.log("🧭 Referrer:", referrer);

    const { error } = await supabase.rpc("handle_user_signup", {
      username,
      password,
      referrer: referrer || null,
    });

    if (error) {
      console.log("❌ Signup error", error);
      alert("Signup failed. Try again.");
    } else {
      console.log("✅ Signup success");
      alert("Signup successful! You can now log in.");
    }
  });
}
