// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

      
        const signupData = {
            full_name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            phone: document.getElementById("phone").value,
            dob: document.getElementById("dob").value,
            blood_group: document.getElementById("blood").value,
            address: document.getElementById("address").value
        };

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupData)
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            window.location.href = "/login";
        }
    });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        const data = await res.json();

        if (res.ok) {
            
            localStorage.setItem("patientId", data.patientId);
            localStorage.setItem("patientName", data.name);

            window.location.href = "/dashboard";
        } else {
            alert(data.message || "Login failed");
        }
    });
}
