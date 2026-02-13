document.addEventListener("DOMContentLoaded", () => {
    const pId = localStorage.getItem("patientId");
    const pName = localStorage.getItem("patientName") || "User";
    const listContainer = document.getElementById("appointmentsList");

    // Sidebar
    document.getElementById("sidebarName").innerText = pName;
    document.getElementById("avatarLetter").innerText = pName.charAt(0).toUpperCase();

    if (!pId) { 
        window.location.href = "/login"; 
        return; 
    }

    fetch(`/api/appointments/history/${pId}`)
        .then(res => res.json())
        .then(data => {
            listContainer.innerHTML = ""; 

            const activeAppointments = data.filter(a => a.status === 'Scheduled');

            if (activeAppointments.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align:center; padding:40px; background:white; border-radius:12px;">
                        <p>There is no any  active appointment.</p>
                        <button onclick="window.location='/doctors-page'" class="book-btn" style="margin-top:10px; cursor:pointer;">Book New Appointment</button>
                    </div>`;
                return;
            }

            // Cards rendering
            activeAppointments.forEach(a => {
                listContainer.innerHTML += `
                    <div class="appointment-card-pro" style="background:white; padding:20px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; box-shadow:0 4px 12px rgba(0,0,0,0.08); border-left: 5px solid #2E86C1;">
                        <div class="info">
                            <h3 style="color:#1c3c64; margin-bottom:5px;">${a.doctor}</h3>
                            <p style="color:#2E86C1; font-weight:600; font-size:14px; margin-bottom:10px;">Status: ${a.status}</p>
                            <div style="font-size:14px; color:#666;">
                                <span>📅 ${a.date}</span> &nbsp;&nbsp; <span>⏰ ${a.time}</span>
                            </div>
                        </div>
                        <div class="actions">
                            <button onclick="cancelAppt(${a.id})" style="background:#fff1f0; color:#ff4d4f; border:1px solid #ffccc7; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold;">
                                ✕ Cancel
                            </button>
                        </div>
                    </div>`;
            });
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            listContainer.innerHTML = "<p>Error: Appointments load nahi ho paye.</p>";
        });
});

// Cancel Logic
async function cancelAppt(id) {
    if(confirm("Are you sure! You want to cancel  your appointment")) {
        const res = await fetch(`/api/appointments/cancel/${id}`, { method: 'PUT' });
        if(res.ok) {
            alert("Success: Appointment canceled.");
            location.reload(); 
        } else {
            alert("Error:.");
        }
    }
}
function logout(){
    localStorage.clear();
    window.location.href = "http://127.0.0.1:5000/";
}