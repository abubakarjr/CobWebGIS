function handleCredentialResponse(response) {
  const responsePayload = parseJwt(response.credential);
  console.log("ID: " + responsePayload.sub);
  console.log("Full Name: " + responsePayload.name);
  console.log("Given Name: " + responsePayload.given_name);
  console.log("Family Name: " + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);

  // Store user information or perform any other required actions
  // Example: Redirect to a protected page
  window.location.href = "/pages/map.html";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "1069144074365-t2m6orjga7vqirk3n1lmlvbmmcm3b4h4.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(
    document.querySelector(".g_id_signin"),
    { theme: "outline", size: "large" } // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialog
};
