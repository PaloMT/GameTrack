// Cargar los juegos desde la base de datos
function loadGames() {
    const gameList = document.querySelector('.game-list');
    gameList.innerHTML = ''; // Limpiar la lista antes de cargar nuevos juegos.

    // Solicitar juegos desde la base de datos
    fetch('/api/games') // Asegúrate de que esta URL sea la correcta para tu API
        .then(response => response.json())
        .then(games => {
            games.forEach((game, index) => {
                const gameCard = document.createElement('div');
                gameCard.classList.add('game-card');

                gameCard.innerHTML = `
                    <img src="${game.image}" alt="${game.name}">
                    <h3>${game.name}</h3>
                    <div class="actions">
                        <div class="top-actions">
                            <button class="favorite"><i class="fas fa-star"></i></button>
                            <button class="trophy"><i class="fas fa-trophy"></i></button>
                        </div>
                        <button class="played">Marcar como Jugado</button>
                        <button class="delete"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                const favoriteBtn = gameCard.querySelector('.favorite');
                const playedBtn = gameCard.querySelector('.played');
                const trophyBtn = gameCard.querySelector('.trophy');
                const deleteBtn = gameCard.querySelector('.delete');

                // Establecer el estado de los botones
                if (game.favorite) favoriteBtn.classList.add('clicked');
                if (game.played) {
                    playedBtn.classList.add('clicked');
                    playedBtn.style.backgroundColor = "#A3D9A5";
                    playedBtn.style.color = "#2D3250";
                }
                if (game.trophy) trophyBtn.classList.add('clicked');

                // Acciones de los botones
                playedBtn.addEventListener('click', () => {
                    game.played = !game.played;
                    playedBtn.classList.toggle('clicked');
                    playedBtn.style.backgroundColor = game.played ? "#A3D9A5" : "#7077A1";
                    playedBtn.style.color = game.played ? "#2D3250" : "#F6B17A";
                    updateGameStatus(game.id, 'played', game.played); // Actualizar en el servidor
                });

                favoriteBtn.addEventListener('click', () => {
                    game.favorite = !game.favorite;
                    favoriteBtn.classList.toggle('clicked');
                    updateGameStatus(game.id, 'favorite', game.favorite); // Actualizar en el servidor
                });

                trophyBtn.addEventListener('click', () => {
                    game.trophy = !game.trophy;
                    trophyBtn.classList.toggle('clicked');
                    trophyBtn.style.color = game.trophy ? "#FFD700" : "#F6B17A";
                    updateGameStatus(game.id, 'trophy', game.trophy); // Actualizar en el servidor
                });

                deleteBtn.addEventListener('click', () => {
                    deleteGame(game.id); // Eliminar el juego en el servidor
                });

                gameList.appendChild(gameCard);
            });
        })
        .catch(error => {
            console.error('Error al cargar los juegos:', error);
        });
}

// Actualizar el estado de un juego en la base de datos
function updateGameStatus(gameId, field, value) {
    fetch(`/api/games/${gameId}`, {
        method: 'PATCH', // Usa 'POST' o 'PATCH' dependiendo de tu configuración
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

// Llamada inicial para cargar los juegos
if (document.querySelector('.game-list')) loadGames();
