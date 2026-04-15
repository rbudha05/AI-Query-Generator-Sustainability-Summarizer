# AI Query Generator & Sustainability Summarizer

## Overview
This project is a full-stack AI web application built with **React** on the frontend and **Node.js/Express** on the backend. It provides two main features:

1. **AI Query Mode** – allows the user to ask a general question and receive an AI-generated response.
2. **Article Summarizer Mode** – allows the user to paste an article and generate a structured sustainability-focused output including:
   - Summary
   - Analysis
   - Key Points

The system uses **Google Gemini** through **LangChain's ChatGoogleGenerativeAI** integration. It also uses a simple retrieval step from a local text file (`./data/info.txt`) for query enhancement in AI Query Mode.

---

## Features
- Two operating modes in one interface:
  - **AI Query**
  - **Article Summarizer**
- React frontend with Bootstrap-based UI
- Express backend with REST API endpoints
- Google Gemini integration using LangChain
- Sustainability-focused summarization prompt
- Basic retrieval-augmented response generation using local text data
- Loading indicators and error handling
- Copy output button
- Character count display for user input

---

## Tech Stack

### Frontend
- React
- Axios
- React-Bootstrap
- Bootstrap CSS

### Backend
- Node.js
- Express
- CORS
- dotenv
- LangChain
- Google Gemini API
- natural
- TextLoader from LangChain

---

## Project Structure
```text
project-folder/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── data/
│   │   └── info.txt
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## How the Application Works

### 1. AI Query Mode
In this mode, the user enters a question in the frontend. The backend:
- loads content from `./data/info.txt`
- tokenizes the user query
- compares it with sentences in the text file
- retrieves the best matching sentence
- augments the original query with that retrieved fact
- sends the augmented query to the Gemini model
- returns the generated response to the frontend

This gives the application a simple **retrieval-augmented generation (RAG)** style behavior.

### 2. Article Summarizer Mode
In this mode, the user provides:
- an optional article title
- the full article text

The backend sends the article to the Gemini model with a structured prompt asking for:
- a one-paragraph summary
- a one-paragraph sustainability analysis
- three key points

The response is then shown in the frontend results section.

---

## API Endpoints

### `GET /`
Checks whether the backend server is running.

**Response:**
```json
{
  "message": "Server is running"
}
```

### `POST /api/query`
Used for the **AI Query Mode**.

**Request body:**
```json
{
  "query": "What are sustainable solutions provided by major software companies?"
}
```

**Response:**
```json
{
  "response": "AI-generated answer"
}
```

### `POST /api/summarize`
Used for the **Article Summarizer Mode**.

**Request body:**
```json
{
  "articleTitle": "Example Article Title",
  "articleText": "Full article text goes here..."
}
```

**Response:**
```json
{
  "result": "Summary, analysis, and key points"
}
```

---

## Installation and Setup

### 1. Clone the repository
```bash
git clone <repository-link>
cd <your-project-folder>
```

### 2. Backend setup
Go to the backend folder:
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

Run the backend:
```bash
node server.js
```

The backend runs on:
```text
http://localhost:3000
```

### 3. Frontend setup
Open a new terminal and go to the frontend folder:
```bash
cd frontend
npm install
npm start
```

Depending on your React setup, the frontend may run on:
- `http://localhost:3001`
- `http://localhost:5173`
- or another local port shown in the terminal

---

## Required Environment Variable

The backend requires the following environment variable:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

If the key is missing, the server will throw this error:
```text
GOOGLE_API_KEY is missing from .env file
```

---

## Required Data File
For the query retrieval feature to work correctly, you need this file in the backend:

```text
./data/info.txt
```

This file stores local text data used to find the best match for the user query before sending it to the AI model.

---

## Frontend Functionality
Based on the frontend implementation, the application includes:

- mode selector dropdown
- query input textarea
- article title input
- article text textarea
- character counter
- loading spinner
- clear button
- output display area
- copy output button
- error alerts

