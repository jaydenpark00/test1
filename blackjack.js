let cardOne = 7;
let cardTwo = 7;
let sum = cardOne + cardTwo;
let cardPlayer = [7, 5, 11, 4, 3];
let cardBank = [7, 5, 6, 4, 3];
let Banksum = 0;

let i = cardBank[0];
let j = cardPlayer[0];
let count = 1;

if (i+j > 21){
    console.log('Bust');
}
else{
    while (i <= 17){
        i += cardBank[count];
        j += cardPlayer[count];
        count++;
    }
    if(j == 21){
        console.log('21점 달성으로 플레이어 승리')
    }
    else if (i == j){
        console.log(i+'점으로 무승부')
    }
    else if (i > 21){
        console.log('딜러 21점 초과로 플레이어 승리')
    }
    else if (j > 21){
        console.log('플레이어 21점 초과로 딜러 승리')
    }
}