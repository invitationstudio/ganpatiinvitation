const lamp = document.getElementById("lamp");
const glow = document.querySelector(".lamp-glow");
const loginCard = document.getElementById("loginCard");
const roomLight = document.getElementById("roomLight");
const lampBeam = document.querySelector(".lamp-beam");

let lightOn = false;

const loginBtn = document.getElementById("loginBtn");
const password = document.getElementById("password");

loginBtn.disabled = true;
password.disabled = true;

lamp.addEventListener("click", () => {

    lightOn = !lightOn;

    if(lightOn){

        document.body.style.background = "#050505";

        glow.style.opacity = "1";
        glow.style.transform =
        "translate(-50%,-50%) scale(1.25)";

        loginCard.classList.add("show");

        roomLight.style.opacity = "1";

        lampBeam.style.opacity = "1";

        loginBtn.disabled = false;
password.disabled = false;

password.focus();

        lamp.style.transform = "scale(1.08)";

    }else{

        document.body.style.background = "#000";

        glow.style.opacity = "0";
        glow.style.transform =
        "translate(-50%,-50%) scale(1)";

        loginCard.classList.remove("show");

        roomLight.style.opacity = "0";

        lampBeam.style.opacity = "0";

        loginBtn.disabled = true;
password.disabled = true;

        lamp.style.transform = "scale(1)";

    }

});

// ===========================
// Admin Login
// ===========================

function login() {

    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    if (password === "admin123") {

        localStorage.setItem("adminLoggedIn", "true");

        window.location.href = "dashboard.html";

    } else {

        error.innerText = "Wrong Password";

    }

}

loginBtn.addEventListener("click", login);

password.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        login();
    }

});