# 🌎 Niural PEO MHP Carrier Availability Map

**An interactive D3.js-powered visualization of U.S. carrier availability and restrictions, developed by Niural AI.**

This web app allows users to explore nationwide carrier data in a visual, intuitive way — highlighting compliance, restrictions, and metadata for each state. It supports dark/light themes, live search, tooltips, and export options.

---

## 🚀 Live Demo

🔗 **View here:** [https://your-username.github.io/niural-us-carrier-map/](https://your-username.github.io/niural-us-carrier-map/)

---

## 🧠 Overview

The Niural US Carrier Map is a **fully client-side D3.js application** designed for simplicity, performance, and visual clarity.  
It reads configuration and data files from the `/data` directory, then dynamically renders an SVG map with legends, filters, and state-level tooltips.

---

## 🗂️ Project Structure

```

/
├── index.html               # Main entry point
├── assets/
│   ├── css/
│   │   └── style.css        # Custom styling and themes
│   └── js/
│       └── main.js          # Core D3.js visualization logic
└── data/
├── appConfig.json       # Application configuration (legends, colors, etc.)
└── stateData.json       # Carrier/state data loaded dynamically

````

---

## 🧩 Key Features

- 🗺️ **Interactive Map** — D3.js SVG rendering with responsive scaling  
- 🎨 **Dynamic Legend** — Automatically updates based on available carriers or status  
- 🌗 **Dark / Light Mode** — Smooth theme toggle with saved preference  
- 🔍 **Search / Filter** — Quickly locate a specific U.S. state  
- 🧾 **Tooltips** — Context-aware hover details for each state  
- 📤 **Export Map** — One-click download of the current map as an image  
- ⚡ **Zero Dependencies** — No backend, all static assets hosted via GitHub Pages  
- 📱 **Responsive Design** — Optimized for desktop and large-screen devices  

---

## 🛠️ Technology Stack

| Layer | Tools Used |
|-------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Visualization** | [D3.js v7](https://d3js.org/), [TopoJSON](https://github.com/topojson/topojson) |
| **Hosting** | GitHub Pages (static deployment) |
| **Data Format** | JSON (config and state data) |

---

## ⚙️ Setup & Local Development

You can run this project locally in under a minute.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/niural-us-carrier-map.git
cd niural-us-carrier-map
````

### 2️⃣ Open Locally

Just open `index.html` in your browser.
No build tools, servers, or installations are required.

Or, if you prefer using a simple local server (for testing JSON fetches):

```bash
# Using Python 3
python -m http.server 8000
# Then visit: http://localhost:8000
```

---

## 🌐 Deployment (GitHub Pages)

1. Push your project to a **public GitHub repository**
2. Go to **Settings → Pages**
3. Set:

   * Source: `Deploy from branch`
   * Branch: `main`
   * Folder: `/ (root)`
4. Save → Your live site will appear at:
   `https://your-username.github.io/niural-us-carrier-map/`

---

## 🧰 Configuration

`data/appConfig.json` defines map behavior and legend colors.
Example:

```json
{
  "defaultCarrier": "Aetna",
  "largeGroup101": ["CA", "CO", "NY", "VT"],
  "restrictedStates": {
    "HI": { "salesNotes": "Aetna not available for PEOs" }
  }
}
```

`data/stateData.json` contains per-state carrier attributes.

---

## 🎨 Theming & Styling

Modify `assets/css/style.css` to customize:

* Map colors
* Legend positioning
* Typography
* Theme transition effects

For example, to adjust the map size:

```css
.map-container {
  height: min(90vh, 1100px);
}
```

---

## 📦 Optional Enhancements

Potential improvements:

* 🧭 Add zoom/pan interaction
* 💾 Persist last viewed state
* 🧠 Integrate carrier filters (multi-select dropdown)
* 📊 Display analytics or region summaries

---

## 👨‍💻 Authors & Maintainers

Developed by **Niural AI**
Maintained by [@your-github-username](https://github.com/your-github-username)

---

## 📜 License

This project is released under the **MIT License** — free for personal and commercial use with attribution.

---

## 🏷️ Metadata

| Field              | Value                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| **Version**        | 1.0.0                                                                       |
| **Last Updated**   | October 2025                                                                |
| **Primary Author** | Rabin (Niural AI)                                                           |
| **Repository**     | [GitHub](https://github.com/your-username/niural-us-carrier-map)            |
| **Demo URL**       | [GitHub Pages Link](https://your-username.github.io/niural-us-carrier-map/) |

---

### ❤️ Acknowledgments

Special thanks to the **D3.js community** and **Open Source GIS contributors** for the tools and inspiration that make visual storytelling with data possible.

```

---

Would you like me to also generate a **matching `.gitignore`** (with rules for web projects: `.DS_Store`, VSCode, temp files, etc.) and a **short description line for your repo** (for the GitHub summary box)?
```
