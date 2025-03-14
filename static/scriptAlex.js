document.addEventListener("DOMContentLoaded", () => {
    loadGames();
});

function loadGames() {
    const gameList = document.querySelector('.game-list');
    if (!gameList) {
        return;
    }

    gameList.innerHTML = '';

    fetch('/api/games')
        .then(response => response.json())
        .then(games => {
            if (games.error) {
                console.error("Error al obtener los juegos:", games.error);
                return;
            }

            games.forEach((game) => {
                const gameCard = document.createElement('div');
                gameCard.classList.add('game-card');

                let favoriteClass = game.favorito ? 'clicked' : '';
                let trophyClass = game.platino ? 'clicked' : '';
                let playedClass = game.jugado ? 'clicked' : '';

                gameCard.innerHTML = `
                    <img src="${game.imagen_del_juego}" alt="${game.nombre}">
                    <h3>${game.nombre}</h3>
                    <p>Año de salida: ${game.año_salida}</p>
                    <p>Comentarios: ${game.comentarios}</p>
                    <div class="actions">
                        <div class="top-actions">
                            <button class="favorite ${favoriteClass}" data-id="${game.id}"><i class="fas fa-star"></i></button>
                            <button class="trophy ${trophyClass}" data-id="${game.id}"><i class="fas fa-trophy"></i></button>
                        </div>
                        <button class="played ${playedClass}" data-id="${game.id}">Marcar como Jugado</button>
                        <button class="delete" data-id="${game.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                const favoriteBtn = gameCard.querySelector('.favorite');
                const playedBtn = gameCard.querySelector('.played');
                const trophyBtn = gameCard.querySelector('.trophy');
                const deleteBtn = gameCard.querySelector('.delete');

                // Botón de marcar como favorito
                favoriteBtn.addEventListener('click', () => {
                    fetch(`/api/mark_as_favorite/${game.id}`, { method: 'POST' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                game.favorito = data.juego.favorito;
                                if (game.favorito) {
                                    favoriteBtn.classList.add('clicked');
                                } else {
                                    favoriteBtn.classList.remove('clicked');
                                }
                                updatePage();
                            } else {
                                console.error(data.error);
                            }
                        });
                });

                // Botón de marcar como jugado
                playedBtn.addEventListener('click', () => {
                    fetch(`/api/mark_as_played/${game.id}`, { method: 'POST' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                game.jugado = data.juego.jugado;
                                if (game.jugado) {
                                    playedBtn.classList.add('clicked');
                                } else {
                                    playedBtn.classList.remove('clicked');
                                }
                                updatePage();
                            } else {
                                console.error(data.error);
                            }
                        });
                });

                // Botón de marcar como platino
                trophyBtn.addEventListener('click', () => {
                    fetch(`/api/mark_as_platinum/${game.id}`, { method: 'POST' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                game.platino = data.juego.platino;
                                if (game.platino) {
                                    trophyBtn.classList.add('clicked');
                                } else {
                                    trophyBtn.classList.remove('clicked');
                                }
                                updatePage();
                            } else {
                                console.error(data.error);
                            }
                        });
                });

                // Botón de eliminar juego
                deleteBtn.addEventListener('click', () => {
                    if (confirm("¿Estás seguro de que quieres eliminar este juego?")) {
                        fetch(`/api/delete_game/${game.id}`, { method: 'DELETE' })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    gameCard.remove();
                                    alert("Juego eliminado correctamente");
                                    updatePage();
                                } else {
                                    console.error(data.error);
                                }
                            });
                    }
                });

                gameList.appendChild(gameCard);
            });

            // Aplicar estilos iniciales después de cargar los juegos
            applyInitialButtonStyles();
        })
        .catch(error => console.error("Error al cargar los juegos:", error));
}

function updatePage() {
    loadGames();
}

function applyInitialButtonStyles() {
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        const favoriteBtn = card.querySelector('.favorite');
        const playedBtn = card.querySelector('.played');
        const trophyBtn = card.querySelector('.trophy');

        if (favoriteBtn && favoriteBtn.classList.contains('clicked')) {
            applyClickedStyle(favoriteBtn, "#FFD700");
        } else if (favoriteBtn) {
            removeClickedStyle(favoriteBtn);
        }

        if (playedBtn && playedBtn.classList.contains('clicked')) {
            applyClickedStyle(playedBtn, "#A3D9A5");
        } else if (playedBtn) {
            removeClickedStyle(playedBtn);
        }

        if (trophyBtn && trophyBtn.classList.contains('clicked')) {
            applyClickedStyle(trophyBtn, "rgb(184, 223, 255)");
        } else if (trophyBtn) {
            removeClickedStyle(trophyBtn);
        }
    });
}

function applyClickedStyle(button, color) {
    button.classList.add('clicked');
    button.style.backgroundColor = color;
    button.style.color = "#2D3250";
    button.style.border = `2px solid ${color}`;
}

function removeClickedStyle(button) {
    button.classList.remove('clicked');
    button.style.backgroundColor = "";
    button.style.color = "";
    button.style.border = "";
}