document.addEventListener("DOMContentLoaded", () => {
    const patientId = localStorage.getItem("patientId");
    const tableBody = document.getElementById("historyTable");


    const pName = localStorage.getItem("patientName") || "User";
    const pEmail = localStorage.getItem("patientEmail") || "";
    if(document.getElementById("sidebarName")) {
        document.getElementById("sidebarName").innerText = pName;
        document.getElementById("sidebarEmail").innerText = pEmail;
        document.getElementById("avatarLetter").innerText = pName.charAt(0).toUpperCase();
    }

    if (!patientId) return;

    fetch(`/api/appointments/history/${patientId}`)
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = ""; 
            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No history found</td></tr>";
                return;
            }
            data.forEach(a => {
                
                const statusClass = a.status.toLowerCase();
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${a.doctor}</strong></td>
                        <td>${a.date}</td>
                        <td>${a.time}</td>
                        <td><span class="status-badge ${statusClass}">${a.status}</span></td>
                    </tr>
                `;
            });
        });
});

// Clear Cancelled Function
async function clearCancelledHistory() {
    const pId = localStorage.getItem("patientId");
    
    if (!confirm("Sure! You want to clear all the canceled appointment")) {
        return;
    }

    try {
        const res = await fetch(`/api/appointments/clear_cancelled/${pId}`, {
            method: 'DELETE'
        });
        
        const result = await res.json();
        
        if (res.ok) {
            alert(result.message);
            location.reload(); 
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        console.error("Clear History Error:", err);
        alert("Something went worg!");
    }
}
function logout(){
    localStorage.clear();
    window.location.href = "http://127.0.0.1:5000/";
}