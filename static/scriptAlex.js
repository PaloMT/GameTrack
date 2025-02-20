function loadGames() {
    const gameList = document.querySelector('.game-list');
    const games = JSON.parse(localStorage.getItem('games')) || [];
    gameList.innerHTML = '';

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

        if (game.favorite) favoriteBtn.classList.add('clicked');
        if (game.played) {
            playedBtn.classList.add('clicked');
            playedBtn.style.backgroundColor = "#A3D9A5";
            playedBtn.style.color = "#2D3250";
        }
        if (game.trophy) trophyBtn.classList.add('clicked');

        playedBtn.addEventListener('click', () => {
            game.played = !game.played;
            playedBtn.classList.toggle('clicked');
            playedBtn.style.backgroundColor = game.played ? "#A3D9A5" : "#7077A1";
            playedBtn.style.color = game.played ? "#2D3250" : "#F6B17A";
            updateLocalStorage(games, index, game);
        });

        favoriteBtn.addEventListener('click', () => {
            game.favorite = !game.favorite;
            favoriteBtn.classList.toggle('clicked');
            updateLocalStorage(games, index, game);
        });

        trophyBtn.addEventListener('click', () => {
            game.trophy = !game.trophy;
            trophyBtn.classList.toggle('clicked');
            trophyBtn.style.color = game.trophy ? "#FFD700" : "#F6B17A";
            updateLocalStorage(games, index, game);
        });

        deleteBtn.addEventListener('click', () => {
            games.splice(index, 1);
            localStorage.setItem('games', JSON.stringify(games));
            loadGames();
        });

        gameList.appendChild(gameCard);
    });
}