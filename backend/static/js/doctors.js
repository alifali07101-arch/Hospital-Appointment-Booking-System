document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/doctors")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("doctorList");
            if (!container) return; 
            
            container.innerHTML = "";

            data.forEach(doc => {
                
                container.innerHTML += `
                    <div class="doctor-card">
                        <img src="/static/assets/images/${doc.image}" class="doctor-img" alt="Doctor">
                        <h3>${doc.name}</h3>
                        <p>${doc.specialization}, ${doc.experience} years</p>
                        <p><strong>${doc.degree}</strong></p>
                        <p><strong>Fees: ₹${doc.fees}</strong></p>
                        
                        <button class="book-btn" onclick="bookNow('${doc.id}', '${doc.name}')">
                            Book Appointment
                        </button>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Error loading doctors:", err));
});

function bookNow(doctorId, doctorName) {
    localStorage.setItem("selectedDoctorId", doctorId);
    localStorage.setItem("selectedDoctorName", doctorName);
    
    
    window.location.href = "/book"; 
}