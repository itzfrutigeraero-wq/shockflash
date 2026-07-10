# ⚡ SHOCKFLASH

A museum and archive of classic Shockwave Flash games. Play them directly in your browser!

## 🎮 Live Features

- **Play Instantly**: No installation, no Python, no setup
- **Ruffle Emulator**: Modern Flash player for SWF files
- **Search & Filter**: Find games by category or name
- **No Downloads Needed**: Everything works in the browser
- **Mobile Friendly**: Play on any device

## 🚀 How to Use

Just open **index.html** in your browser or visit the GitHub Pages link below.

That's it! No setup required. No Python. No installation. Just click and play!

## 📁 Game Files

All SWF game files are stored in the `/games/` directory and are ready to play immediately.

## 🎨 How It Works

- Uses **Ruffle** (open-source Flash emulator)
- Runs in WebAssembly for speed and safety
- All processing happens in your browser
- No server needed

## 📝 To Add More Games

1. Place your `.swf` file in the `/games/` folder
2. Edit `js/script.js` and add to the games array:

```javascript
{
    id: 13,
    title: "Game Name",
    developer: "Developer",
    year: 2010,
    category: "action", // or puzzle, adventure, sports, strategy, casual
    description: "Game description",
    emoji: "🎮",
    swf: "games/filename.swf"
}
```

3. Refresh your browser - done!

## 🌐 Deploy to GitHub Pages

1. Go to your repo Settings → Pages
2. Select `main` branch as source
3. Your site is live at: `https://itzfrutigeraero-wq.github.io/shockflash/`

---

**SHOCKFLASH** - Preserving Classic Flash Games ⚡
