// Supabase Config
const SUPABASE_URL = 'https://omcaquhsmeqfhxpusawu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for safety
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const usernameDisplay = document.getElementById('username-display');
const coinsDisplay = document.getElementById('coins-display');
const cashInBtn = document.getElementById('cash-in');
const cashOutBtn = document.getElementById('cash-out');
const spaceship = document.getElementById('spaceship');
const resultText = document.getElementById('result');

// State
let currentUser = null;
let crashMultiplier = 1.0;
let isPlaying = false;
let gameInterval = null;

// ---------------- LOGIN ----------------
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  const { data, error } = await client
    .from('skyburst_users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (data) {
    currentUser = data;
    updateUI();
  } else {
    alert('Login failed!');
  }
});

// ---------------- SIGNUP + REFERRAL ----------------
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = signupForm.username.value;
  const password = signupForm.password.value;
  const referrer = signupForm.referrer.value || null;

  const { error } = await client.rpc('handle_user_signup', {
    username,
    password,
    referrer,
  });

  if (!error) {
    alert('Signup successful!');
  } else {
    console.error(error);
    alert('Signup failed.');
  }
});

// ---------------- CASH IN ----------------
cashInBtn?.addEventListener('click', async () => {
  if (!currentUser) return alert('Please login');
  if (isPlaying) return;

  isPlaying = true;
  crashMultiplier = 1.0;
  resultText.textContent = 'Flying... 🚀';

  animateShipStart();

  gameInterval = setInterval(() => {
    crashMultiplier += 0.1;
    resultText.textContent = ${crashMultiplier.toFixed(2)}x;

    if (Math.random() < 0.03) {
      endGame(false);
    }
  }, 500);
});

// ---------------- CASH OUT ----------------
cashOutBtn?.addEventListener('click', async () => {
  if (!currentUser || !isPlaying) return;

  clearInterval(gameInterval);
  resultText.textContent = You cashed out at ${crashMultiplier.toFixed(2)}x! 🎉;

  const newBalance = currentUser.coins + Math.floor(crashMultiplier * 10);
  await client
    .from('skyburst_users')
    .update({ coins: newBalance, has_played: true })
    .eq('id', currentUser.id);

  currentUser.coins = newBalance;
  updateUI();
  isPlaying = false;

  animateShipReset();
});

// ---------------- GAME ENDS ----------------
function endGame(crashed) {
  clearInterval(gameInterval);
  resultText.textContent = 'Crashed 💥';
  isPlaying = false;

  animateShipCrash();
}

// ---------------- UI UPDATE ----------------
function updateUI() {
  usernameDisplay.textContent = currentUser.username;
  coinsDisplay.textContent = Coins: ${currentUser.coins};
}

// ---------------- ANIMATIONS ----------------
function animateShipStart() {
  spaceship.classList.remove('crashed');
  spaceship.classList.add('flying');
}

function animateShipCrash() {
  spaceship.classList.remove('flying');
  spaceship.classList.add('crashed');
}

function animateShipReset() {
  spaceship.classList.remove('flying', 'crashed');
}
