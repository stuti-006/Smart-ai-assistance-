// ==========================
// ECHOBOT MENTOR BACKEND
// ==========================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const QRCode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================
// CONFIG
// ==========================
const PORT = process.env.PORT || 5000;
const model = process.env.OLLAMA_MODEL || 'llama3';
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ==========================
// ATTENDANCE
// ==========================
app.post('/api/student/qr-attendance', async (req, res) => {
  const { email, qrValue } = req.body;

  try {
    if (email.trim() !== qrValue.trim()) {
      return res.status(400).json({ error: 'QR does not match student' });
    }

    const { data: student } = await supabase
      .from('students')
      .select('id,email')
      .eq('email', email)
      .single();

    if (!student) return res.status(404).json({ error: 'Student not found' });

    const { error } = await supabase
      .from('attendance')
      .insert([{ student_id: student.id, email, method: 'qr' }]);

    if (error && error.code === '23505') {
      return res.json({ message: 'Already marked present ✅' });
    }

    res.json({ message: 'Attendance marked 🎉' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// STUDENT SIGNUP
// ==========================
app.post('/api/student/signup', async (req, res) => {
  const { email, dob } = req.body;

  try {
    await supabase.auth.signUp({ email, password: dob });

    const qr_code = await QRCode.toDataURL(email);

    await supabase.from('students').insert([
      { email, total_stars: 0, qr_code }
    ]);

    res.json({ message: 'Signup successful', qr_code });
  } catch {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// ==========================
// STUDENT LOGIN
// ==========================
app.post('/api/student/login', async (req, res) => {
  const { email, dob } = req.body;

  try {
    await supabase.auth.signInWithPassword({ email, password: dob });
    res.json({ message: 'Login successful', email });
  } catch {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// ==========================
// TEACHER SIGNUP
// ==========================
app.post('/api/teacher/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await supabase.auth.signUp({ email, password });

    const { data } = await supabase
      .from('teachers')
      .insert([{ name, email, created_at: new Date() }])
      .select()
      .single();

    res.json({ message: 'Teacher signup successful', teacher: data });
  } catch {
    res.status(500).json({ error: 'Teacher signup failed' });
  }
});

// ==========================
// TEACHER LOGIN
// ==========================
app.post('/api/teacher/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await supabase.auth.signInWithPassword({ email, password });
    res.json({ message: 'Login successful', email });
  } catch {
    res.status(400).json({ error: 'Login failed' });
  }
});

// =======================================================
// 🧠 ECHOBOT CHAT (MULTI-DOMAIN, CONTEXTUAL)
// =======================================================
app.post('/chat', async (req, res) => {
  const { message, email } = req.body;

  if (!message || !email) {
    return res.status(400).json({ error: 'Message and email required' });
  }

  try {
    // Fetch recent tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('task_text, level, status, interest')
      .eq('student_email', email)
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch chat history
    const { data: history } = await supabase
      .from('chat_history')
      .select('role,message')
      .eq('student_email', email)
      .order('created_at', { ascending: true })
      .limit(10);

    const taskContext = tasks?.length
      ? tasks.map(
          (t, i) =>
            `${i + 1}. [${t.interest}] (${t.level}) ${t.task_text} [${t.status}]`
        ).join('\n')
      : 'No activities assigned yet.';

    const chatContext = history?.length
      ? history.map(h => `${h.role}: ${h.message}`).join('\n')
      : 'No prior conversation.';

    const prompt = `
You are EchoBot Mentor — a friendly AI guide.

You help with:
• Academics (coding, math, science)
• Music (singing, instruments, practice)
• Sports & fitness (drills, workouts)
• Creative arts (drawing, writing)
• General hobbies & self-growth

Rules:
- Detect the domain automatically.
- If academic → explain or guide.
- If music → give practice tips.
- If sports → give drills or form advice.
- If creative → suggest exercises.
- Encourage and simplify if stuck.
- Do NOT force academics.
- Keep responses short and warm.

Recent Activities:
${taskContext}

Conversation:
${chatContext}

Student:
"${message}"

Reply:
`;

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt })
    });

    const raw = await response.text();
    let botReply = '';

    try {
      botReply = JSON.parse(raw).response.trim();
    } catch {
      botReply = raw.trim();
    }

    if (!botReply) botReply = 'I’m here 🙂 Tell me more.';

    // Save chat
    await supabase.from('chat_history').insert([
      { student_email: email, role: 'student', message },
      { student_email: email, role: 'bot', message: botReply }
    ]);

    res.json({ reply: botReply });
  } catch (err) {
    console.error('EchoBot error:', err.message);
    res.status(500).json({ error: 'EchoBot error' });
  }
});

// ==========================
// FETCH TASKS
// ==========================
app.get('/api/tasks/:email', async (req, res) => {
  const { email } = req.params;

  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('student_email', email)
    .order('created_at', { ascending: false });

  res.json(data);
});

// ==========================
// MARK TASK COMPLETE
// ==========================
app.post('/api/tasks/complete', async (req, res) => {
  const { taskId } = req.body;

  await supabase
    .from('tasks')
    .update({ status: 'Completed' })
    .eq('id', taskId);

  res.json({ message: 'Task completed 🎉' });
});

// ==========================
// SERVER START
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Echobot backend running on http://localhost:${PORT}`);
});
