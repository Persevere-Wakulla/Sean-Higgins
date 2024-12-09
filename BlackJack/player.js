export default class Player {
    constructor(player, isHouse = false) {
        if (!isHouse) {
            this.cash = 2000;
            this.bet = 0;
        }
        this.player = player;
        this.faceCards = ['K', 'Q', 'J']
        this.totalScore = 0;
        this.bust = false;
        this.leaveTable = false;
        this.isSplit = false;
        this.isHolding = false;
        this.cards = [];
    }

    emptyHand = () => this.cards = [];

    addCard = (card) => { this.cards.push(card) }

    split = () => { this.cards.map(x => [x]) }

    newHand = () => { this.totalScore = 0; this.emptyHand(); this.busted = false; this.isSplit = false; this.bet = 0; this.isHolding = false; }

    showCards = () => {
        this.cards.filter(x => x.isHidden).forEach((x, index) => {
            let $card = $(`#${this.player}-${index}`);
            let $wrapper = $('<div />');
            let $img = $('<img/>')
                .attr('src', x.img)
                .addClass('card-size')
                ;
            $wrapper.append($img);
            $wrapper.css({
                animation: 'flipCard',
                animationDuration: '1.5s'
            })
            $card.replaceWith($wrapper)
        })
    }

    createCard = (card) => {
        let $playerBoard = $(`.${this.player}-board`);
        if ($playerBoard.hasClass('computer-board')) {
            if (this.cards.indexOf(card) === 1) {
                card.isHidden = true;
                let $wrapper = $('<div />')
                    .attr('id', `${this.player}-0`)
                    .addClass('default-card');
                $wrapper.css({
                    animation: 'drawCardTop',
                    animationDuration: '1s'
                })
                let $div = $('<div />')
                    .addClass('default-card-inner');
                $wrapper.append($div);
                $playerBoard.append($wrapper);
            }
            else {
                let $wrapper = $('<div />');
                let $img = $('<img/>')
                    .attr('src', card.img)
                    .addClass('card-size')
                    ;
                $img.css({
                    animation: 'drawCardTop',
                    animationDuration: '1s'
                })
                $wrapper.append($img);
                $playerBoard.append($wrapper);
            }
        }
        else {
            let $wrapper = $('<div />');
            let $img = $('<img/>')
                .attr('src', card.img)
                .addClass('card-size')
                ;
            $img.css({
                animation: 'drawCardBottom',
                animationDuration: '1s'
            })
            $wrapper.append($img);
            $playerBoard.append($wrapper);
        }
    }
    
    calculateHouseHit = () => {
        let value = this.getHandValue();
        if (value < 17) {
            return true;
        }
        return false;
    }

    handleDecrease = () => {
        if(this.bet > 0){
            if(this.cards.length > 0){
                this.bet -= 50;
                $('#betAmount').text(this.bet);
            }
        }
    }

    handleIncrease = () => {
        if(this.cards.length > 0){
            this.bet += 50;
            let $playerChips =$('#player-chips');
            let clonedFifty = $('#fifty').clone();
            let clonedHundred = $('#hundred').clone();
            clonedFifty.css({
                animation: 'tossChips',
                animationDuration: '1.5s'
            })
            $playerChips.append(clonedFifty);
            let $fiftyChips = $playerChips.children('.chip.fifty');
            if($fiftyChips.length > 0 && $fiftyChips.length % 2 === 0){
                $($fiftyChips[0]).animate({
                    left: '1000%',
                    opacity: 0
                }, 1000, () => $fiftyChips[0].remove());
                $($fiftyChips[1]).animate({
                    left: '1000%',
                    opacity: 0
                }, 1000, () => $fiftyChips[1].remove());
                clonedHundred.hide();
                $playerChips.append(clonedHundred);
                clonedHundred.show().css({
                    animation: 'replaceChips',
                    animationDuration: '1s'
                });
            }
            $('#betAmount').text(this.bet);
        }
    }
    

    getHandValue = () => {
        let aceArray = [];
        let value = this.cards.map(x => {
            if (this.faceCards.includes(x.value)) {
                return 10;
            }
            if (x.value === 'A') {
                aceArray.push('Ace');
                return 0;
            }
            return x.value
        }).reduce((cum, cur) => cum += cur);
        if (aceArray.length) {
            if (value <= 10 && aceArray.length === 1) {
                value += 11;
            } else {
                aceArray.forEach(x => {
                    value++;
                })
            }
        }
        return value;
    }
}