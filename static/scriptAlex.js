document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.game-list')) {
        loadGames();
    }
});

function loadGames() {
    const gameList = document.querySelector('.game-list');
    gameList.innerHTML = '';  // Limpiar la lista de juegos

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

                gameCard.innerHTML = `
                    <img src="${game.imagen_del_juego}" alt="${game.nombre}">
                    <h3>${game.nombre}</h3>
                    <div class="actions">
                        <div class="top-actions">
                            <button class="favorite" data-id="${game.id}"><i class="fas fa-star"></i></button>
                            <button class="trophy" data-id="${game.id}"><i class="fas fa-trophy"></i></button>
                        </div>
                        <button class="played" data-id="${game.id}">Marcar como Jugado</button>
                        <button class="delete" data-id="${game.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                const favoriteBtn = gameCard.querySelector('.favorite');
                const playedBtn = gameCard.querySelector('.played');
                const trophyBtn = gameCard.querySelector('.trophy');
                const deleteBtn = gameCard.querySelector('.delete');

                // Función para cambiar color y mantenerlo al pasar el cursor
                function setButtonStyle(button, color) {
                    button.classList.add('clicked');
                    button.style.backgroundColor = color;
                    button.style.color = "#2D3250";  // Color de texto oscuro para contraste
                    button.style.border = `2px solid ${color}`;

                    button.addEventListener('mouseenter', () => {
                        button.style.backgroundColor = color;
                    });
                    button.addEventListener('mouseleave', () => {
                        button.style.backgroundColor = color;
                    });
                }

                // Botón de marcar como favorito
                favoriteBtn.addEventListener('click', () => {
                    fetch(`/api/mark_as_favorite/${game.id}`, { method: 'POST' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                setButtonStyle(favoriteBtn, "#FFD700");  // Dorado
                                alert("Juego agregado a favoritos");
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
                                setButtonStyle(playedBtn, "#A3D9A5");  // Verde menta
                                alert("Juego marcado como jugado");
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
                                setButtonStyle(trophyBtn, "rgb(184, 223, 255)");  // Celeste
                                alert("Juego marcado como platino");
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

// Actualizar el estado de un juego en la base de datos
function updateGameStatus(gameId, field, value) {
    fetch(`/api/games/${gameId}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Juego actualizado:', data);
    })
    .catch(error => {
        console.error('Error al actualizar el juego:', error);
    });
}

// Eliminar un juego de la base de datos
function deleteGame(gameId) {
    fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        loadGames(); // Volver a cargar los juegos después de eliminar uno
    })
    .catch(error => {
        console.error('Error al eliminar el juego:', error);
    });
}
