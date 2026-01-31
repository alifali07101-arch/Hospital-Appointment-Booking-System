document.addEventListener("DOMContentLoaded", () => {
    const pId = localStorage.getItem("patientId");
    
    if (!pId) {
        window.location.href = "/login";
        return;
    }

    // 1. Profile Fetch for Sidebar (Quick Update)
    fetch(`/api/patient/profile/${pId}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("sidebarName").innerText = data.full_name;
        document.getElementById("sidebarEmail").innerText = data.email;
        document.getElementById("avatarLetter").innerText = data.full_name.charAt(0).toUpperCase();
    });

    // 2. Fetch Appointments for Stats and List
    fetch(`/api/appointments/history/${pId}`)
        .then(res => res.json())
        .then(data => {
            const upcomingCountEl = document.getElementById("upcomingCount");
            const totalCountEl = document.getElementById("totalCount");
            const activeStatusEl = document.getElementById("activeStatus");
            const listContainer = document.getElementById("appointmentList");

            if (!data || data.length === 0) {
                upcomingCountEl.innerText = "0";
                totalCountEl.innerText = "0";
                activeStatusEl.innerText = "No Appointments Yet";
                return;
            }

            // Total Count update
            totalCountEl.innerText = data.length;

            // Filter for 'Scheduled' (Upcoming)
            const scheduled = data.filter(a => a.status === 'Scheduled');
            upcomingCountEl.innerText = scheduled.length;

            // Update Active Status text
            const latest = data[0]; 
            activeStatusEl.innerText = `Latest: ${latest.status} (${latest.date})`;
            activeStatusEl.style.color = latest.status === 'Cancelled' ? "red" : "#28a745";

            
            if (scheduled.length > 0) {
                listContainer.classList.remove("no-appointments");
                listContainer.innerHTML = ""; // Clear "No upcoming appointments" text

                scheduled.slice(0, 3).forEach(a => { 
                    listContainer.innerHTML += `
                        <div class="appointment-card-mini" style="background: #f8fbff; padding: 15px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid #2E86C1; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="margin:0; color:#1c3c64;">${a.doctor}</h4>
                                <small style="color:#666;">📅 ${a.date} | ⏰ ${a.time}</small>
                            </div>
                            <span style="background:#e3f2fd; color:#2E86C1; padding:4px 10px; border-radius:15px; font-size:12px; font-weight:bold;">${a.status}</span>
                        </div>
                    `;
                });
            }
        })
        .catch(err => console.error("Dashboard Stats Error:", err));
});

function logout(){
    localStorage.clear();
    window.location.href = "/";
}