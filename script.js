
class AudioController{
    constructor(){
        this.bgsound = new Audio('../bgMusic.mp3');
        this.flipSound = new Audio('../flipCard.mp3');
        this.matchSound = new Audio('../matchMeow.mp3');
        this.victorySound = new Audio('../vicMeow.mp3');
        this.loseSound = new Audio('../loseMeow.mp3');
        this.bgsound.volume = 0.5;

        this.bgsound.loop = true;
    }
    startMusic(){
        this.bgsound.play();
    }
    stopMusic(){
        this.bgsound.pause();
        this.bgsound.currentTime = 0;
    }
    flip(){
        this.flipSound.play();
    }
    match(){
        this.matchSound.play();
    }
    victory(){
        this.stopMusic();
        this.victorySound.play();
    }
    lose(){
        this.stopMusic();
        this.victorySound.play();
    }

}

class Game{
    constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemain = totalTime;
    this.timer = document.getElementById('timeRemaining');
    this.ticker = document.getElementById('flipsDone');
    this.audioController = new AudioController();
    }
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.cant = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleDem();
            this.countDown = this.startCountDown();
            this.cant = false;
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card){
        if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck){
                this.checkForUyab(card);
            }
            else{
                this.cardToCheck = card;
            }
        }
    }

    checkForUyab(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardUyab(card, this.cardToCheck);
        else
            this.cardEx(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    cardUyab(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');

        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.Yipee();
    }

    cardEx(card1, card2){
        this.cant = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.cant = false;
        }, 1000)
    }


    startCountDown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.GG();
        }, 1000);
    }

    GG(){
        clearInterval(this.countDown);
        this.audioController.lose();
        document.getElementById('GameOver').classList.add('visible');
    }

    Yipee(){
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('Victory').classList.add('visible');
    }

    shuffleDem(){
        for(let i = this.cardsArray.length -1; i > 0; i--){
            let randomi = Math.floor(Math.random() * (i+1));
            this.cardsArray[randomi].style.order = i;
            this.cardsArray[i].style.order = randomi;
        }
    }

    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;  
    }

    canFlipCard(card){
        return (!this.cant && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }
}


if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', start()); //wait for html file to load
}
else{
    start();
}

function start(){

    let overlay = Array.from(document.getElementsByClassName('overlay'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Game(60,cards);

    overlay.forEach(overlay => {
        overlay.addEventListener('click', () =>{
            overlay.classList.remove('visible');
            game.startGame();
        })
    })

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    })
}


