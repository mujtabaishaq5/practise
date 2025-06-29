

      // <!-- Replace your current Firebase script with this -->
      function showToast(message, type = "success") {
  const toast = document.getElementById("toastMessage");
  toast.textContent = message;

  // Reset and apply base style
  toast.className = "fixed top-5 right-5 px-4 py-3 rounded shadow-lg text-white text-sm z-50";

  // Add color based on type
  if (type === "success") {
    toast.classList.add("bg-green-400");
  } else if (type === "error") {
    toast.classList.add("bg-red-500");
  }

  toast.classList.remove("hidden");

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

     
  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDq_q5Ksj4ZRvmAdbz217wjOUw3YbUZFXA",
    authDomain: "practise-f5da6.firebaseapp.com",
    projectId: "practise-f5da6",
    storageBucket: "practise-f5da6.appspot.com",
    messagingSenderId: "583890704681",
    appId: "1:583890704681:web:2ce3a211215a23b96ebf38",
    measurementId: "G-GVNT25CC4N"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
 // const db = firebase.firestore();

  const auth = firebase.auth();
     // Show/hide password toggle
    document.getElementById("togglePassword").addEventListener("change", function () {
      const passwordField = document.getElementById("password");
      passwordField.type = this.checked ? "text" : "password";
    });
   

    document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showToast("Please enter both email and password.", "error");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Show success message
      document.getElementById("successMessage").classList.remove("hidden");

      // Optionally redirect after a delay
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    })
    .catch((error) => {
      showToast("Error: " + error.message, "error");
    });
});


    

