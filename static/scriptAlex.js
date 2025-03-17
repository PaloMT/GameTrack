document.addEventListener("DOMContentLoaded", () => {
    loadGames();
});

let games = []; // Store the games array in a global variable

function loadGames() {
    const gameList = document.querySelector('.game-list');
    if (!gameList) {
        return;
    }

    gameList.innerHTML = '';

    fetch('/api/games')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al obtener los juegos:", data.error);
                return;
            }

            games = data; // Store the games array
            games.forEach((game) => {
                const gameCard = createGameCard(game);
                gameList.appendChild(gameCard);
            });
        })
        .catch(error => console.error("Error al cargar los juegos:", error));
}

function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.classList.add('game-card');

    gameCard.innerHTML = `
        <img src="${game.imagen_del_juego}" alt="${game.nombre}">
        <h3>${game.nombre}</h3>
        <p>Año de salida: ${game.año_salida}</p>
        <p>Comentarios: ${game.comentarios}</p>
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

    // Apply initial styles based on game data
    updateFavoriteButton(favoriteBtn, game.favorito);
    updatePlayedButton(playedBtn, game.jugado);
    updateTrophyButton(trophyBtn, game.platino);

    // Botón de marcar como favorito
    favoriteBtn.addEventListener('click', () => {
        fetch(`/api/mark_as_favorite/${game.id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the game object in the games array
                    const index = games.findIndex(g => g.id === game.id);
                    if (index !== -1) {
                        games[index].favorito = data.juego.favorito;
                        updateFavoriteButton(favoriteBtn, data.juego.favorito);
                    }
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
                    // Update the game object in the games array
                    const index = games.findIndex(g => g.id === game.id);
                    if (index !== -1) {
                        games[index].jugado = data.juego.jugado;
                        updatePlayedButton(playedBtn, data.juego.jugado);
                    }
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
                    // Update the game object in the games array
                    const index = games.findIndex(g => g.id === game.id);
                    if (index !== -1) {
                        games[index].platino = data.juego.platino;
                        updateTrophyButton(trophyBtn, data.juego.platino);
                    }
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
                        // Remove the game card from the DOM
                        gameCard.remove();
                        // Remove the game from the games array
                        const index = games.findIndex(g => g.id === game.id);
                        if (index !== -1) {
                            games.splice(index, 1);
                        }
                        alert("Juego eliminado correctamente");
                        updatePage();
                    } else {
                        console.error(data.error);
                    }
                });
        }
    });

    return gameCard;
}

function updateFavoriteButton(button, isFavorite) {
    if (isFavorite) {
        button.classList.add('clicked');
        button.style.backgroundColor = "#FFD700";
        button.style.color = "#2D3250";
        button.style.border = `2px solid #FFD700`;
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
        button.style.backgroundColor = "rgb(184, 223, 255)";
        button.style.color = "#2D3250";
        button.style.border = `2px solid rgb(184, 223, 255)`;
    } else {
        button.classList.remove('clicked');
        button.style.backgroundColor = "";
        button.style.color = "";
        button.style.border = "";
    }
}

function updatePage() {
    loadGames();
}