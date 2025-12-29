document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const registerModal = document.getElementById("registerModal");
  const showRegister = document.getElementById("showRegister");
  const closeRegisterModal = document.getElementById("closeRegisterModal");

  const demoStudentBtn = document.getElementById("demoStudentBtn");
  const demoTeacherBtn = document.getElementById("demoTeacherBtn");

  // Demo credentials
  const DEMO_STUDENT = { username: "testuser", password: "testuser" };
  const DEMO_TEACHER = { username: "TestTeach2", password: "TestTeach2" };

  // Toast function
  function toast(type, title, message, ms = 2600) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    // Create toast element
    const el = document.createElement("div");
    el.className = `toast ${type}`;

    // Toast content
    el.innerHTML = `
      <div>
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">×</button>
    `;

    // Close button
    const closeBtn = el.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => el.remove());

    container.appendChild(el);

    setTimeout(() => {
      if (el && el.parentNode) el.remove();
    }, ms);
  }

  // Register modal functions
  function openRegister() {
    registerModal.style.display = "block";
  }

  // Close register modal
  function closeRegister() {
    registerModal.style.display = "none";
  }

  // Show register modal
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    openRegister();
  });

  // Close register modal on outside click
  window.addEventListener("click", (event) => {
    if (event.target === registerModal) closeRegister();
  });

  closeRegisterModal.addEventListener("click", closeRegister);

  // Login function
  async function doLogin(username, password) {
    try {
      const res = await fetch(
        `https://course-manager-backend-updated-2026.onrender.com/api/auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      // Handle response      
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data._id);

        toast("success", "Logged in", `Welcome, ${data.username}!`);
        setTimeout(() => (window.location.href = "index.html"), 350);
        return;
      }
      
      toast(
        "error",
        "Login failed",
        data.error || data.message || "Invalid username or password."
      );
    } catch (error) {
      console.error("Error during login:", error);
      toast("error", "Network error", "Could not reach the server. Try again.");
    }
  }

  // Normal login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      toast("error", "Missing fields", "Enter your username and password.");
      return;
    }

    await doLogin(username, password);
  });

  // Demo student login
  demoStudentBtn.addEventListener("click", async () => {
    document.getElementById("username").value = DEMO_STUDENT.username;
    document.getElementById("password").value = DEMO_STUDENT.password;
    toast("info", "Demo Student", "Logging you in as a demo student...");
    await doLogin(DEMO_STUDENT.username, DEMO_STUDENT.password);
  });

  // Demo teacher login
  demoTeacherBtn.addEventListener("click", async () => {
    document.getElementById("username").value = DEMO_TEACHER.username;
    document.getElementById("password").value = DEMO_TEACHER.password;
    toast("info", "Demo Teacher", "Logging you in as a demo teacher...");
    await doLogin(DEMO_TEACHER.username, DEMO_TEACHER.password);
  });

  // Register
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("role").value;

    // Validate inputs
    if (!username || !password || !role) {
      toast(
        "error",
        "Missing fields",
        "Fill out username, password, and role."
      );
      return;
    }

    try {
      const res = await fetch(
        `https://course-manager-backend-updated-2026.onrender.com/api/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast("success", "Account created", "You can now log in.");
        closeRegister();
        registerForm.reset();
      } else {
        toast(
          "error",
          "Registration failed",
          data.error || data.message || "Try a different username."
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast("error", "Network error", "Could not reach the server. Try again.");
    }
  });
});
