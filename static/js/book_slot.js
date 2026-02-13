document.getElementById("doctorName").innerText = localStorage.getItem("selectedDoctorName");

function bookAppointment() {
    const patientId = localStorage.getItem("patientId");
    const doctorId = localStorage.getItem("selectedDoctorId");
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    fetch('/api/appointments/book', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({patientId, doctorId, date, time})
    })
    .then(res => res.json())
    .then(data => {
        alert("Appointment Booked!");
        window.location.href = "/history";
    });
}
