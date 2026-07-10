// Auto-detect all SWF files in /games/ directory
async function loadGamesAutomatically() {
    try {
        const response = await fetch('games/');
        const html = await response.text();
        
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
let selectedFile = null;

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
    setupUploadZone();
});

// Setup upload zone
function setupUploadZone() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const publishBtn = document.getElementById('publishBtn');

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.swf')) {
            selectedFile = file;
            showFileSelected(file.name, uploadZone);
        } else {
            showStatus('❌ Please drop a .SWF file!', 'error');
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFile = file;
            showFileSelected(file.name, uploadZone);
        }
    });

    // Publish button
    publishBtn.addEventListener('click', () => {
        if (!selectedFile) {
            showStatus('❌ Please select a .SWF file first!', 'error');
            return;
        }
        publishGame(selectedFile);
    });
}

function showFileSelected(filename, uploadZone) {
    const uploadContent = uploadZone.querySelector('.upload-content');
    uploadContent.innerHTML = `
        <div style="color: var(--accent-color); font-weight: 600; font-size: 1.1rem;">
            ✅ File Selected: ${filename}
        </div>
        <p style="margin-top: 10px; font-size: 0.9rem; color: var(--text-muted);">Click "PUBLISH GAME" button below to upload</p>
    `;
    showStatus('', 'clear');
}

// Publish the selected game
async function publishGame(file) {
    // Check file size
    if (file.size > 50 * 1024 * 1024) {
        showStatus('❌ File is too large! Maximum 50MB allowed.', 'error');
        return;
    }

    showStatus('📤 Publishing your game...', 'uploading');

    try {
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64File = e.target.result.split(',')[1];
            
            try {
                const response = await fetch('/.netlify/functions/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: file.name,
                        file: base64File
                    })
                });

                if (response.ok) {
                    showStatus('✅ Game published forever! Refreshing...', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    showStatus('❌ Upload failed. Make sure you deployed to Netlify!', 'error');
                }
            } catch (error) {
                console.error('Upload error:', error);
                showStatus('❌ Upload failed. Try deploying to Netlify with serverless functions enabled.', 'error');
            }
        };
        reader.readAsDataURL(file);

    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Something went wrong. Please try again.', 'error');
    }
}

// Show upload status
function showStatus(message, type) {
    const statusDiv = document.getElementById('uploadStatus');
    const successDiv = document.getElementById('uploadSuccess');
    const messageEl = document.getElementById('statusMessage');

    if (type === 'clear') {
        statusDiv.style.display = 'none';
        successDiv.style.display = 'none';
    } else if (type === 'success') {
        successDiv.style.display = 'block';
        successDiv.querySelector('p').textContent = message;
        statusDiv.style.display = 'none';
    } else {
        statusDiv.style.display = 'block';
        messageEl.textContent = message;
        successDiv.style.display = 'none';
    }
}

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
        gamesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No games published yet. Go to Publish tab and upload a SWF file!</p>';
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

    document.getElementById('modalGameTitle').textContent = game.title;
    document.getElementById('modalGameDeveloper').textContent = `by ${game.developer}`;
    document.getElementById('modalGameYear').textContent = game.year;
    document.getElementById('modalGameCategory').textContent = capitalizeFirst(game.category);
    document.getElementById('modalGameDescription').textContent = game.description;

    const ruffleContainer = document.getElementById('ruffleContainer');
    ruffleContainer.innerHTML = '';

    const ruffleObject = document.createElement('div');
    ruffleObject.id = 'ruffle-player';
    ruffleObject.style.width = '100%';
    ruffleObject.style.height = '100%';
    ruffleContainer.appendChild(ruffleObject);

    window.RufflePlayer.newest().createPlayer().then(player => {
        rufflePlayer = player;
        player.load({
            url: game.swf,
            allowScriptAccess: false,
            allowNetworking: 'none'
        }).catch(error => {
            ruffleContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <p>⚠️ Game Not Found</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">File: ${game.swf}</p>
                </div>
            `;
        });
        player.appendTo(ruffleObject);
    });

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
