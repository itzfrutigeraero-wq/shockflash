// Auto-detect all SWF files in /games/ directory
async function loadGamesAutomatically() {
    try {
        // Fetch the games directory listing
        const response = await fetch('games/');
        const html = await response.text();
        
        // Parse HTML to find all .swf files
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        
        const swfFiles = [];
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.swf')) {
                swfFiles.push(href);
            }
        });
        
        return swfFiles;
    } catch (error) {
        console.log('Auto-detection not available, using local games list');
        return null;
    }
}

// Generate game data from SWF filename
function generateGameFromSwfFile(filename) {
    const name = filename.replace('.swf', '').replace(/-/g, ' ').replace(/_/g, ' ');
    const capitalizedName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const categories = ['action', 'puzzle', 'adventure', 'sports', 'strategy', 'casual'];
    const emojis = ['🎮', '🎯', '🎲', '🏆', '⚔️', '🧩', '🚀', '🌟'];
    
    return {
        id: Math.random(),
        title: capitalizedName,
        developer: 'Classic Flash Game',
        year: 2010,
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `${capitalizedName} - A classic Flash game. Click to play!`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        swf: `games/${filename}`
    };
}

let games = [
    {
        id: 1,
        title: "Flash Quest Adventure",
        developer: "FlashStudios Inc.",
        year: 2008,
        category: "adventure",
        description: "Embark on an epic journey through mystical lands. Solve puzzles and defeat monsters in this classic Flash adventure game.",
        emoji: "🗺️",
        swf: "games/quest.swf"
    },
    {
        id: 2,
        title: "Rocket Blast",
        developer: "ArcadeMasters",
        year: 2010,
        category: "action",
        description: "High-octane action shooter! Navigate through space and destroy asteroids. How high can you score?",
        emoji: "🚀",
        swf: "games/rocket.swf"
    },
    {
        id: 3,
        title: "Puzzle Paradise",
        developer: "LogicGames Ltd.",
        year: 2009,
        category: "puzzle",
        description: "Mind-bending puzzle game with colorful blocks and challenging levels. Test your logic skills!",
        emoji: "🧩",
        swf: "games/puzzle.swf"
    },
    {
        id: 4,
        title: "Soccer Star",
        developer: "SportGames Co.",
        year: 2011,
        category: "sports",
        description: "Score epic goals! Play as your favorite soccer team and compete for the championship.",
        emoji: "⚽",
        swf: "games/soccer.swf"
    },
    {
        id: 5,
        title: "Strategy War",
        developer: "StrategyMind Games",
        year: 2007,
        category: "strategy",
        description: "Command your armies and conquer the battlefield. A turn-based strategy game with deep gameplay.",
        emoji: "⚔️",
        swf: "games/strategy.swf"
    },
    {
        id: 6,
        title: "Candy Match",
        developer: "CasualPlay Inc.",
        year: 2012,
        category: "casual",
        description: "Match colorful candies and complete levels. A fun and addictive casual puzzle game!",
        emoji: "🍭",
        swf: "games/candy.swf"
    },
    {
        id: 7,
        title: "Jungle Runner",
        developer: "ActionStudio",
        year: 2009,
        category: "action",
        description: "Run through dangerous jungles, avoid obstacles, and collect treasures. Never stop moving!",
        emoji: "🐆",
        swf: "games/jungle.swf"
    },
    {
        id: 8,
        title: "Portal Puzzle",
        developer: "MindGame Studios",
        year: 2010,
        category: "puzzle",
        description: "Use portals to solve intricate puzzles. A brain-teaser that will challenge your mind!",
        emoji: "🌀",
        swf: "games/portal.swf"
    },
    {
        id: 9,
        title: "Zombie Defense",
        developer: "HorrorGames Ltd.",
        year: 2011,
        category: "action",
        description: "Defend your base against waves of zombies. Build towers and survive the apocalypse!",
        emoji: "🧟",
        swf: "games/zombie.swf"
    },
    {
        id: 10,
        title: "Racing Fury",
        developer: "SpeedGames Inc.",
        year: 2008,
        category: "sports",
        description: "Race at breakneck speeds! Compete in high-speed competitions across exotic tracks.",
        emoji: "🏎️",
        swf: "games/racing.swf"
    },
    {
        id: 11,
        title: "Chess Master",
        developer: "ClassicGames Co.",
        year: 2006,
        category: "strategy",
        description: "Challenge the computer in this classic chess game. Multiple difficulty levels available.",
        emoji: "♟️",
        swf: "games/chess.swf"
    },
    {
        id: 12,
        title: "Bubble Pop",
        developer: "CasualPlay Inc.",
        year: 2010,
        category: "casual",
        description: "Pop bubbles before they reach the top! A simple yet addictive casual game.",
        emoji: "🫧",
        swf: "games/bubbles.swf"
    }
];

