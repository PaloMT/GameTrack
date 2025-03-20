document.addEventListener("DOMContentLoaded", () => {
    loadGames();
});

let games = [];

function loadGames() {
    const gameList = document.querySelector('.game-list');
    if (!gameList) {
        console.error("No se encontró el contenedor de juegos.");
        return;
    }

    if (gameList.children.length > 0) {
        console.log("Los juegos ya están cargados, no se volverán a cargar.");
        return; // Evita borrar juegos que ya existen
    }

    fetch('/api/games')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al obtener los juegos:", data.error);
                return;
            }

            if (data.length === 0) {
                console.warn("No hay juegos disponibles en la API.");
                return;
            }

            gameList.innerHTML = ''; // Borrar solo si la API tiene datos nuevos

            data.forEach((game) => {
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
        <div class="game-details">
            <p class="comments-short">${game.comentarios}</p>
            <p class="comments-full">${game.comentarios}</p>
            ${game.comentarios.length > 100 ? '<button class="view-more-btn">Ver más</button>' : ''}
        </div>
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
    const viewMoreBtn = gameCard.querySelector('.view-more-btn');
    const gameDetails = gameCard.querySelector('.game-details');

    // Apply initial styles based on game data
    applyButtonStyles(favoriteBtn, game.favorito, 'favorite');
    applyButtonStyles(playedBtn, game.jugado, 'played');
    applyButtonStyles(trophyBtn, game.platino, 'trophy');

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
                        applyButtonStyles(favoriteBtn, data.juego.favorito, 'favorite');
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
                    // Update the game object in the games array
                    const index = games.findIndex(g => g.id === game.id);
                    if (index !== -1) {
                        games[index].jugado = data.juego.jugado;
                        applyButtonStyles(playedBtn, data.juego.jugado, 'played');
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
                    // Update the game object in the games array
                    const index = games.findIndex(g => g.id === game.id);
                    if (index !== -1) {
                        games[index].platino = data.juego.platino;
                        applyButtonStyles(trophyBtn, data.juego.platino, 'trophy');
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

    // Botón de ver más
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            gameDetails.classList.toggle('expanded');
            viewMoreBtn.textContent = gameDetails.classList.contains('expanded') ? 'Ver menos' : 'Ver más';
        });
    }

    return gameCard;
}

function applyButtonStyles(button, isActive, buttonType) {
    const icon = button.querySelector("i"); // Obtener el icono dentro del botón

    if (isActive) {
        button.classList.add("clicked");
        switch (buttonType) {
            case "favorite":
                button.style.backgroundColor = "#FFD700";
                button.style.border = "2px solid #FFD700";
                icon.style.color = "#2D3250"; // Asegurar color del icono
                break;
            case "trophy":
                button.style.backgroundColor = "rgb(184, 223, 255)";
                button.style.border = "2px solid rgb(184, 223, 255)";
                icon.style.color = "#2D3250";
                break;
        }
    } else {
        button.classList.remove("clicked");
        button.style.backgroundColor = "";
        button.style.border = "";
        icon.style.color = ""; // Restaurar color original
    }
}

fetch('/api/games')
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error al obtener los juegos:", data.error);
            return;
        }

        games = data; // Guardar la lista de juegos

        gameList.innerHTML = ''; // Limpiar la lista antes de actualizar

        games.forEach((game) => {
            const gameCard = createGameCard(game);
            gameList.appendChild(gameCard);

            // Aplicar estilos después de agregar la tarjeta
            applyButtonStyles(gameCard.querySelector(".favorite"), game.favorito, "favorite");
            applyButtonStyles(gameCard.querySelector(".trophy"), game.platino, "trophy");
        });
    })
    .catch(error => console.error("Error al cargar los juegos:", error));

function updatePage() {
    loadGames();
}