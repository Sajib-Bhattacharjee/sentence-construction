#

<div align="center">

# 🛍️ **Sentence Construction Tool** 🛍️

An interactive educational application designed to help users practice sentence construction by arranging words in the correct order.

#### 🌟 **Live Preview** → [**Sentence Constructor**](https://sentenceconstructionbysbc.netlify.app/) 💕

🎉 Click to explore the fun and laughter! 😄

</div>

---

## 📘 Project Overview

The **Sentence Construction Tool** is an educational quiz application that challenges users to construct proper sentences by selecting appropriate words and placing them in the correct order. It offers an engaging way to improve language skills with timed exercises, immediate feedback, and a scoring system to track progress.

## ✨ Features & Functionality

- 🧩 **Interactive Quiz Interface**: Drag-and-drop sentence exercises
- 🧠 **Multiple Question Types**: Challenges with varying complexity
- ⏱️ **Timed Exercises**: 60-second timer per question
- 📊 **Progress Tracking**: Completion percentage visualization
- 💡 **Hint System**: Optional clues for stuck users
- 🧾 **Detailed Feedback**: Correct & incorrect answer review
- 🏆 **Score Calculation**: Points based on accuracy & time
- 📤 **Results Sharing**: Social media & image download
- 🌙 **Dark Mode Support**: Toggle for light/dark themes
- 🔊 **Sound Effects**: Audio for answers & completion
- 🎹 **Keyboard Navigation**: Full keyboard accessibility
- 📱 **Responsive Design**: Works across all screen sizes

## 🛠️ Tech Stack

- ⚛️ **Frontend**: React 18, TypeScript
- 🎨 **Styling**: Tailwind CSS
- ⚡ **Build Tool**: Vite
- 🔄 **State Management**: Context API + useReducer
- 🗃️ **Backend Mock**: JSON Server
- 🎉 **Animation**: React Confetti
- 🖼️ **Image Generation**: html2canvas
- 🔈 **Sound**: Custom audio system

## 📁 Folder Structure

```
sentence-construction-tool/
├── public/             # 📂 Static assets
├── src/
│   ├── components/     # 🧱 React components
│   │   ├── FeedbackScreen.tsx    # 📝 Quiz results
│   │   ├── LandingPage.tsx       # 🚀 Entry point
│   │   ├── LoadingSpinner.tsx    # 🔄 Spinner
│   │   ├── ProgressBar.tsx       # 📊 Quiz progress
│   │   ├── Quiz.tsx              # 🧪 Main quiz
│   │   ├── QuestionDisplay.tsx   # ❓ Question UI
│   │   ├── SettingsPanel.tsx     # ⚙️ User settings
│   │   └── Timer.tsx             # ⏱️ Countdown timer
│   ├── context/        # 🧠 App state
│   │   └── QuizContext.tsx
│   ├── services/       # 🌐 API & sound
│   │   ├── api.ts
│   │   └── soundEffects.ts
│   ├── types/          # 🧾 TypeScript types
│   ├── App.css         # 🎨 Global styles
│   ├── App.tsx         # 🧩 Root component
│   ├── index.css       # 🎨 Base style imports
│   └── main.tsx        # 🚀 Entry file
├── db.json             # 💾 Mock DB
├── tailwind.config.js  # 🎨 Tailwind config
├── tsconfig.json       # ⚙️ TypeScript config
├── package.json        # 📦 Dependencies
├── vite.config.ts      # ⚡ Vite config
└── README.md           # 📘 Documentation
```

## 🧑‍💻 Setup & Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/sentence-construction-tool.git
cd sentence-construction-tool

# 2️⃣ Install dependencies
npm install

# 3️⃣ Add environment variables (if needed)
echo "VITE_API_URL=http://localhost:3001" > .env
```

## 🚀 Running the App

### 🔧 Local Development

```bash
# Start mock server
npm run server

# Start app
npm run dev
```

👉 Open [http://localhost:5173](http://localhost:5173)

### 🏁 Production Build

```bash
# Build app
npm run build

