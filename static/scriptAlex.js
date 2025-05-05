// scriptAlex.js - Updated version
document.addEventListener("DOMContentLoaded", () => {
    initializeButtons();
    setupDarkModeToggle();
    setupViewMoreButtons();
    setupAddGameButton();
    initializeButtonStates();
});

function initializeButtons() {
    // Handle all favorite buttons
    document.querySelectorAll('.favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameId = button.getAttribute('data-id');
            toggleFavorite(gameId, button);
        });
    });

    // Handle all played buttons
    document.querySelectorAll('.played').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameId = button.getAttribute('data-id');
            togglePlayed(gameId, button);
        });
    });

    // Handle all trophy buttons
    document.querySelectorAll('.trophy').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameId = button.getAttribute('data-id');
            toggleTrophy(gameId, button);
        });
    });

    // Handle all delete buttons
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameId = button.getAttribute('data-id');
            if (confirm("¿Estás seguro de que quieres eliminar este juego?")) {
                deleteGame(gameId, button.closest('.game-card'));
            }
        });
    });
}

function toggleFavorite(gameId, button) {
    fetch(`/api/mark_as_favorite/${gameId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateFavoriteButton(button, data.juego.favorito);
                // Reload if on a filtered page (favorites, played, platinos)
                if (window.location.pathname.includes('favorites') && !data.juego.favorito) {
                    button.closest('.game-card').remove();
                }
            }
        });
}

function togglePlayed(gameId, button) {
    fetch(`/api/mark_as_played/${gameId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updatePlayedButton(button, data.juego.jugado);
                // Reload if on played page and status changed
                if (window.location.pathname.includes('played') && !data.juego.jugado) {
                    button.closest('.game-card').remove();
                }
            }
        });
}

function toggleTrophy(gameId, button) {
    fetch(`/api/mark_as_platinum/${gameId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateTrophyButton(button, data.juego.platino);
                // Reload if on platinos page and status changed
                if (window.location.pathname.includes('platinos') && !data.juego.platino) {
                    button.closest('.game-card').remove();
                }
            }
        });
}

function deleteGame(gameId, gameCard) {
    fetch(`/api/delete_game/${gameId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                gameCard.remove();
            }
        });
}

function setupViewMoreButtons() {
    document.querySelectorAll('.view-more-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameCard = button.closest('.game-card');
            const commentsShort = gameCard.querySelector('.comments-short');
            const commentsFull = gameCard.querySelector('.comments-full');
            
            if (commentsFull.style.display === 'none' || !commentsFull.style.display) {
                commentsFull.style.display = 'block';
                commentsShort.style.display = 'none';
                button.textContent = '▲';
            } else {
                commentsFull.style.display = 'none';
                commentsShort.style.display = 'block';
                button.textContent = '▼';
            }
        });
    });
}

function setupAddGameButton() {
    const addGameBtn = document.getElementById('addGameBtn');
    if (addGameBtn) {
        addGameBtn.addEventListener('click', function() {
            window.location.href = this.getAttribute('data-url');
        });
    }
}

function setupDarkModeToggle() {
    const toggle = document.getElementById('darkmode-toggle');
    if (toggle) {
        const body = document.body;
        
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
            }
        });

        if (toggle.checked) {
            body.classList.add('dark-mode');
        }
    }
}

// Button style update functions (keep these the same as before)
function updateFavoriteButton(button, isFavorite) {
    if (isFavorite) {
        button.classList.add('clicked');
        button.style.backgroundColor = "transparent";
        button.style.color = "#2D3250";
    } else {
        button.classList.remove('clicked');
        button.style.backgroundColor = "";
        button.style.color = "";
        button.style.border = "";
    }
}

function updatePlayedButton(button, isPlayed) {
    if (isPlayed) {
        button.classList.add('clicked');
        button.style.backgroundColor = "#A3D9A5";
        button.style.color = "#2D3250";
        button.style.border = `2px solid #A3D9A5`;
    } else {
        button.classList.remove('clicked');
        button.style.backgroundColor = "";
        button.style.color = "";
        button.style.border = "";
    }
}

function updateTrophyButton(button, isPlatinum) {
    if (isPlatinum) {
        button.classList.add('clicked');
        button.style.backgroundColor = "transparent";
        button.style.color = "#2D3250";
    } else {
        button.classList.remove('clicked');
        button.style.backgroundColor = "";
        button.style.color = "";
        button.style.border = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeButtons();
    setupDarkModeToggle();
    setupViewMoreButtons();
    setupAddGameButton();
    initializeButtonStates(); // Add this line
});

// Add this new function
function initializeButtonStates() {
    document.querySelectorAll('.favorite').forEach(button => {
        const isFavorite = button.classList.contains('clicked');
        updateFavoriteButton(button, isFavorite);
    });

    document.querySelectorAll('.played').forEach(button => {
        const isPlayed = button.classList.contains('clicked');
        updatePlayedButton(button, isPlayed);
    });

    document.querySelectorAll('.trophy').forEach(button => {
        const isPlatinum = button.classList.contains('clicked');
        updateTrophyButton(button, isPlatinum);
    });
}