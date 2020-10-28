/* eslint-disable */

const login = (email, password) => {
	alert(email, password);
};

document.querySelector(".form-login").addEventListener("submit", (e) => {
	e.preventDefault();
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	console.log(email, password);
	login(email, password);
});
