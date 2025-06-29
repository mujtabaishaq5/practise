<!-- my current Firebase script  -->
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
  const db = firebase.firestore();

  const auth = firebase.auth();  // Make sure you initialized Firebase Auth already

 window.db = db; // makes db accessible globally


  
  auth.onAuthStateChanged(user => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const italic = document.getElementById('italic');

    if (user) {
      // Show email and logout button
      italic.textContent = `Logged in as: ${user.email}`;
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
    } else {
      // Show login button and message
      italic.textContent = 'Please log in to continue';
      logoutBtn.classList.add('hidden');
      loginBtn.classList.remove('hidden');
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      alert('You are logging out!');
      window.location.href = "login.html"; // Change path if needed
    }).catch((error) => {
      console.error('Logout Error:', error);
      alert('Errors, See console for details.');
    });
  });

document.getElementById('loginBtn').addEventListener('click', () => {
    window.location.href = "login.html"; // Redirect to login page
  });


