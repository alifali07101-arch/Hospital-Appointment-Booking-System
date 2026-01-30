const patientId = localStorage.getItem("patientId");

fetch(`/api/patient/profile/${patientId}`)
.then(res => res.json())
.then(data => {
    document.getElementById("sidebarName").innerText = data.full_name;
    document.getElementById("sidebarEmail").innerText = data.email;
    document.getElementById("avatarLetter").innerText = data.full_name.charAt(0);
});

function logout(){
    localStorage.clear();
    window.location.href = "/login";
}
