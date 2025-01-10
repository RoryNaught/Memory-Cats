document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const welcomeSection = document.querySelector('.welcome-section');
    const nameSection = document.querySelector('.name-input-section');
    const gameSection = document.querySelector('.game-section');
    const startButton = document.getElementById('startButton');
    const nameForm = document.getElementById('nameForm');
    const playerGreeting = document.getElementById('playerGreeting');

    // Handle start button click
    startButton.addEventListener('click', () => {
        welcomeSection.style.display = 'none';
        nameSection.style.display = 'block';
        
        // Smooth scroll to name input
        nameSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Handle name form submission
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = document.getElementById('playerName').value.trim();
        
        if (playerName) {
            nameSection.style.display = 'none';
            gameSection.style.display = 'block';
            playerGreeting.textContent = `Hello, ${playerName}!`;
            
            // Create game board when starting
            createGameBoard();
            
            // Smooth scroll to game section
            gameSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Game state
    let flippedCards = [];
    let matchedPairs = 0;
    let moveCount = 0;
    let canFlip = true;  // Lock mechanism for card flipping
    
    // Game board setup
    function createGameBoard() {
        const gameBoard = document.querySelector('.game-board');
        // Using first 6 cat images (will make pairs)
        const catImages = [
            'cat_1.jpeg',
            'cat_2.jpeg',
            'cat_3.jpeg',
            'cat_4.jpeg',
            'cat_5.jpeg',
            'cat_6.jpeg'
        ];
        
        // Create pairs of cards
        const cardPairs = [...catImages, ...catImages];
        // Shuffle the cards
        const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
        
        // Create and append cards to the board
        shuffledCards.forEach((img, index) => {
            const card = createCard(img, index);
            gameBoard.appendChild(card);
        });
    }
    
    function createCard(imgSrc, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-front">
                <img src="assets/${imgSrc}" alt="cat">
            </div>
            <div class="card-back"></div>
        `;
        
        card.addEventListener('click', handleCardClick);
        return card;
    }
    
    function handleCardClick(e) {
        const card = e.currentTarget;
        
        // Prevent flipping if:
        // - card can't be flipped
        // - card is already flipped
        // - two cards are already flipped
        if (!canFlip || card.classList.contains('flipped') || flippedCards.length >= 2) return;
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moveCount++;
            document.getElementById('moveCount').textContent = moveCount;
            
            // Check for match
            const [card1, card2] = flippedCards;
            const match = card1.querySelector('img').src === card2.querySelector('img').src;

            if (match) {
                matchedPairs++;
                document.getElementById('matchCount').textContent = matchedPairs;
                flippedCards = [];
                
                // Check for win
                if (matchedPairs === 6) {
                    setTimeout(() => {
                        alert(`Congratulations! You won in ${moveCount} moves!`);
                    }, 500);
                }
            } else {
                // If no match, flip cards back
                canFlip = false;
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
}); 