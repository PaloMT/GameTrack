
document.addEventListener("DOMContentLoaded", () => {
    initializeButtons();
    setupDarkModeToggle();
    setupViewMoreButtons();
    setupAddGameButton();
    initializeButtonStates();
    setupRatingStars();
    initializeStarRatings(); 
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stars i').forEach(star => {
        star.addEventListener('click', function() {
            const container = this.parentElement;
            const ratingType = container.dataset.type;
            const juegoId = container.dataset.id;
            const ratingValue = parseInt(this.dataset.value);
            
            // Update UI
            const stars = container.querySelectorAll('i');
            stars.forEach((s, index) => {
                s.classList.toggle('rated', index < ratingValue);
            });

            // Send to server
            fetch('/update_rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token() }}'  // Add CSRF protection
                },
                body: JSON.stringify({
                    juego_id: juegoId,
                    rating_type: ratingType,
                    rating_value: ratingValue
                })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Failed to update rating');
                    // Revert UI if needed
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
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

function setupRatingStars() {
    document.querySelectorAll('.stars').forEach(starContainer => {
        starContainer.querySelectorAll('i').forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                const type = starContainer.getAttribute('data-type');
                const gameId = starContainer.getAttribute('data-id');
                const ratingGroup = starContainer.closest('.rating-group');
                
                // Update UI immediately
                starContainer.setAttribute('data-rating', value);
                starContainer.querySelectorAll('i').forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('rated');
                    } else {
                        s.classList.remove('rated');
                    }
                });
                
                // Update the displayed value
                if (ratingGroup) {
                    const valueDisplay = ratingGroup.querySelector('.rating-value');
                    if (valueDisplay) {
                        valueDisplay.textContent = `${value}/5`;
                    }
                }

                // Send to server
                fetch(`/api/set_rating/${gameId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tipo: type,
                        valor: value
                    })
                })
                .catch(err => {
                    console.error("Error:", err);
                    // Revert if failed
                    const currentRating = parseInt(starContainer.getAttribute('data-rating') || 0);
                    starContainer.querySelectorAll('i').forEach((s, index) => {
                        if (index < currentRating) {
                            s.classList.add('rated');
                        } else {
                            s.classList.remove('rated');
                        }
                    });
                });
            });
        });
    });
}

function setupRatingStars() {
    document.querySelectorAll('.stars').forEach(starContainer => {
        starContainer.querySelectorAll('i').forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                const type = starContainer.getAttribute('data-type');
                const gameId = starContainer.getAttribute('data-id');
                const ratingGroup = starContainer.closest('.rating-group');
                
                // Update UI immediately
                starContainer.setAttribute('data-rating', value);
                starContainer.querySelectorAll('i').forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('rated');
                    } else {
                        s.classList.remove('rated');
                    }
                });
                
                // Update the displayed value
                if (ratingGroup) {
                    const valueDisplay = ratingGroup.querySelector('.rating-value');
                    if (valueDisplay) {
                        valueDisplay.textContent = `${value}/5`;
                    }
                }

                // Send to server
                fetch(`/api/set_rating/${gameId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tipo: type,
                        valor: value
                    })
                })
                .catch(err => {
                    console.error("Error:", err);
                    // Revert if failed
                    const currentRating = parseInt(starContainer.getAttribute('data-rating') || 0);
                    starContainer.querySelectorAll('i').forEach((s, index) => {
                        if (index < currentRating) {
                            s.classList.add('rated');
                        } else {
                            s.classList.remove('rated');
                        }
                    });
                });
            });
            
            // Add hover effect
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.getAttribute('data-value'));
                const stars = starContainer.querySelectorAll('i');
                stars.forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('hover');
                    } else {
                        s.classList.remove('hover');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                const stars = starContainer.querySelectorAll('i');
                stars.forEach(s => s.classList.remove('hover'));
            });
        });
    });
}

function initializeStarRatings() {
    document.querySelectorAll('.stars').forEach(starContainer => {
        const stars = starContainer.querySelectorAll('i');
        const currentRating = parseInt(starContainer.getAttribute('data-rating') || 0);
        const ratingGroup = starContainer.closest('.rating-group');
        
        // Update star display
        stars.forEach((star, index) => {
            if (index < currentRating) {
                star.classList.add('rated');
            } else {
                star.classList.remove('rated');
            }
        });
        
        // Update the displayed value
        if (ratingGroup) {
            const valueDisplay = ratingGroup.querySelector('.rating-value');
            if (valueDisplay) {
                valueDisplay.textContent = `${currentRating}/5`;
            }
        }
    });
}