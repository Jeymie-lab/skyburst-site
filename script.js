// Supabase config
const SUPABASE_URL = "https://omcaquhsmeqfhxpusawu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2FxdWhzbWVxZmh4cHVzYXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTE2ODIsImV4cCI6MjA2ODc4NzY4Mn0.efl5MQ-lbY6kkeMujJQ8NDTLdc_7r_bkTj_AZzwcj4Y";
const table = "website_users";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;

// Register or Log In
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  // Check if user exists
  const { data: users, error } = await supabase
    .from(table)
    .select("*")
    .eq("phone", phone)
    .limit(1);

  if (error) {
    alert("Error checking user");
    return;
  }

  if (users.length > 0) {
    // Existing user login
    if (users[0].password === password) {
      currentUser = users[0];
      showDashboard();
    } else {
      alert("Incorrect password");
    }
  } else {
    // Register new user
    const { data, error } = await supabase
      .from(table)
      .insert([{ username, phone, password, coins: 0 }])
      .select();

    if (error) {
      alert("Error creating account");
      return;
    }

    currentUser = data[0];
    showDashboard();
  }
});

function showDashboard() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("userDisplay").textContent = currentUser.username;
  document.getElementById("coinBalance").textContent = currentUser.coins;
}

// Game Logic
async function simulateGame() {
  const win = Math.random() < 0.5;
  const gameResult = document.getElementById("gameResult");

  if (win) {
    gameResult.textContent = "You Won! +10 coins";
    currentUser.coins += 10;

    await supabase
      .from(table)
      .update({ coins: currentUser.coins })
      .eq("id", currentUser.id);

    document.getElementById("coinBalance").textContent = currentUser.coins;
  } else {
    gameResult.textContent = "You Lost!";
  }
}

function playGame() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}

function rechargeAccount() {
  alert("Please send M-PESA to 0797416633, then WhatsApp for verification.");
}

function requestWithdrawal() {
  alert("Withdrawal request sent. Admin will process it manually.");
}