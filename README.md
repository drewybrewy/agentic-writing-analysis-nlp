<img width="1920" height="929" alt="image" src="https://github.com/user-attachments/assets/3ab88ae7-77a9-4b6a-a641-7c832fc23dd9" />
<img width="1920" height="929" alt="image" src="https://github.com/user-attachments/assets/93b18cc1-d379-4216-8f9c-9a0fe9e43c08" />

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS (assumed)
- Component-based UI

### Backend
- Python
- FastAPI
- LangGraph / LangChain-style pipeline
- LLM integration (Groq API)

### Models
- LLaMA-based models via Groq

---

## Architecture

The system processes input through multiple stages:

1. **Vision Node**
   - Extracts intent, goals, and context

2. **Thematic Node**
   - Identifies key ideas and depth

3. **Sentiment Node**
   - Evaluates tone and consistency

4. **Lexical Node**
   - Analyzes clarity and readability

5. **AI Signal Node**
   - Reviews flow, rhythm, and structure

6. **Master Node**
   - Produces final evaluation and verdict

Each node returns structured output which is rendered in the frontend.

---

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
