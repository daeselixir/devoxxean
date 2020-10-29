import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";

//DOM ELEMENT
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");
const logOutBtn = document.querySelector(".nav__el--logout");
//DELEGATION

if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	//console.log(locations);
	displayMap(locations);
}

if (loginForm)
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		//VALUE

		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;

		//console.log(email, password);
		login(email, password);
	});

if (logOutBtn) logOutBtn.addEventListener("click", logout);
