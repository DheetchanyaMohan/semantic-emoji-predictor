# Semantic Emoji Predictor

A real-time emoji search and prediction system that maps user input to relevant emojis using multiple string matching and ranking techniques.

## Live Demo
https://semantic-emoji-predictor.vercel.app/

---

## Overview

This project implements a lightweight search engine for emojis. Given a text query, it retrieves and ranks relevant emojis based on multiple matching strategies including exact matching, prefix matching, edit distance, and semantic similarity.

The system is designed to be fast, responsive, and interactive, with real-time feedback as the user types.

---

## Features

- Real-time emoji prediction with debounced input
- Multi-word query support
- Multiple matching strategies:
  - Exact match
  - Prefix match
  - Fuzzy match using Levenshtein distance
  - Semantic similarity using cosine similarity
- Weighted scoring and ranking system
- Deduplication with highest-score selection
- Click-to-copy emoji functionality
- Suggestion buttons for quick interaction
- Clean and responsive UI built with Tailwind CSS

---

## Technical Approach

### 1. Data Structure
- Used a hash map (JavaScript `Map`) to index keywords to emojis
- Enables average O(1) lookup for keyword-based retrieval

### 2. Matching Algorithms

**Exact Match**
- Direct comparison between input and keyword

**Prefix Match**
- Checks if keyword starts with input

**Fuzzy Match (Levenshtein Distance)**
- Dynamic Programming approach  
- Time Complexity: O(m × n)

**Cosine Similarity**
- Treats strings as character frequency vectors  
- Measures similarity based on vector angle  
- Time Complexity: O(m + n)

### 3. Scoring and Ranking

Each match type is assigned a weight:
- Exact match → 1.0  
- Prefix match → 0.8  
- Fuzzy match → 0.5  
- Semantic similarity → 0.4  

Pipeline:
- Aggregate results
- Deduplicate using a `Map`
- Sorte by score
- Return top matches

### 4. Performance Optimizations

- Debouncing using `useEffect` to limit unnecessary computations
- Early filtering based on input length
- Efficient data structures for lookup and deduplication

---

## DevOps & Tooling

- Implemented **CI pipeline using GitHub Actions**  
  - Automatically installs dependencies and builds the project on every push  
- **Dockerized application** using multi-stage builds  
  - Uses Node.js for build and Nginx for production serving

---

## Tech Stack

- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- GitHub Actions (CI)
- Docker

---

## Project Structure

src/
data/ # Emoji dataset and keyword index
utils/ # Levenshtein distance and cosine similarity implementations
App.jsx # Main application logic


---

## Running Locally

```bash
git clone https://github.com/YOUR_USERNAME/semantic-emoji-predictor.git
cd semantic-emoji-predictor
npm install
npm run dev
```

## Running with Docker

```bash
docker build -t semantic-emoji-predictor .
docker run -p 8080:80 semantic-emoji-predictor
```

Then open: http://localhost:8080

---

## Future Improvements

- Better stemming/tokenization (Porter stemmer or NLP library)
- Phrase-level semantic matching
- Emoji usage history / personalization
- Improved UI animations and feedback

---

## Author

Dheetchanya Mohan
