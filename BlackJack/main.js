
import Player from "./player.js";
import Game from "./game.js";

const deckOfCards = [
    {
        suit: 'hearts',
        value: 2,
        img: './cards/2_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 3,
        img: './cards/3_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 4,
        img: './cards/4_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 5,
        img: './cards/5_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 6,
        img: './cards/6_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 7,
        img: './cards/7_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 8,
        img: './cards/8_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 9,
        img: './cards/9_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 10,
        img: './cards/10_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 'J',
        img: './cards/jack_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 'Q',
        img: './cards/queen_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 'K',
        img: './cards/king_of_hearts.svg'
    },
    {
        suit: 'hearts',
        value: 'A',
        img: './cards/ace_of_hearts.svg'
    },
    {
        suit: 'diamonds',
        value: 2,
        img: './cards/2_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 3,
        img: './cards/3_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 4,
        img: './cards/4_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 5,
        img: './cards/5_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 6,
        img: './cards/6_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 7,
        img: './cards/7_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 8,
        img: './cards/8_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 9,
        img: './cards/9_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 10,
        img: './cards/10_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 'J',
        img: './cards/jack_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 'Q',
        img: './cards/queen_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 'K',
        img: './cards/king_of_diamonds.svg'
    },
    {
        suit: 'diamonds',
        value: 'A',
        img: './cards/ace_of_diamonds.svg'
    },
    {
        suit: 'clubs',
        value: 2,
        img: './cards/2_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 3,
        img: './cards/3_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 4,
        img: './cards/4_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 5,
        img: './cards/5_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 6,
        img: './cards/6_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 7,
        img: './cards/7_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 8,
        img: './cards/8_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 9,
        img: './cards/9_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 10,
        img: './cards/10_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 'J',
        img: './cards/jack_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 'Q',
        img: './cards/queen_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 'K',
        img: './cards/king_of_clubs.svg'
    },
    {
        suit: 'clubs',
        value: 'A',
        img: './cards/ace_of_clubs.svg'
    },
    {
        suit: 'spades',
        value: 2,
        img: './cards/2_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 3,
        img: './cards/3_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 4,
        img: './cards/4_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 5,
        img: './cards/5_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 6,
        img: './cards/6_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 7,
        img: './cards/7_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 8,
        img: './cards/8_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 9,
        img: './cards/9_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 10,
        img: './cards/10_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 'J',
        img: './cards/jack_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 'Q',
        img: './cards/queen_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 'K',
        img: './cards/king_of_spades.svg'
    },
    {
        suit: 'spades',
        value: 'A',
        img: './cards/ace_of_spades.svg'
    },
];
let player = new Player('player');
let computer = new Player('computer', true);
let game = new Game(deckOfCards, player, computer);

const handleHold = () => {
    game.hideActions();
    let computerUnFinished = true;

    while (computerUnFinished) {
        computerUnFinished = computer.calculateHouseHit();
        if (computerUnFinished) {
            game.dealCard(computer, 300);
            let gameOver = game.checkIfOver(computer.getHandValue());
            if (gameOver) {
                computerUnFinished = false;
                game.calculateWinner();
                continue;
            }
        } else {
            game.calculateWinner();
        }
    }
}

const handleHit = () => {
    game.hideActions();
    game.dealCard(player);
    let isOver = game.checkIfOver(player.getHandValue());
    if (!isOver) {
        setTimeout(() => {
            let wantsHit = computer.calculateHouseHit();
            if (wantsHit) {
                game.dealCard(computer);
            }
            game.showActions();
            game.checkIfOver(computer.getHandValue());
        }, 1000);
    }
}

let repeaters = [{
    stuff: 'hey'
}, {
    stuff: 'there'
}, {
    stuff: 'you'
}, {
    stuff: 'hey'
}]

const startGame = () => {
    game.shuffleArray();
    game.gameStartBtns();
    game.restart();
    game.deal();
    let stuff = document.getElementById('stuff');
    let attributeValue = stuff.getAttribute('southside-for').split(' ');
    let attributeKeyValue = stuff.getAttribute(':key').split('.');
    let array = eval(`${attributeValue[2]}`);
    
    array.forEach(element => {
        let $clone = $(stuff).clone().attr('id', element[attributeKeyValue[1]]);
        
        getChildren(stuff, element);

        $(stuff).parent().append($clone);

    });

    function getChildren(element, obj) {
        let regEx = /{+{[a-z]+.[a-z]+}+}/g
        if(element.innerText !== undefined){
            let brackets = Array.from(element.innerText.matchAll(regEx));
   
            brackets.forEach(x=> {
                element.textContent = element.textContent.replace(x[0], 'hello');
             })
        }
        Array.from(element.children).forEach((x) => {
            if (x.children.length > 0) {
                getChildren(x);
            } else {
                if (x.textContent.includes('{{')) {
                }
                return x;
            }
        })
    }

    // for (const ) {
    //     console.dir(iterator);
    // }
}


$('#increase').click(player.handleIncrease);
$('#decrease').click(player.handleDecrease);
$('#holdBtn').click(handleHold);
$('#hitBtn').click(handleHit)
$('#startGame').click(startGame)

