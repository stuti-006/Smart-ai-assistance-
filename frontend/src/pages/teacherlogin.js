async function loginTeacher() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/teacher/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Login failed');
      return;
    }

    // Optional: Save teacher info locally if needed
    localStorage.setItem('teacher', JSON.stringify(data.teacher));
    alert('Login successful');
    window.location.href = 'teacherdashboard.html';
  } catch (err) {
    console.error(err);
    alert('Network error — make sure backend is running.');
  }
}

function redirectToSignup() {
  window.location.href = 'teachersignup.html';
}
