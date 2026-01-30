document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pId = localStorage.getItem("patientId");
    const dId = localStorage.getItem("selectedDoctorId");

    
    if (!pId || !dId) {
        alert("Session Expired! Please select doctor again.");
        window.location.href = "/doctors-page";
        return;
    }

    const bookingData = {
        patient_id: pId,
        doctor_id: dId,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value
    };

    const res = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
    });

    const result = await res.json();
    if (res.ok) {
        alert("Success: " + result.message);
        window.location.href = "/appointments";
    } else {
        alert("Booking Error: " + (result.error || result.message));
    }
});