The frontend switches dynamically between **AI Query** and **Article Summarizer** modes depending on the user's selection. The uploaded React component shows this behavior clearly. fileciteturn0file0

---

## Backend Functionality
The backend is implemented using Express and includes:
- environment variable loading with `dotenv`
- Gemini model initialization using `ChatGoogleGenerativeAI`
- local text loading using `TextLoader`
- token-based matching using `natural.WordTokenizer`
- error handling for invalid input and API failures
- separate endpoints for query generation and article summarization

---

## Process Documentation

### How the summarizer was implemented
The summarizer was implemented by creating a dedicated backend endpoint:
- `POST /api/summarize`

This endpoint receives article content from the frontend and sends it to Gemini with a structured prompt. The prompt tells the AI to produce:
- a summary
- an analysis
- three key points

The response is then returned to the frontend and displayed in the result section.

### How the query system was implemented
The AI query system was implemented with:
- a frontend input box for the question
- a backend route at `POST /api/query`
- a retrieval helper that searches a local text file for the best matching sentence
- an augmented prompt sent to Gemini

This makes the answer more context-aware than a plain direct question.

### How article content can be selected
Article content can be selected from:
- official company sustainability pages
- reputable news websites
- recent articles about Microsoft, Google, Amazon, Meta, and other software or technology companies
- articles discussing AI, cloud computing, data centers, carbon emissions, renewable energy, or e-waste

### How the solution was tested
The project can be tested using the following cases:

#### Test 1 – Query Mode
Input:
```text
What are sustainable solutions provided by major software companies?
```
Expected:
- a valid AI-generated answer appears in the result box

#### Test 2 – Summarizer Mode
Input:
- article title
- article text

Expected:
- a structured response with summary, analysis, and key points

#### Test 3 – Empty Query
Input:
- blank query in query mode

Expected:
- frontend shows: `Please enter a query.`

#### Test 4 – Empty Article
Input:
- blank article text in summarizer mode

Expected:
- frontend shows: `Please paste the article text.`

#### Test 5 – Backend Failure
Condition:
- backend is stopped

Expected:
- frontend shows an error message such as:
  `Failed to fetch response. Please try again.`

---

## Example Usage

### Query Mode Example
**Input**
```text
What are sustainable solutions provided by major software companies?
```

**Output**
A direct AI-generated response based on the query and retrieved context.

### Summarizer Mode Example
**Article Title**
```text
Microsoft expands sustainability efforts in cloud infrastructure
```

**Article Text**
Paste the article into the article text area.

**Output**
- Summary paragraph
- Analysis paragraph
- 3 key points

---

## Group Collaboration Suggestion

This project was completed collaboratively with the following contributions:

- Rohit Budha: Developed the full-stack application (React frontend, Node.js backend), implemented Gemini API integration, and prepared the README documentation.

- Esther Dhimal: Led the final report documentation and ensured alignment with assignment requirements.

- Ilhan Sercan Sozeri: Conducted research on sustainability topics and contributed to content analysis.

- Lynn Zein: Assisted with article selection, summaries, and key point extraction.

- Thyra Barnes: Performed testing, validation, and review of outputs for accuracy and clarity.
---

## Common Issues

### 1. Missing API key
If the `.env` file does not include `GOOGLE_API_KEY`, the backend will not start.

### 2. Missing `info.txt`
If `./data/info.txt` is missing, query retrieval may fail.

### 3. CORS or server connection issue
Make sure:
- backend is running on port `3000`
- frontend sends requests to `http://localhost:3000`

### 4. Empty input
Both modes validate user input before making requests.

---

## Future Improvements
- add article URL input
- fetch online articles automatically
- support PDF upload
- improve retrieval with embeddings instead of token overlap
- store previous queries and summaries
- add formatting for output sections
- deploy frontend and backend online

---

## Author
Rohit Budha
