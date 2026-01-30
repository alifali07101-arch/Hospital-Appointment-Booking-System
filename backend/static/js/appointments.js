document.addEventListener("DOMContentLoaded", () => {
    const patientId = localStorage.getItem("patientId");
    const listContainer = document.getElementById("appointmentsList");

    
    const userName = localStorage.getItem("patientName") || "User";
    document.getElementById("sidebarName").innerText = userName;
    document.getElementById("avatarLetter").innerText = userName.charAt(0).toUpperCase();

    fetch(`/api/appointments/history/${patientId}`)
        .then(res => res.json())
        .then(data => {
            listContainer.innerHTML = ""; 
            if (!data || data.length === 0) {
                listContainer.innerHTML = `
                    <div class="no-appointments-box" style="text-align: center; padding: 50px; background: white; border-radius: 15px;">
                        <h3 style="color: #1c3c64;">No any appointment</h3>
                        <p>Aapne abhi tak koi booking nahi ki hai.</p>
                        <button onclick="window.location='/doctors-page'" class="book-btn" style="margin-top:15px;">Book Now</button>
                    </div>`;
                return;
            }

            data.forEach(a => {
                listContainer.innerHTML += `
                    <div class="appointment-card-professional" style="background:white; padding:20px; border-radius:12px; display:flex; justify-content:space-between; margin-bottom:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05); border-left: 5px solid #2E86C1;">
                        <div>
                            <h3 style="color:#1c3c64; margin-bottom:5px;">${a.doctor}</h3>
                            <p style="color:#2E86C1; font-weight:600; margin-bottom:10px;">Specialist</p>
                            <p style="color:#666;">📅 ${a.date} &nbsp;&nbsp; ⏰ ${a.time}</p>
                        </div>
                        <div style="text-align:right;">
                            <span class="status-badge" style="background:#e3f2fd; color:#2E86C1; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:700;">${a.status}</span>
                            <br><br>
                            <button class="cancel-btn" style="border:1px solid #ff4d4d; color:#ff4d4d; background:none; padding:5px 12px; border-radius:5px; cursor:pointer;">Cancel</button>
                        </div>
                    </div>`;
            });
        });
});