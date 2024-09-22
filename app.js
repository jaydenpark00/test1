const STARTING_POKER_CHIPS = 100;
const PLAYERS = 3;
const NO_OFSTATER_CARDS = 2;

let playerOnePoints = STARTING_POKER_CHIPS;
let playerTwoPoints = STARTING_POKER_CHIPS;
let playerThreePoints = STARTING_POKER_CHIPS;

playerOnePoints -= 50;
playerTwoPoints -= 25;
playerThreePoints += 75;

let gameHasEnded = false;

let playerOneName = "Chloe";
let playerTwoName = "Jasmine";
let playerThreeName = "Jen";
console.log(`Welcome! 챔피언십 타이틀은 ${playerOneName}, ${playerTwoName}, ${playerThreeName} 중 한 명에게 주어집니다. 각 선수는 ${STARTING_POKER_CHIPS} 의 칩을 가지고 시작합니다. 흥미진진한 경기가 될 것입니다. 최고의 선수가 승리하길 바랍니다!`);

gameHasEnded = ((playerOnePoints + playerTwoPoints) == 0) || // 플레이어3 우승 ((playerTwoPoints + playerThreePoints) == 0) || // 플레이어1 우승 ((playerOnePoints + playerThreePoints) == 0); // 플레이어2 우승
console.log("Game has ended: ", gameHasEnded);

function nameOfFunction(parameter) {
    // function body
}

function displayGreeting() {
    console.log('Hello, world!');
}

displayGreeting();

function name(param, param2, param3) {
}

function displayGreeting(name) {
    console.log(message);
}

displayGreeting('Christopher'); // "Hello, Christopher!" 출력

function displayGreeting(name, salutation='Hello') {
    console.log(`${salutation}, ${name}`);
}
displayGreeting('Christopher');
  // "Hello, Christopher"
displayGreeting('Christopher', 'Hi');
  // "Hi, Christopher"

function getMessage(name) {
    return 'Hello, ' + name + '...';
}
const message = getMessage('Ornella');
document.write(message);