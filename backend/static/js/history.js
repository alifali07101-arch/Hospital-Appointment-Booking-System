document.addEventListener("DOMContentLoaded", () => {
    const patientId = localStorage.getItem("patientId");
    const tableBody = document.getElementById("historyTable");

    fetch(`/api/appointments/history/${patientId}`)
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = ""; 
            data.forEach(a => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${a.doctor}</td>
                        <td>${a.date}</td>
                        <td>${a.time}</td>
                        <td><span class="status-badge">${a.status}</span></td>
                    </tr>
                `;
            });
        });
});