🚀 AI-Powered Candidate Evaluation System
An AI-driven candidate evaluation system built with Next.js, Tailwind CSS, Pinecone, and Google Gemini AI to match job descriptions with candidate resumes.

🔹 Features
✅ Candidate Application Form (Submit Name, Email, LinkedIn, Skills, Experience, Resume)
✅ Resume Parsing with pdf-parse
✅ AI-Powered Candidate Matching (Google Gemini API)
✅ Vector Search with Pinecone for Job-Candidate Relevance
✅ Real-time Search & Filtering
✅ Submission & Loading Feedback for Better UX

🛠️ Tech Stack
Frontend: Next.js, Tailwind CSS
Backend: Next.js API Routes
Database: Pinecone (Vector Search)
AI Integration: Google Gemini AI
Deployment: Vercel
📦 Installation & Setup
Clone the Repository
sh
Copy
Edit
git clone <your-repo-url>
cd candidate-app
Install Dependencies
sh
Copy
Edit
npm install
Set Up Environment Variables
Create a .env.local file and add:

ini
Copy
Edit
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index
GEMINI_API_KEY=your_gemini_api_key
Run Locally
sh
Copy
Edit
npm run dev
Visit http://localhost:3000 in your browser.

🚀 Deployment
Deploy on Vercel
Push your code to GitHub:
sh
Copy
Edit
git add .
git commit -m "Initial commit"
git push origin main
Connect your GitHub repo to Vercel at vercel.com.
Click "Deploy" and Vercel will automatically deploy your app! 🎉
📜 License
This project is for learning purposes only.