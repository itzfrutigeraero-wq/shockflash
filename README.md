# ⚡ SHOCKFLASH

A museum and archive of classic Shockwave Flash games, powered by the **Ruffle emulator** to run SWF files in modern browsers.

## 🎮 Features

- **Game Archive**: Browse a curated collection of classic Flash games
- **Ruffle Integration**: Play SWF files safely without the Flash Player plugin
- **Category Filtering**: Filter games by type (Action, Puzzle, Adventure, Sports, Strategy, Casual)
- **Search Functionality**: Search games by title, developer, or description
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Modern UI**: Dark theme with vibrant neon accents inspired by the Flash era
- **Game Details**: View information about each game including year, developer, and description
- **Fullscreen Mode**: Play games in fullscreen for immersive experience

## 🔧 Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with gradients, animations, and flexbox/grid
- **JavaScript (Vanilla)**: No dependencies - pure JS for interactivity
- **Ruffle**: Open-source Flash Player emulator built in Rust and WebAssembly

## 📁 Project Structure

```
shockflash/
├── index.html          # Main page
├── css/
│   └── style.css       # Styling and animations
├── js/
│   └── script.js       # Game logic and Ruffle integration
├── assets/
│   └── games/          # SWF game files go here
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No Flash Player needed! Ruffle handles everything.

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/shockflash.git
cd shockflash
```

2. Serve the files (local file access may have CORS issues):
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js with http-server
npx http-server

# Or using PHP
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`

## 📚 Adding Games

1. Place your `.swf` files in the `assets/games/` directory
2. Edit `js/script.js` and add an entry to the `games` array:

```javascript
{
    id: 13,
    title: "Your Game Title",
    developer: "Developer Name",
    year: 2010,
    category: "action", // adventure, puzzle, sports, strategy, casual
    description: "A brief description of your game.",
    emoji: "🎮",
    swf: "games/yourfile.swf"
}
```

3. Save and refresh the page. Your game will appear in the archive!

## 🎨 Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #FF6B35;      /* Orange */
    --secondary-color: #004E89;    /* Blue */
    --accent-color: #00D9FF;       /* Cyan */
    --dark-bg: #0A0E27;            /* Dark purple */
    --light-bg: #1a1f3a;           /* Light purple */
}
```

### Categories
Add or modify categories in the filter buttons section of `index.html` and corresponding styles in `js/script.js`

## ⚙️ Ruffle Emulator

**What is Ruffle?**
Ruffle is an open-source Flash Player emulator that allows SWF files to run in modern browsers without the deprecated Flash Player plugin. It's written in Rust and compiled to WebAssembly.

**Resources:**
- [Ruffle Project](https://ruffle.rs)
- [GitHub Repository](https://github.com/ruffle-rs/ruffle)

## 📝 What is Shockwave Flash (SWF)?

SWF stands for **Small Web Format** and was the file format used by Adobe Flash to deliver:
- Interactive web applications
- Animations
- Games
- Rich multimedia content

Flash was ubiquitous on the web from the 1990s through the 2010s until HTML5 and modern web standards replaced it. These SWF files represent an important part of internet history!

## 🛡️ Security & Sandboxing

- Games run in the Ruffle sandbox with limited network access
- No Flash plugin vulnerabilities - Ruffle is memory-safe
- Games cannot access your computer or personal data
- All execution happens client-side in your browser

## 📄 License

This project is open source and available under the MIT License.

Games included are for educational and preservation purposes. Please respect original creators' intellectual property rights.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more games to the archive
- Improve the UI/UX
- Fix bugs
- Add new features

## 🎯 Future Enhancements

- [ ] User ratings and reviews
- [ ] Game statistics tracker
- [ ] Multiplayer support (where applicable)
- [ ] Advanced search filters
- [ ] Game recommendations
- [ ] Social sharing features
- [ ] Dark/Light theme toggle

## 📞 Support

For issues or questions:
1. Check the [Ruffle documentation](https://github.com/ruffle-rs/ruffle/wiki)
2. Open an issue on GitHub
3. Check if your SWF file is compatible with Ruffle

---

**SHOCKFLASH** - Preserving the Golden Age of Flash Gaming ⚡