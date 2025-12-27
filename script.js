// Data Hiragana (h) & Katakana (k) & Romaji (r)
const allLevels = [
    { name: "Lvl 1 (A-O)", chars: [
        {h:'あ', k:'ア', r:'a'}, {h:'い', k:'イ', r:'i'}, {h:'う', k:'ウ', r:'u'}, {h:'え', k:'エ', r:'e'}, {h:'お', k:'オ', r:'o'}
    ]},
    { name: "Lvl 2 (Ka-Ko)", chars: [
        {h:'か', k:'カ', r:'ka'}, {h:'き', k:'キ', r:'ki'}, {h:'く', k:'ク', r:'ku'}, {h:'け', k:'ケ', r:'ke'}, {h:'こ', k:'コ', r:'ko'}
    ]},
    { name: "Lvl 3 (Sa-So)", chars: [
        {h:'さ', k:'サ', r:'sa'}, {h:'し', k:'シ', r:'shi'}, {h:'す', k:'ス', r:'su'}, {h:'せ', k:'セ', r:'se'}, {h:'そ', k:'ソ', r:'so'}
    ]},
    { name: "Lvl 4 (Ta-To)", chars: [
        {h:'た', k:'タ', r:'ta'}, {h:'ち', k:'チ', r:'chi'}, {h:'つ', k:'ツ', r:'tsu'}, {h:'て', k:'テ', r:'te'}, {h:'と', k:'ト', r:'to'}
    ]},
    { name: "Lvl 5 (Na-No)", chars: [
        {h:'な', k:'ナ', r:'na'}, {h:'に', k:'ニ', r:'ni'}, {h:'ぬ', k:'ヌ', r:'nu'}, {h:'ね', k:'ネ', r:'ne'}, {h:'の', k:'ノ', r:'no'}
    ]},
    { name: "Lvl 6 (Ha-Ho)", chars: [
        {h:'は', k:'ハ', r:'ha'}, {h:'ひ', k:'ヒ', r:'hi'}, {h:'ふ', k:'フ', r:'fu'}, {h:'へ', k:'ヘ', r:'he'}, {h:'ほ', k:'ホ', r:'ho'}
    ]},
    { name: "Lvl 7 (Ma-Mo)", chars: [
        {h:'ま', k:'マ', r:'ma'}, {h:'み', k:'ミ', r:'mi'}, {h:'む', k:'ム', r:'mu'}, {h:'め', k:'メ', r:'me'}, {h:'も', k:'モ', r:'mo'}
    ]},
    { name: "Lvl 8 (Ya-Yo)", chars: [
        {h:'や', k:'ヤ', r:'ya'}, {h:'ゆ', k:'ユ', r:'yu'}, {h:'よ', k:'ヨ', r:'yo'}
    ]},
    { name: "Lvl 9 (Ra-Ro)", chars: [
        {h:'ら', k:'ラ', r:'ra'}, {h:'り', k:'リ', r:'ri'}, {h:'る', k:'ル', r:'ru'}, {h:'れ', k:'レ', r:'re'}, {h:'ろ', k:'ロ', r:'ro'}
    ]},
    { name: "Lvl 10 (Wa-N)", chars: [
        {h:'わ', k:'ワ', r:'wa'}, {h:'を', k:'ヲ', r:'wo'}, {h:'ん', k:'ン', r:'n'}
    ]}
];

const scriptSelect = document.getElementById('scriptSelect');
const levelSelect = document.getElementById('levelSelect');
const modeSelect = document.getElementById('modeSelect');
const quizContainer = document.getElementById('quizContainer');
const finishBtn = document.getElementById('finishBtn');
const resetBtn = document.getElementById('resetBtn');
const resultArea = document.getElementById('resultArea');

// Isi Dropdown Level
allLevels.forEach((lvl, idx) => {
    let opt = document.createElement('option');
    opt.value = idx;
    opt.innerText = lvl.name;
    levelSelect.appendChild(opt);
});

// Event Listeners (Semua dropdown akan mereset game)
scriptSelect.addEventListener('change', startQuiz);
levelSelect.addEventListener('change', startQuiz);
modeSelect.addEventListener('change', startQuiz);
resetBtn.addEventListener('click', startQuiz);
finishBtn.addEventListener('click', finishQuiz);

function startQuiz() {
    quizContainer.innerHTML = '';
    resultArea.classList.add('hidden');
    finishBtn.style.display = 'block';
    
    const currentLvlIdx = parseInt(levelSelect.value);
    const scriptType = scriptSelect.value; // 'h' (Hiragana) atau 'k' (Katakana)
    const mode = modeSelect.value; // 'jp_to_romaji' atau 'romaji_to_jp'
    
    let questionPool = [];
    let questionCount = 0;

    // Logika Pengambilan Soal (Leveling)
    if (currentLvlIdx === 0) {
        questionPool = [...allLevels[0].chars];
        questionCount = 5; 
    } else if (currentLvlIdx === 1) {
        questionPool = [...allLevels[0].chars, ...allLevels[1].chars];
        questionCount = 10;
    } else {
        for (let i = 0; i <= currentLvlIdx; i++) {
            questionPool = questionPool.concat(allLevels[i].chars);
        }
        questionCount = 15;
    }

    // Acak & Potong
    questionPool.sort(() => Math.random() - 0.5);
    const selectedQuestions = questionPool.slice(0, questionCount);

    // Render Kartu
    selectedQuestions.forEach((q) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let questionText, answerKey, placeholderText, fontClass;

        // Tentukan apa yang ditampilkan dan apa kuncinya
        // scriptType = 'h' atau 'k'
        // q.h = Hiragana, q.k = Katakana, q.r = Romaji

        if (mode === 'jp_to_romaji') {
            // Soal: Huruf Jepang (sesuai pilihan script) -> Jawab: Romaji
            questionText = (scriptType === 'h') ? q.h : q.k;
            answerKey = q.r;
            placeholderText = "romaji...";
            fontClass = "font-jp";
        } else {
            // Soal: Romaji -> Jawab: Huruf Jepang (sesuai pilihan script)
            questionText = q.r;
            answerKey = (scriptType === 'h') ? q.h : q.k;
            placeholderText = (scriptType === 'h') ? "hiragana..." : "katakana...";
            fontClass = "font-romaji";
        }

        card.innerHTML = `
            <div class="question-text ${fontClass}">${questionText}</div>
            <input type="text" data-answer="${answerKey}" autocomplete="off" placeholder="${placeholderText}" autocapitalize="none">
            <div class="correction-area"></div>
        `;
        quizContainer.appendChild(card);
    });
}

function finishQuiz() {
    const inputs = document.querySelectorAll('.card input');
    let correct = 0;
    let total = inputs.length;

    inputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase(); // lowercase untuk romaji
        const correctAnswer = input.dataset.answer;
        const card = input.parentElement;
        const correctionArea = card.querySelector('.correction-area');
        
        input.disabled = true;

        if (userAnswer === correctAnswer) {
            correct++;
            card.classList.add('correct');
        } else {
            card.classList.add('wrong');
            correctionArea.innerHTML = `<div class="correction-text">Salah! Jawab: ${correctAnswer}</div>`;
        }
    });

    const score = Math.round((correct / total) * 100);

    document.getElementById('scoreValue').innerText = score;
    document.getElementById('correctCount').innerText = correct;
    document.getElementById('wrongCount').innerText = total - correct;
    
    resultArea.classList.remove('hidden');
    finishBtn.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Start
startQuiz();