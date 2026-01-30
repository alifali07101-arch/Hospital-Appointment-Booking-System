document.addEventListener("DOMContentLoaded", () => {
    const pId = localStorage.getItem("patientId");
    
    if (!pId) {
        window.location.href = "/login";
        return;
    }
    fetch(`/api/patient/profile/${pId}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error("Profile Error:", data.error);
                return;
            }

            const userName = data.full_name || "User";
            document.getElementById("profileName").innerText = userName;
            document.getElementById("profileEmail").innerText = data.email || "Not Provided";
            document.getElementById("profilePhone").innerText = data.phone || "Not Provided";
            document.getElementById("profileDob").innerText = data.dob || "Not Provided";
            document.getElementById("profileAddress").innerText = data.address || "Not Provided";
            
            
            document.getElementById("profileBlood").innerText = data.blood_group || "Not Provided";

            
            document.getElementById("sidebarName").innerText = userName;
            document.getElementById("sidebarEmail").innerText = data.email || "";

            
            const firstLetter = userName.charAt(0).toUpperCase();
            document.getElementById("avatarLetter").innerText = firstLetter; 
            document.getElementById("profileAvatar").innerText = firstLetter;
        })
        .catch(err => {
            console.error("Fetch Error:", err);
        });
});

function logout() {
    localStorage.clear(); 
    window.location.href = "http://127.0.0.1:5000/"; 
}