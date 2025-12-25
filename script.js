// Data Hiragana Lengkap
const allLevels = [
    { name: "Lvl 1 (A-O)", chars: [{j:'あ', r:'a'}, {j:'い', r:'i'}, {j:'う', r:'u'}, {j:'え', r:'e'}, {j:'お', r:'o'}] },
    { name: "Lvl 2 (Ka-Ko)", chars: [{j:'か', r:'ka'}, {j:'き', r:'ki'}, {j:'く', r:'ku'}, {j:'け', r:'ke'}, {j:'こ', r:'ko'}] },
    { name: "Lvl 3 (Sa-So)", chars: [{j:'さ', r:'sa'}, {j:'し', r:'shi'}, {j:'す', r:'su'}, {j:'せ', r:'se'}, {j:'そ', r:'so'}] },
    { name: "Lvl 4 (Ta-To)", chars: [{j:'た', r:'ta'}, {j:'ち', r:'chi'}, {j:'つ', r:'tsu'}, {j:'て', r:'te'}, {j:'と', r:'to'}] },
    { name: "Lvl 5 (Na-No)", chars: [{j:'な', r:'na'}, {j:'に', r:'ni'}, {j:'ぬ', r:'nu'}, {j:'ね', r:'ne'}, {j:'の', r:'no'}] },
    { name: "Lvl 6 (Ha-Ho)", chars: [{j:'は', r:'ha'}, {j:'ひ', r:'hi'}, {j:'ふ', r:'fu'}, {j:'へ', r:'he'}, {j:'ほ', r:'ho'}] },
    { name: "Lvl 7 (Ma-Mo)", chars: [{j:'ま', r:'ma'}, {j:'み', r:'mi'}, {j:'む', r:'mu'}, {j:'め', r:'me'}, {j:'も', r:'mo'}] },
    { name: "Lvl 8 (Ya-Yo)", chars: [{j:'や', r:'ya'}, {j:'ゆ', r:'yu'}, {j:'よ', r:'yo'}] },
    { name: "Lvl 9 (Ra-Ro)", chars: [{j:'ら', r:'ra'}, {j:'り', r:'ri'}, {j:'る', r:'ru'}, {j:'れ', r:'re'}, {j:'ろ', r:'ro'}] },
    { name: "Lvl 10 (Wa-N)", chars: [{j:'わ', r:'wa'}, {j:'を', r:'wo'}, {j:'ん', r:'n'}] }
];

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

// Event Listeners
levelSelect.addEventListener('change', startQuiz);
modeSelect.addEventListener('change', startQuiz); // Ganti mode langsung reset game
resetBtn.addEventListener('click', startQuiz);
finishBtn.addEventListener('click', finishQuiz);

function startQuiz() {
    quizContainer.innerHTML = '';
    resultArea.classList.add('hidden');
    finishBtn.style.display = 'block';
    finishBtn.disabled = false;
    
    const currentLvlIdx = parseInt(levelSelect.value);
    const mode = modeSelect.value; // 'h_to_r' atau 'r_to_h'
    
    let questionPool = [];
    let questionCount = 0;

    // Logika Pengambilan Soal (Sama seperti sebelumnya)
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

    // Acak dan Potong
    questionPool.sort(() => Math.random() - 0.5);
    const selectedQuestions = questionPool.slice(0, questionCount);

    // Render Kartu
    selectedQuestions.forEach((q) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let questionText, answerKey, placeholderText, fontClass;

        // Cek Mode
        if (mode === 'h_to_r') {
            // Mode Biasa: Soal Hiragana -> Jawab Romaji
            questionText = q.j;
            answerKey = q.r;
            placeholderText = "romaji...";
            fontClass = "font-jp";
        } else {
            // Mode Balik: Soal Romaji -> Jawab Hiragana
            questionText = q.r;
            answerKey = q.j;
            placeholderText = "hiragana...";
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
        // Ambil jawaban user & kunci jawaban
        const userAnswer = input.value.trim().toLowerCase(); // lowercase biar 'Ka' dianggap sama dgn 'ka'
        const correctAnswer = input.dataset.answer;
        
        const card = input.parentElement;
        const correctionArea = card.querySelector('.correction-area');
        input.disabled = true;

        if (userAnswer === correctAnswer) {
            correct++;
            card.classList.add('correct');
        } else {
            card.classList.add('wrong');
            // Tampilkan jawaban yang benar
            correctionArea.innerHTML = `Salah! Jawabannya: ${correctAnswer}`;
        }
    });

    // Hitung Nilai
    const score = Math.round((correct / total) * 100);

    // Update Tampilan Hasil
    document.getElementById('scoreValue').innerText = score;
    document.getElementById('correctCount').innerText = correct;
    document.getElementById('wrongCount').innerText = total - correct;
    
    resultArea.classList.remove('hidden');
    finishBtn.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Jalankan saat pertama kali
startQuiz();