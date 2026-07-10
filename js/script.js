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
        console.log('Reading games directory...');
        return [];
    }
}

// Generate game data from SWF filename
function generateGameFromSwfFile(filename) {
    const name = filename.replace('.swf', '').replace(/-/g, ' ').replace(/_/g, ' ');
    const capitalizedName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const categories = ['action', 'puzzle', 'adventure', 'sports', 'strategy', 'casual'];
    const emojis = ['🎮', '🎯', '🎲', '🏆', '⚔️', '🧩', '🚀', '🌟', '🎪', '🎭', '🎨', '🎬'];
    
    return {
        id: Math.random(),
        title: capitalizedName,
        developer: 'Published Game',
        year: new Date().getFullYear(),
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `${capitalizedName} - A classic Flash game preserved on SHOCKFLASH.`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        swf: `games/${filename}`
    };
}

let games = [];

let currentFilter = "all";
let currentGame = null;
let rufflePlayer = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Load all SWF files from /games/ directory
    const swfFiles = await loadGamesAutomatically();
    
    if (swfFiles.length > 0) {
        games = swfFiles.map(filename => generateGameFromSwfFile(filename));
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

    if (games.length === 0) {
        gamesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No games yet. Add SWF files to /games/ to publish them here forever!</p>';
        return;
    }

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
                    <p>⚠️ Game Not Found</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">File: ${game.swf}</p>
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
