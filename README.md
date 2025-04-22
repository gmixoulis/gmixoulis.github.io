# 🚀 George Michoulis – Developer Portfolio Platform

Welcome to the source code of my developer platform — live at [gmixoulis.github.io](https://gmixoulis.github.io/).

This is not just a personal website. It's a fully automated, AI-integrated, CI/CD-powered **portfolio-as-a-platform**. It evolves with me, showcases my skills dynamically, and publishes new content without lifting a finger.

![George Michoulis Portfolio Banner](public/banner.png)

## 🌟 Platform Highlights

### 🖼 Dynamic Certificate Gallery (Auto-Populated with AI)
- All certifications are uploaded as raw images into `public/img/certificates/`.
- A custom Node.js script powered by **Google Gemini API**:
  - Reads and understands each certificate
  - Automatically generates a filename, title, and description (SEO-optimized)
  - Classifies certificates as degrees, English proficiency, professional courses, etc.
- Output files are saved into `/renamed/`, which powers a live React gallery using:
  - [`react-photo-gallery`](https://github.com/neptunian/react-photo-gallery)
  - Lightbox & Carousel via `react-images`
  - Automatically grouped visually by type (Master's, Bachelor's, Awards, etc.)

### 📸 Multiple Visual Systems & Effects
- **Hero slider**, image carousels, and parallax effects throughout
- Dynamic snowfall, animated text typing, and circular progress components
- Smooth scroll navigation + animated counters
- All interactive, responsive, and optimized for mobile and desktop

### 📥 Social & Content Integration
- **Live content from SociableKIT widgets** — connected to my YouTube, LinkedIn, Google Reviews, and more
- Dynamic testimonials and social proof are fetched and displayed from trusted platforms
- Maintains up-to-date presence without manual editing

---

## 🤖 AI + Automation

### 📦 Intelligent File Renaming with Gemini
- Files like `certificate3.jpg` become:
  `1Bachelor-Degree_Bachelor-Degree-Applied-Informatics-2021.jpg`
- Gemini decides if it’s a Master’s, a Workshop, or an Award
- Contextual disambiguation of duplicate events (e.g., `Google-Grow-Tourism-Online-2`)

### 🛠 GitHub Actions – Full CI/CD
- Auto-triggers on:
  - New certificates pushed
  - Script updates
  - Manual dispatch (`workflow_dispatch`)
- Steps:
  1. Cleans and installs with Yarn
  2. Installs missing AI dependencies in CI
  3. Runs AI renaming script
  4. Commits changes (if any)
  5. Deploys to GitHub Pages — no manual deploy ever needed

---

## 💡 Platform Design Philosophy

This platform is designed to:

- 💬 **Tell a visual story** of who I am and what I’ve achieved
- 🧠 **Leverage AI to reduce content management overhead**
- ⚙️ **Demonstrate real engineering principles**:
  - Automation
  - Integration
  - Versioning
  - Clean UI/UX
- 🧩 Serve as a living CV — auto-updating, interactive, and professional

---

## 🛠 Stack & Skills Showcased

| Category | Tech |
|---------|------|
| 💻 Frontend | React 18, React Router, Bootstrap 5, AOS, Sass |
| 🧠 AI Integration | Google Gemini API (Vision-to-Text automation) |
| ⚙️ Automation | Node.js scripting, GitHub Actions, Yarn |
| 🖼 Visual Effects | `react-photo-gallery`, `react-images`, `react-snowfall`, `react-typed`, parallax |
| 📲 Content APIs | [SociableKIT](https://www.sociablekit.com/) integrations |
| 🌍 Hosting | GitHub Pages + CI auto-deploy |
| 🔐 DevOps | Environment secrets, deployment via PAT, smart file deduplication |
| 📁 File Management | AI-generated filenames, folder cleanup, alt text generation, international character handling |

---

## 📈 Value Delivered

✅ No more manual renaming or uploads  
✅ No more deployment commands  
✅ No SEO-wasting filenames  
✅ New cert? Just push → get listed, described, published  
✅ Powerful showcase of my technical skill, design sensibility, and automation mindset

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/gmixoulis/gmixoulis.github.io.git
cd gmixoulis.github.io

# Install dependencies
yarn install

# Add your Gemini API key
export GEMINI_API_KEY=your_key_here

# Run the auto-renamer (optional)
node scripts/rename_auto.js

# Start the dev server
yarn start
```

Or simply drop your cert into /public/img/certificates/ and push. GitHub will do the rest.

# 🔮 What's Next?

The current version is based on Create React App (CRA).  
The next version will be rebuilt in **Next.js (App Router)** with:

- Server components
- File system routing
- Optimized image rendering
- Middleware automation for AI pipeline
- Better SEO and SSR capabilities

# 🧠 Why This Matters

This platform goes beyond a portfolio:

- It's an AI-powered, auto-updating proof of work
- It showcases real engineering practices:
  - Automation
  - Deployment
  - AI integration
  - External data sourcing
- It’s a living CV that evolves with me — no rebuilds required

# 🙌 Built With ❤️ by George Michoulis
If you'd like to collaborate, share feedback, or remix this, reach out:

📫 [gmixoulis@gmail.com](mailto:gmixoulis@gmail.com)  
🌐 [gmixoulis.github.io](https://gmixoulis.github.io)  
🔗 [LinkedIn](https://linkedin.com/in/your-profile)