# Preview production
npm run preview
```

## 🔌 API & Data Source Details

### Sample API Response:

```json
{
  "status": "success",
  "data": {
    "testId": "sentence-1",
    "questions": [
      {
        "questionId": "q1",
        "question": "The cat _____________ on the _____________ mat.",
        "questionType": "fillInBlanks",
        "answerType": "multipleChoice",
        "options": ["sat", "dog", "mat", "fat"],
        "correctAnswer": ["sat", "mat"]
      }
    ]
  },
  "activity": {
    "id": "activity-1",
    "userId": "user-1",
    "type": "SENTENCE_CONSTRUCTION_TEST",
    "coinType": "FREE",
    "coins": 20,
    "description": "Sentence Construction Test",
    "createdAt": "2023-07-01T12:00:00Z"
  }
}
```

## 🔄 State Management Explanation

- 📦 **QuizContext**: Central data storage
- 🔁 **useReducer**: Handles all updates
- 🚦 **Actions**: Triggered events (e.g., NEXT_QUESTION)
- 🌐 **Effects**: Async operations (API, audio, timer)

## 🧱 Component Breakdown

- **LandingPage** → 🌟 Entry info & settings
- **Quiz** → 🧪 Main quiz logic
- **QuestionDisplay** → ❓ Shows current question
- **ProgressBar** → 📊 Visual progress
- **Timer** → ⏱️ Countdown logic
- **FeedbackScreen** → 📝 Quiz results
- **SettingsPanel** → ⚙️ Dark mode, sound toggle
- **LoadingSpinner** → 🔄 Loading feedback

## 🌙 Dark Mode Implementation

- 💡 Theme Context: Tracks user preference
- 🗂️ Local Storage: Stores selection
- 🖥️ System Detection: Uses OS theme
- 🎨 Tailwind CSS: Class-based theming
- 🎞️ Smooth Transitions: Clean toggling

## ⏲️ Timer Logic

1. 🆕 Starts at 60 seconds per question
2. 🔁 Auto-progress if time runs out
3. 🎨 Color alert based on time left
4. ⏸️ Pauses during settings/feedback
5. 📟 MM:SS display format
6. 🔔 10-sec warning sound

## 🧮 Scoring & Feedback

- ✅ Accuracy-based
- 🔘 All blanks required
- 🧾 Detailed feedback per question
- 🟢/🔴 Color-coded results
- 🎊 Confetti celebration
- 📈 Summary screen
- 📤 Share/download option

## 📱 Responsiveness Strategy

- 📱 Mobile-first approach
- 🔠 Fluid text sizes
- 🔲 Adaptive layouts (flex/grid)
- 📏 Tailwind breakpoints
- 🤏 Touch-friendly elements
- ⌨️ Keyboard accessible

## ♿ Accessibility Features

- ⌨️ Full keyboard nav
- 🏷️ ARIA support
- 👁️ Focus indicators
- 🌈 Color contrast (WCAG AA)
- 📷 Alt text
- 🏛️ Semantic HTML
- 🌀 Reduced motion support

## 🧪 Testing Instructions

### ✅ Unit Tests

```bash
npm test
```

### 🧪 E2E Tests

```bash
npm run test:e2e
```

### 📋 Manual Test Checklist

- ✔️ Complete full quiz
- ✔️ Toggle dark mode
- ✔️ Use keyboard navigation
- ✔️ Test on various screens
- ✔️ Validate timer behavior

## 🚀 Deployment Guide

1. 🏗️ Build app: `npm run build`
2. 📤 Host (Netlify/Vercel)
   - Build command: `npm run build`
   - Publish directory: `dist`
3. 🖥️ Traditional Hosting:
   - Upload `dist/`
   - Redirect all routes to `index.html`
4. 🔑 Set production API URL in `.env`

## 🐛 Known Issues

- 🔁 Timer keeps running on tab change
- 🧠 Limited questions (demo only)
- 🙅‍♂️ No login/user tracking
- 📵 Audio restrictions on some mobiles
- 🐢 Confetti slow on low-end devices

## 🔮 Future Enhancements

- 👤 User accounts & profiles
- 📚 Larger question bank
- 🏆 Leaderboards
- 📊 Analytics & insights
- 📴 Offline support
- 📱 React Native app
- 🎓 LMS integration
- 🎨 Custom themes

## 🤝 Contribution Guide

```bash
# 1. Fork project
# 2. Create branch → git checkout -b feature/amazing-feature
# 3. Commit changes → git commit -m "Add amazing feature"
# 4. Push branch → git push origin feature/amazing-feature
# 5. Submit PR ✅
```

🧪 Follow coding standards and include tests

## 📄 License

This project is licensed under the **MIT License** – see LICENSE file for details

## 🙋 Author & Contact

<div align="center">

🛡️ `All rights reserved by Sajib Bhattacharjee @2025`

### 👨‍💻 `Created with ❤️ by →`

✨ **Sajib Bhattacharjee** ✨

**💖 Dedicated to "Sir! Anisul Islam" 💖**

🙏 **Thanks a Lot for Visiting**

🌐 [**Portfolio**](https://sajibbhattacharjee.netlify.app)    
💼 [**LinkedIn**](https://www.linkedin.com/in/sajib-bhattacharjee-42682a178/)    
📧 [**Email Me**](mailto:sajibbhattacjarjee2000@gmail.com)

</div>

---
