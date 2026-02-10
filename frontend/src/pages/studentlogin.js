async function loginStudent() {
  const email = document.getElementById('loginEmail').value.trim();
  const dob = document.getElementById('loginDOB').value.trim();

  if (!email || !dob) {
    alert('Please fill all fields');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/student/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, dob }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Login failed');
      return;
    }

    alert('Login successful! Now scan your QR code.');
    localStorage.setItem('userEmail', email);

    // ✅ Open QR scanner after login
    startQRScan();
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
}
async function startQRScan() {
  const email = localStorage.getItem('userEmail');
  if (!email) return alert('Login first');

  document.getElementById('cameraModal').style.display = 'flex';
  document.getElementById('qrScanner').style.display = 'block';
  document.getElementById('cameraFeed').style.display = 'none';
  document.getElementById('captureBtn').style.display = 'none';

  qrscanner = new Html5Qrcode("qrScanner");
  qrscanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 200 },
    async qrText => {
      qrscanner.stop();
      closeCamera();

      try {
        const res = await fetch("http://localhost:5000/api/student/qr-attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, qrValue: qrText }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error marking attendance");
          return;
        }

        alert(data.message);
        window.location.href = "student_dashboard.html";
      } catch (err) {
        console.error(err);
        alert("Network error during QR scan");
      }
    }
  );
}
