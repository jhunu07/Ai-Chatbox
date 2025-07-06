# 🤖 Smart AI Chat Assistant using React and Dolphin-Phi (Ollama)

## 📌 Project Overview

This is a lightweight, local AI chatbot built using React and Dolphin-Phi (via Ollama) that runs completely offline on your computer, mimics a chat application UI, and stores chat history in the browser.

---

## 🔧 Tech Stack

| Component         | Technology             |
| ----------------- | ---------------------- |
| Frontend UI       | React.js               |
| Styling           | CSS (chat layout)      |
| AI Model          | Dolphin-Phi via Ollama |
| API Communication | Fetch + Stream         |
| Storage           | Browser localStorage   |

---

## 🚀 Features

### ✅ Chat-Like UI

* WhatsApp-style bubbles
* User and bot avatars
* Auto-scroll to latest message

### ✅ AI Model Integration

* Powered by `dolphin-phi` using Ollama
* Streams answers token-by-token
* Fully offline (runs on `localhost`)

### ✅ Persistent Chat

* Saves all messages to `localStorage`
* Restores chat on page refresh

### ✅ Responsive & Interactive

* "Enter" to send messages
* Cancel button to stop long replies

---

## 🧠 About Dolphin-Phi

* A fine-tuned version of Microsoft's Phi model
* Trained for reasoning, instructions, and basic Q\&A
* Ideal for systems with **4 GB RAM or less**

---

## 🛠️ Setup Instructions

### 1. Install Ollama

[https://ollama.com/download](https://ollama.com/download)

```bash
ollama pull dolphin-phi
ollama run dolphin-phi
```

### 2. Run React App

```bash
npm install
npm start
```

Ensure Ollama is running on `localhost:11434`

---

## 📁 Project Structure

```
react-chatbot/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

---

## 🔍 Example Use Cases

* General chat: "Tell me a joke."
* Health advice: "What causes a fever?"
* Coding help: "Write a JS function to reverse a string."
* Math help: "What's the square root of 144?"

---

## ✅ What You Learned

* React component structure
* Handling streaming API responses
* Local model deployment with Ollama
* Chat history management with `localStorage`
* Building chat-style UX in React

---

## 📈 Future Improvements

* Dark mode
* Clear chat button
* Upload file for Q\&A
* Voice input/output
* Save chat to backend (MongoDB/Firebase)

---


## 📜 License

MIT License
