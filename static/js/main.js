
const nav = document.getElementById("navLinks");
const patientId = localStorage.getItem("patientId");

if (patientId && nav) {
    nav.innerHTML = `
        <a href="/dashboard">Dashboard</a>
        <a href="#" onclick="logout()">Logout</a>
    `;
}

function logout() {
    localStorage.clear();
    window.location.href = "/";
}
