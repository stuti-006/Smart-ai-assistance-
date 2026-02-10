async function signUpStudent() {
  const email = document.getElementById('studentEmail').value.trim();
  const dob = document.getElementById('studentDOB').value.trim();
  if (!email || !dob) return alert('Please fill all fields');

  try {
    const res = await fetch('http://localhost:5000/api/student/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, dob }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Signup failed');
      return;
    }

    // ✅ Show QR image immediately
    document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#FAF8F1;">
        <h2 style="font-family:Lexend;font-size:22px;color:#1E392A;">Signup Successful!</h2>
        <p>Your unique QR Code:</p>
        <img src="${data.qr_code}" alt="Your QR Code" style="width:220px;height:220px;margin-top:12px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <p style="margin-top:20px;color:#1E392A;font-size:14px;">Use this to mark attendance.</p>
        <button onclick="window.location.href='studentlogin.html'" style="margin-top:20px;background:#1E392A;color:white;padding:10px 20px;border-radius:8px;">Go to Login</button>
      </div>`;
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
}
