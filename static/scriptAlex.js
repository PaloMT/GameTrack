// scriptAlex.js - Updated version
document.addEventListener("DOMContentLoaded", () => {
    initializeButtons();
    setupDarkModeToggle();
    setupViewMoreButtons();
    setupAddGameButton();
    initializeButtonStates();
    setupPlatinumList(); // Consolidate platinum list initialization here
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
                const gameCard = button.closest('.game-card');
                deleteGame(gameId, gameCard);
            }
        });
    });
}

function toggleFavorite(gameId, button) {
    fetch(`/api/mark_as_favorite/${gameId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateFavoriteButton(button, data.favorito);
                const likeCountElement = document.getElementById(`like-count-${gameId}`);
                if (likeCountElement) {
                    likeCountElement.textContent = data.like_count; // Update the like count
                }
            }
        })
        .catch(error => console.error('Error toggling favorite:', error));
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
        })
        .catch(error => console.error('Error toggling played status:', error));
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
        })
        .catch(error => console.error('Error toggling trophy status:', error));
}

function deleteGame(gameId, gameCard) {
    fetch(`/api/delete_game/${gameId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                gameCard.remove();
            }
        })
        .catch(error => console.error('Error deleting game:', error));
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
        addGameBtn.addEventListener('click', function () {
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

function updateFavoriteButton(button, isFavorite) {
    if (isFavorite) {
        button.classList.add('clicked');
        button.style.backgroundColor = "transparent";
        button.style.color = "#FFD700";
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
        button.style.color = "rgb(184, 223, 255)";
    } else {
        button.classList.remove('clicked');
        button.style.backgroundColor = "";
        button.style.color = "";
        button.style.border = "";
    }
}

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

function setupPlatinumList() {
    const platinumList = document.getElementById('platinum-list');
    const games = JSON.parse(localStorage.getItem('games')) || [];

    if (!platinumList) return;

    console.log(games); // Debugging stored games

    const platinumGames = games.filter(game => game.platinum === true);

    platinumList.innerHTML = '';

    if (platinumGames.length === 0) {
        platinumList.innerHTML = '<p>No tienes trofeos de platino aún. ¡Sigue jugando! 🎮</p>';
    } else {
        platinumGames.forEach(game => {
            const trophyCard = document.createElement('div');
            trophyCard.classList.add('trophy-card');
            trophyCard.innerHTML = `
                <img src="platinum.png" alt="Trofeo Platino">
                <h2>${game.name}</h2>
                <p><strong>Consola:</strong> ${game.console}</p>
                <p><strong>Año:</strong> ${game.year}</p>
                <p><strong>Fecha:</strong> ${game.date || 'Desconocida'}</p>
            `;
            platinumList.appendChild(trophyCard);
        });
    }
}

function setupDarkModeToggle() {
    const toggle = document.getElementById('darkmode-toggle');
    const body = document.body;

    // Check localStorage for the saved mode
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
        if (toggle) toggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        if (toggle) toggle.checked = false;
    }

    if (toggle) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled'); // Save mode to localStorage
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled'); // Save mode to localStorage
            }
        });
    }
}