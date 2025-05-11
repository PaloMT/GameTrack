document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/getGameData')
        .then(response => response.json())
        .then(data => {
            data.forEach(game => {
                const gameCard = document.querySelector(`#game-${game.id}`);
                if (gameCard) {
                    const favoriteButton = gameCard.querySelector('button.favorite');
                    const trophyButton = gameCard.querySelector('button.trophy');
                    
                    if (game.isFavorite) {
                        favoriteButton.classList.add('clicked');
                    }
                    
                    if (game.hasTrophy) {
                        trophyButton.classList.add('clicked');
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching game data:', error));
});