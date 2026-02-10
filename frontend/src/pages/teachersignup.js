async function saveTeacherData() {
  const name = document.getElementById('teacherName').value.trim();
  const email = document.getElementById('teacherEmail').value.trim();
  const password = document.getElementById('teacherPassword').value.trim();

  if (!name || !email || !password) {
    alert('Please fill all fields');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/teacher/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Signup failed');
      return;
    }

    alert('Signup successful! Please login now.');
    window.location.href = 'teacherlogin.html';
  } catch (err) {
    console.error(err);
    alert('Network error — make sure backend is running.');
  }
}

function redirectToLogin() {
  window.location.href = 'teacherlogin.html';
}
