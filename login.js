
    // Initialize Firebase (copy your config)
    const firebaseConfig = {
      apiKey: "AIzaSyDq_q5Ksj4ZRvmAdbz217wjOUw3YbUZFXA",
      authDomain: "practise-f5da6.firebaseapp.com",
      projectId: "practise-f5da6",
      storageBucket: "practise-f5da6.appspot.com",
      messagingSenderId: "583890704681",
      appId: "1:583890704681:web:2ce3a211215a23b96ebf38",
      measurementId: "G-GVNT25CC4N"
    };

    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    
function showToast(message, type = "success") {
  const toast = document.getElementById("toastMessage");
  toast.textContent = message;

  // Set styles based on type
  toast.className = "fixed top-5 right-5 px-4 py-3 rounded shadow-lg text-white text-sm z-50";
  if (type === "success") {
    toast.classList.add("bg-green-500");
  } else if (type === "error") {
    toast.classList.add("bg-red-500");
  }

  toast.classList.remove("hidden");

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}
// Password toggle
document.getElementById("togglePassword").addEventListener("change", function () {
  const passwordField = document.getElementById("password");
  passwordField.type = this.checked ? "text" : "password";
});

// Email/password login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showToast("Please enter both email and password.", "error");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => window.location.href = "main.html", 1000);
    })
    .catch((error) => {
      showToast("Login error: " + error.message, "error");
    });
});

// Google login
document.getElementById("googleLoginBtn").addEventListener("click", function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      showToast(`Welcome, ${result.user.displayName}!`, "success");
      setTimeout(() => window.location.href = "main.html", 1000);
    })
    .catch((error) => {
      showToast("Google Login Error: " + error.message, "error");
    });
});






