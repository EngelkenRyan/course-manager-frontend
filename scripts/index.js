document.addEventListener("DOMContentLoaded", () => {
  // Get saved login token
  const token = localStorage.getItem("token");

  // Get redirected if no token
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Decode token to get user role
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userRole = decodedToken.role;

  // Show/hide buttons based on role
  if (userRole === "student") {
    document.getElementById("createCourseButton").style.display = "none";
    document.getElementById("deleteCourseButton").style.display = "none";
  } else if (userRole === "teacher") {
    document.getElementById("createCourseButton").style.display = "block";
    document.getElementById("deleteCourseButton").style.display = "none";
  } else {
    window.location.href = "login.html";
  }
});
