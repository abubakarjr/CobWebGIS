//RESPONSIVE NAVBAR//
const nav = document.querySelector(".nav"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn");

navOpenBtn.addEventListener("click", () => {
  nav.classList.add("openNav");
});

navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("openNav");
});
//RESPONSIVE NAVBAR//

//SIGN UP/SIGN IN FORM//
const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});
//SIGN UP/SIGN IN FORM//

// Inside your script.js or map.js
function toggleEdgePanels() {
  var aside1 = document.querySelector(".aside1");
  var aside2 = document.querySelector(".aside2");

  // Toggle the "hidden" class to show/hide the edge panels
  aside1.classList.toggle("hidden");
  aside2.classList.toggle("hidden");

  // Trigger map resize after toggling
  setTimeout(function () {
    map.updateSize();
  }, 300); // Adjust the timeout as needed
}

// script.js
function adjustPrintLayout() {
  const printWrapper = document.querySelector(".printwrapper");

  if (window.matchMedia("(orientation: landscape)").matches) {
    // Landscape orientation
    printWrapper.style.width = "251mm"; /* A4 height */
    printWrapper.style.height = "210mm"; /* A4 width */
  } else {
    // Portrait orientation
    printWrapper.style.width = "210mm"; /* A4 width */
    printWrapper.style.height = "251mm"; /* A4 height */
  }
}

// Call the function on page load and orientation change
window.addEventListener("load", adjustPrintLayout);
window.addEventListener("orientationchange", adjustPrintLayout);

// // Check if the user is authenticated (has signed up or logged in)
// function isAuthenticated() {
//   // Check if the user is signed up or logged in (you can modify this logic based on your authentication mechanism)
//   return localStorage.getItem("userToken") !== null;
// }

// // Function to handle access to the map page
// function handleMapAccess() {
//   // Select the map container
//   const mapContainer = document.querySelector(".map");

//   // Check if the user is authenticated
//   if (isAuthenticated()) {
//     // If authenticated, show the map
//     mapContainer.style.display = "block";
//     window.location.href = "/map.html";
//   } else {
//     // If not authenticated, hide the map and redirect to the login/signup page
//     mapContainer.style.display = "none";
//     window.location.href = "/layout/home.html";
//   }
// }

// // Event listener for the form open button
// formOpenBtn.addEventListener("click", () => {
//   // Show the form container
//   formContainer.classList.add("active");

//   // Check authentication when the form is opened
//   handleMapAccess();
// });

// // Event listener for the signup button
// signupBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   // Handle signup logic (you can add your signup logic here)
//   // After successful signup, set a token or flag in local storage to indicate authentication
//   localStorage.setItem("userToken", "someAuthToken");

//   // Update map access
//   handleMapAccess();
// });

// // Event listener for the login button
// loginBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   // Handle login logic (you can add your login logic here)
//   // After successful login, set a token or flag in local storage to indicate authentication
//   localStorage.setItem("userToken", "someAuthToken");

//   // Update map access
//   handleMapAccess();
// });

// // Initial check for map access when the page loads
// document.addEventListener("DOMContentLoaded", handleMapAccess);
