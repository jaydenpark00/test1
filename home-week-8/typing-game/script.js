const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
        'There is nothing more deceptive than an obvious fact.',
        'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
        'I never make exceptions. An exception disproves the rule.',
        'What one man can invent another can discover.',
        'Nothing clears up a case so much as stating it to another person.',
        'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
    ];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');

const resultModal = document.getElementById('result-modal');
const resultMessage = document.getElementById('result-message');
const closeButton = document.querySelector('.close-button');

document.getElementById('start').addEventListener('click',() => {

    startButton.disabled = true;

    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' '); 
    wordIndex = 0;

    const spanWords = words.map(function(word) { return `<span>${word} </span>`}); 
    quoteElement.innerHTML = spanWords.join(''); 
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';
    
    typedValueElement.value = ''; 
    typedValueElement.focus();

    typedValueElement.disabled = false;

    startTime = new Date().getTime(); });

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('record-list').innerHTML = loadGameRecords();
});

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        const isNewRecord = saveGameRecord(elapsedTime);

        // 최고 기록에 따라 다른 메시지 표시
        if (isNewRecord) {
            resultMessage.innerText = `🏆 New High Score! You finished in ${(elapsedTime / 1000).toFixed(2)} seconds!`;
            resultMessage.style.color =rgb(76, 175, 80); // 신기록일 때 초록색
        } else {
            resultMessage.innerText = `You finished in ${(elapsedTime / 1000).toFixed(2)} seconds.`;
            resultMessage.style.color = 'black'; // 기본 색상
        }

        resultModal.classList.add('show');
        resultModal.style.display = 'block';

        typedValueElement.disabled = true;
        startButton.disabled = false;
        document.getElementById('record-list').innerHTML = loadGameRecords();

    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
});

closeButton.addEventListener('click', () => {
    resultModal.classList.remove('show');
    resultModal.style.display = 'none';
});

function saveGameRecord(time) {
    // localStorage에서 기록 배열 가져오기 또는 빈 배열 생성
    const records = JSON.parse(localStorage.getItem('gameRecords')) || [];
    const newRecord = {time};

    records.push(newRecord); // 새로운 기록 추가
    records.sort((a, b) => a.time - b.time);
    const topRecords = records.slice(0, 5); // 상위 5개의 기록만 유지

    const isNewRecord = topRecords.length === 0 || topRecords[0].time > time;

    localStorage.setItem('gameRecords', JSON.stringify(topRecords)); // localStorage에 저장
    return isNewRecord;

}

function loadGameRecords() {
    const records = JSON.parse(localStorage.getItem('gameRecords')) || [];
    return records
        .map((record, index) => `<li> ${(record.time / 1000).toFixed(2)} seconds</li>`)
        .join('');
}



