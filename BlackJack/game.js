export default class Game {
    constructor(deck, ...players) {
        this.players = [];
        this.deck = deck;
        this.isGameRunning = false;
        players.forEach(x => this.players.push(x));
    }

    checkIfOver = (value) => {
        if (value > 21) {
            $('#startGame').show();
            this.hideActions();
            document.querySelector('#lostModal').showModal();
            this.players.find(x => x.player === 'computer').showCards();
            this.isGameRunning = false;
            this.calculateWinner();
            return true;
        }
        if (value === 21) {
            this.hideActions();
            this.players.find(x => x.player === 'computer').showCards();
            console.dir('blackjack');
            this.isGameRunning = false;
            this.calculateWinner();
            return true;
        }
        return false;
    }

    calculateWinner = () => {
        let scores = {
            computer: 0,
            player: 0
        }
        this.players.forEach(x => {
            x.showCards();
            scores[x.player] = x.getHandValue();
        });
        if(scores.computer >= scores.player){
            console.dir('computer wins')
        }else{
            console.dir('player wins')
        }
        $('#startGame').show();
    }

    shuffleArray = () => {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    };

    checkIfGameRunning = () => this.isGameRunning

    gameStartBtns = () => {
        $('#startGame').hide();
        $('#hitBtn').show();
        $('#holdBtn').show();
    }

    hideActions = () => {
        $('#hitBtn').hide();
        $('#holdBtn').hide();
    }

    showActions = () => {
        $('#hitBtn').show();
        $('#holdBtn').show();
    }

    drawCardOnScreen = (player, card, delay) => {
        setTimeout(() => {
            player.createCard(card);
        }, delay);
    }

    deal = () => {
        this.isGameRunning = true;
        let delay = 0;
        let dealt = 0;
        while (dealt < 2) {
            this.players.forEach(player => {
                delay += 250;
                this.dealCard(player, delay);
            });
            dealt++;
        }
    }

    getCard = () => this.deck.shift();

    dealCard = (player, delay = 0) => {
        let card = this.getCard();
        player.addCard(card);
        this.drawCardOnScreen(player, card, delay);
    }

    restart = () => {
        this.players.forEach(x => {
            x.newHand();
        })
        this.isGameRunning = true;
        $('.player-board').empty();
        $('.computer-board').empty();
    }
}