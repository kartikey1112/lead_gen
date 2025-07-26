# 🧠 AI-Powered Lead Management System

An intelligent lead generation and management system that uses AI to detect intent, score leads, and automate outreach via voice calls and WhatsApp messages.

---

## 🧩 ER Diagram

The database consists of a single `Lead` model to store user submissions and AI-enhanced metadata.

```prisma
model Lead {
  id                 Int      @id @default(autoincrement())
  name               String
  phone              String
  city               String
  product            String
  user_message       String
  status             String   @default("new")
  created_at         DateTime @default(now())
  ai_detected_intent String
  score              String
  tags               String
}
```

---

## ⚙️ Tech Stack

- **Frontend:** React + Formik  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **AI Integration:** Gemini Flash 1.5  
- **Voice Calls:** Twilio API  
- **WhatsApp Messages:** Vonage API  

---

## ✨ Features

- 🔍 AI-Powered Intent Detection using Gemini Flash 1.5  
- 📊 Lead Scoring with Tags  
- 📞 Automated Voice Calls (Twilio)  
- 💬 WhatsApp Message Replies (Vonage)  
- 📥 Admin Panel to Filter, Score, and View Leads  
- 🌐 Full-stack MERN-style Architecture  

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-lead-manager.git
cd ai-lead-manager
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `server` directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/leadsdb
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Migrate the Database

```bash
cd server
npx prisma migrate dev --name init
```

### 5. Start the App

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | `/api/leads`     | Submit new lead                    |
| GET    | `/api/leads`     | Fetch all leads                    |

---

## 🧠 AI Workflow

1. User submits lead via frontend form.
2. Backend invokes Gemini 1.5 Flash model for:
   - Intent detection
   - Lead scoring
   - Tag extraction
3. Lead is stored in PostgreSQL via Prisma ORM.
4. Twilio initiates a voice call.
5. Vonage sends a WhatsApp message.
6. Admin interface displays and filters leads.

---

