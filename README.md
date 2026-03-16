EchoBot 

EchoBot Mentor is a full-stack educational web application designed to facilitate student-teacher interactions, track attendance via QR codes, manage tasks, and provide an AI-powered conversational mentor for students. The AI mentor can assist seamlessly across various domains, including academics, music, sports, creative arts, and personal growth.

## Features
- **Student & Teacher Portals**: Dedicated signup and login flows using Supabase Authentication.
- **AI Mentor (EchoBot)**: Powered by local LLMs via Ollama (default: Llama 3), capable of providing contextual guidance based on the student's recent tasks and chat history.
- **QR Code Attendance**: Unique QR code generation for students upon signup, enabling quick and secure attendance tracking.
- **Task Management**: Teachers or the system can assign activities/tasks which students can view and mark as completed.
- **Modern Tech Stack**: 
  - **Frontend**: React 19, Vite, Tailwind CSS, TypeScript.
  - **Backend**: Node.js, Express, Supabase JS Client, Ollama integration.
  - **Database & Auth**: Supabase.

## Project Structure
- `/backend`: The Express.js backend server handling API routes, Supabase Database interactions, and Ollama AI prompts.
- `/frontend`: The React codebase built with Vite for the user interface.

## Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **Supabase**: You need a Supabase project for the database and authentication.
- **Ollama**: To use the AI mentor locally, install [Ollama](https://ollama.com/) and download the `llama3` model (or configure your preferred model in `.env`).

## Getting Started

### 1. Clone the repository
```bash
git clone <repository_url>
cd echobot
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OLLAMA_URL=http://localhost:11434  # Optional, defaults to this URL
OLLAMA_MODEL=llama3                # Optional, defaults to llama3
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Running Ollama
Ensure Ollama is running in the background and that you have pulled the required model:
```bash
ollama run llama3
```

## API Endpoints Overview
### Auth & Models
- `POST /api/student/signup`: Registers a new student and generates a QR code.
- `POST /api/student/login`: Authenticates a student.
- `POST /api/teacher/signup`: Registers a new teacher.
- `POST /api/teacher/login`: Authenticates a teacher.

### Core Features
- `POST /api/student/qr-attendance`: Logs student attendance using QR data.
- `POST /chat`: Engages the EchoBot AI Mentor.
- `GET /api/tasks/:email`: Retrieves tasks for a specific student.
- `POST /api/tasks/complete`: Marks a task as complete.

