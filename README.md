# Lorrin Crazy Eights

A Dunhuang-styled Crazy Eights card game built with React, Tailwind CSS, and Framer Motion.

## Features

- **Dunhuang Aesthetic**: Beautiful card designs inspired by Dunhuang murals.
- **AI Opponent**: Play against a smart AI.
- **Smooth Animations**: Powered by Framer Motion.
- **Responsive Design**: Works on mobile and desktop.

## Deployment to Vercel

This project is ready to be deployed to Vercel.

1.  **Push to GitHub**:
    -   Initialize a git repository: `git init`
    -   Add files: `git add .`
    -   Commit: `git commit -m "Initial commit"`
    -   Create a repository on GitHub.
    -   Push your code: `git remote add origin <your-repo-url> && git push -u origin main`

2.  **Deploy on Vercel**:
    -   Go to [Vercel](https://vercel.com).
    -   Click "Add New Project".
    -   Import your GitHub repository.
    -   Vercel will automatically detect the Vite framework.
    -   **Important**: Add your `GEMINI_API_KEY` in the "Environment Variables" section if you plan to use AI features that require it (though the current game logic runs client-side without API calls).
    -   Click "Deploy".

## Local Development

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev`
3.  Open `http://localhost:3000` in your browser.

## License

Apache-2.0
