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

// Start Game
levelSelect.addEventListener('change', startQuiz);
resetBtn.addEventListener('click', startQuiz);
finishBtn.addEventListener('click', finishQuiz);

function startQuiz() {
    // Reset Tampilan
    quizContainer.innerHTML = '';
    resultArea.classList.add('hidden');
    finishBtn.style.display = 'block';
    finishBtn.disabled = false;
    
    const currentLvlIdx = parseInt(levelSelect.value);
    let questionPool = [];
    let questionCount = 0;

    // --- LOGIKA PEMILIHAN SOAL ---
    
    // Level 1: Ambil 5 soal dari level ini saja
    if (currentLvlIdx === 0) {
        questionPool = [...allLevels[0].chars];
        questionCount = 5; 
    } 
    // Level 2: Ambil semua soal dari Level 1 & 2 (Total 10)
    else if (currentLvlIdx === 1) {
        questionPool = [...allLevels[0].chars, ...allLevels[1].chars];
        questionCount = 10;
    } 
    // Level 3 ke atas: Ambil dari level skrg + semua level sebelumnya, target 15 soal
    else {
        // Gabungkan semua huruf dari level 0 sampai level yg dipilih
        for (let i = 0; i <= currentLvlIdx; i++) {
            questionPool = questionPool.concat(allLevels[i].chars);
        }
        questionCount = 15;
    }

    // Acak urutan soal (Shuffle)
    questionPool.sort(() => Math.random() - 0.5);

    // Potong sesuai jumlah yang diminta (misal pool ada 20, ambil 15 aja)
    const selectedQuestions = questionPool.slice(0, questionCount);

    // Render ke HTML
    selectedQuestions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="hiragana">${q.j}</div>
            <input type="text" data-answer="${q.r}" autocomplete="off" placeholder="...">
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
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.answer;
        const card = input.parentElement;
        const correctionArea = card.querySelector('.correction-area');

        // Kunci input agar tidak bisa diedit lagi
        input.disabled = true;

        if (userAnswer === correctAnswer) {
            correct++;
            card.classList.add('correct');
            // Jika benar, tidak perlu menampilkan teks tambahan (atau bisa dikasih centang)
        } else {
            card.classList.add('wrong');
            // Tampilkan jawaban yang benar
            correctionArea.innerHTML = `<div class="correction-text">Salah! Jawaban: ${correctAnswer}</div>`;
        }
    });

    // Hitung Nilai
    const score = Math.round((correct / total) * 100);

    // Tampilkan Hasil
    document.getElementById('scoreValue').innerText = score;
    document.getElementById('correctCount').innerText = correct;
    document.getElementById('wrongCount').innerText = total - correct;
    
    resultArea.classList.remove('hidden');
    finishBtn.style.display = 'none'; // Sembunyikan tombol selesai

    // Scroll ke atas agar user lihat nilai
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Jalankan saat pertama kali load
startQuiz();