let currentFilter = "all";
let currentGame = null;
let rufflePlayer = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Try to auto-detect SWF files
    const detectedFiles = await loadGamesAutomatically();
    
    // If we found SWF files, use them instead of default list
    if (detectedFiles && detectedFiles.length > 0) {
        games = detectedFiles.map(filename => generateGameFromSwfFile(filename));
    }
    
    renderGames();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderGames();
        });
    });

    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);

    // Close modal when clicking outside
    document.getElementById('gameModal').addEventListener('click', (e) => {
        if (e.target.id === 'gameModal') {
            closeModal();
        }
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

// Render games based on filter
function renderGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    const filteredGames = currentFilter === 'all' 
        ? games 
        : games.filter(game => game.category === currentFilter);

    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No games found in this category.</p>';
        return;
    }

    filteredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Create a game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-thumbnail">
            ${game.emoji}
        </div>
        <div class="game-card-content">
            <div class="game-card-title">${game.title}</div>
            <div class="game-card-meta">${game.developer}</div>
            <div class="game-card-meta">📅 ${game.year}</div>
            <div class="game-card-category">${capitalizeFirst(game.category)}</div>
        </div>
    `;
    card.addEventListener('click', () => openGameModal(game));
    return card;
}

// Open game modal with Ruffle player
function openGameModal(game) {
    currentGame = game;
    const modal = document.getElementById('gameModal');

    // Update modal content
    document.getElementById('modalGameTitle').textContent = game.title;
    document.getElementById('modalGameDeveloper').textContent = `by ${game.developer}`;
    document.getElementById('modalGameYear').textContent = game.year;
    document.getElementById('modalGameCategory').textContent = capitalizeFirst(game.category);
    document.getElementById('modalGameDescription').textContent = game.description;

    // Clear previous Ruffle player
    const ruffleContainer = document.getElementById('ruffleContainer');
    ruffleContainer.innerHTML = '';

    // Create Ruffle player
    const ruffleObject = document.createElement('div');
    ruffleObject.id = 'ruffle-player';
    ruffleObject.style.width = '100%';
    ruffleObject.style.height = '100%';
    ruffleContainer.appendChild(ruffleObject);

    // Initialize Ruffle player
    window.RufflePlayer.newest().createPlayer().then(player => {
        rufflePlayer = player;
        player.load({
            url: game.swf,
            allowScriptAccess: false,
            allowNetworking: 'none'
        }).catch(error => {
            // Fallback UI if SWF not found
            ruffleContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <p>🎮 Game Player Ready</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">SWF file: ${game.swf}</p>
                    <p style="font-size: 0.8rem; margin-top: 20px;">Add your SWF files to /games/</p>
                </div>
            `;
        });
        player.appendTo(ruffleObject);
    });

    // Setup buttons
    document.getElementById('fullscreenBtn').onclick = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.getElementById('ruffleContainer').requestFullscreen();
        }
    };

    document.getElementById('downloadBtn').onclick = () => {
        downloadFile(game.swf, `${game.title}.swf`);
    };

    modal.classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('gameModal').classList.remove('show');
    if (rufflePlayer) {
        rufflePlayer.destroy();
        rufflePlayer = null;
    }
    currentGame = null;
}

// Search games
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    const searchResults = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.developer.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );

    if (searchResults.length === 0) {
        gamesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No games found. Try a different search term.</p>';
        return;
    }

    searchResults.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });

    // Scroll to games section
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

// Download file helper
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
