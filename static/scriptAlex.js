document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.game-list')) {
        loadGames();
    }
});

function loadGames() {
    const gameList = document.querySelector('.game-list');
    gameList.innerHTML = '';  // Limpiar la lista antes de agregar juegos

    fetch('/api/games')
        .then(response => response.json())
        .then(games => {
            if (games.error) {
                console.error("Error al obtener los juegos:", games.error);
                return;
            }

            console.log("Juegos obtenidos:", games);  // Agregar depuración

            games.forEach((game) => {
                const gameCard = document.createElement('div');
                gameCard.classList.add('game-card');

                gameCard.innerHTML = `
                    <img src="${game.imagen_del_juego}" alt="${game.nombre}">
                    <h3>${game.nombre}</h3>
                    <p>Año de salida: ${game.año_salida}</p>
                    <p>Comentarios: ${game.comentarios}</p>
                    <div class="actions">
                        <div class="top-actions">
                            <button class="favorite ${game.favorito ? 'clicked' : ''}" data-id="${game.id}"><i class="fas fa-star"></i></button>
                            <button class="trophy ${game.platino ? 'clicked' : ''}" data-id="${game.id}"><i class="fas fa-trophy"></i></button>
                        </div>
                        <button class="played ${game.jugado ? 'clicked' : ''}" data-id="${game.id}">Marcar como Jugado</button>
                        <button class="delete" data-id="${game.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                const favoriteBtn = gameCard.querySelector('.favorite');
                const playedBtn = gameCard.querySelector('.played');
                const trophyBtn = gameCard.querySelector('.trophy');
                const deleteBtn = gameCard.querySelector('.delete');

                // Función para marcar el botón con el color correspondiente
                function setButtonStyle(button, color, active) {
                    if (active) {
                        button.classList.add('clicked');
                        button.style.backgroundColor = color;
                        button.style.color = "#2D3250";  // Texto oscuro para contraste
                        button.style.border = `2px solid ${color}`;
                    } else {
                        button.classList.remove('clicked');
                        button.style.backgroundColor = "";
                        button.style.color = "";
                        button.style.border = "";
                    }
                }

                // Marcar los botones según los valores en la base de datos
                setButtonStyle(favoriteBtn, "#FFD700", game.favorito);
                setButtonStyle(playedBtn, "#A3D9A5", game.jugado);
                setButtonStyle(trophyBtn, "rgb(184, 223, 255)", game.platino);

                // Botón de marcar como favorito
                favoriteBtn.addEventListener('click', () => {
                    fetch(`/api/mark_as_favorite/${game.id}`, { method: 'POST' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                game = data.juego;
                                setButtonStyle(favoriteBtn, "#FFD700", game.favorito);
                                updatePage('favorites');
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
                                game = data.juego;
                                setButtonStyle(playedBtn, "#A3D9A5", game.jugado);
                                updatePage('played');
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
                                game = data.juego;
                                setButtonStyle(trophyBtn, "rgb(184, 223, 255)", game.platino);
                                updatePage('platinos');
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
                                    gameCard.remove(); // Eliminar visualmente el juego
                                    alert("Juego eliminado correctamente");
                                    updatePage('all');
                                } else {
                                    console.error(data.error);
                                }
                            });
                    }
                });

                gameList.appendChild(gameCard);
            });
        })
        .catch(error => console.error("Error al cargar los juegos:", error));
}

function updatePage(page) {
    if (page === 'favorites') {
        window.location.href = '/favorites';
    } else if (page === 'played') {
        window.location.href = '/played';
    } else if (page === 'platinos') {
        window.location.href = '/platinos';
    } else {
        loadGames();
    }
}