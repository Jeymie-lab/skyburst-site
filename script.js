// Supabase credentials
const supabaseUrl = "https://omcaquhsmeqfhxpusawu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
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
        alert("Login failed. Check your credentials.");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "game.html";
      }
    });
  }

  // Handle Signup
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("signup-username").value;
      const password = document.getElementById("signup-password").value;
      const referrer = document.getElementById("signup-referrer").value || null;

      const { error } = await supabase.rpc("handle_user_signup", {
        username,
        password,
        referrer,
      });

      if (error) {
        alert("Signup failed. That username may already exist.");
      } else {
        alert("Signup successful. You can now log in.");
        window.location.reload();
      }
    });
  }
});
