const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

let currentModule = 'practice';
let allQuestions = [];
let realExamQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let wrongQuestions = [];
let answered = false;

const STORAGE_KEY_PRACTICE = 'quiz_app_practice_stats';
const STORAGE_KEY_REAL = 'quiz_app_real_stats';

function getStorageKey() {
    return currentModule === 'practice' ? STORAGE_KEY_PRACTICE : STORAGE_KEY_REAL;
}

function getCurrentQuestions() {
    return currentModule === 'practice' ? allQuestions : realExamQuestions;
}

function loadStats() {
    try {
        const data = localStorage.getItem(getStorageKey());
        if (data) return JSON.parse(data);
    } catch (e) {}
    return { questionRecords: {} };
}

function saveStats(stats) {
    try {
        localStorage.setItem(getStorageKey(), JSON.stringify(stats));
    } catch (e) {}
}

function getQuestionKey(q) {
    return q.question.slice(0, 60);
}

function recordAnswer(question, isCorrect) {
    const stats = loadStats();
    const key = getQuestionKey(question);
    if (!stats.questionRecords[key]) {
        stats.questionRecords[key] = { done: 0, correct: 0, wrong: 0 };
    }
    stats.questionRecords[key].done++;
    if (isCorrect) {
        stats.questionRecords[key].correct++;
    } else {
        stats.questionRecords[key].wrong++;
    }
    saveStats(stats);
}

function getWrongQuestions(questions) {
    const stats = loadStats();
    return questions.filter(q => {
        const key = getQuestionKey(q);
        const rec = stats.questionRecords[key];
        return rec && rec.wrong > 0;
    });
}

function getWeightedQuestions(questions) {
    const stats = loadStats();
    const result = [];
    
    for (const q of questions) {
        const key = getQuestionKey(q);
        const rec = stats.questionRecords[key];
        let weight = 10;
        
        if (rec) {
            if (rec.wrong > 0) {
                weight = 8;
            } else if (rec.correct >= 1) {
                weight = 2;
            }
        }
        
        for (let i = 0; i < weight; i++) {
            result.push(q);
        }
    }
    
    return result;
}

function getAllDoneCount(questions) {
    const stats = loadStats();
    let count = 0;
    for (const q of questions) {
        const key = getQuestionKey(q);
        if (stats.questionRecords[key] && stats.questionRecords[key].done > 0) {
            count++;
        }
    }
    return count;
}

function getWrongCount(questions) {
    return getWrongQuestions(questions).length;
}

function updateStatsDisplay() {
    const questions = getCurrentQuestions();
    const doneEl = document.getElementById('stat-done');
    const wrongEl = document.getElementById('stat-wrong-total');
    if (doneEl) doneEl.textContent = getAllDoneCount(questions);
    if (wrongEl) wrongEl.textContent = getWrongCount(questions);
}

function updateHomeStats() {
    const practiceTotalEl = document.getElementById('practice-total');
    const practiceWrongEl = document.getElementById('practice-wrong');
    const realTotalEl = document.getElementById('real-total');
    const realWrongEl = document.getElementById('real-wrong');
    
    if (practiceTotalEl) practiceTotalEl.textContent = allQuestions.length;
    if (practiceWrongEl) practiceWrongEl.textContent = getWrongCountFor(allQuestions, STORAGE_KEY_PRACTICE);
    if (realTotalEl) realTotalEl.textContent = realExamQuestions.length;
    if (realWrongEl) realWrongEl.textContent = getWrongCountFor(realExamQuestions, STORAGE_KEY_REAL);
}

function getWrongCountFor(questions, storageKey) {
    try {
        const data = localStorage.getItem(storageKey);
        if (!data) return 0;
        const stats = JSON.parse(data);
        return questions.filter(q => {
            const key = q.question.slice(0, 60);
            const rec = stats.questionRecords[key];
            return rec && rec.wrong > 0;
        }).length;
    } catch (e) {
        return 0;
    }
}

function resetAllStats() {
    if (confirm('确定要重置所有答题进度吗？错题记录也会被清空。')) {
        localStorage.removeItem(getStorageKey());
        updateStatsDisplay();
        updateHomeStats();
        alert('进度已重置！');
    }
}

const homeScreen = document.getElementById('home-screen');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const questionCountSelect = document.getElementById('question-count');
const questionTypeSelect = document.getElementById('question-type');
const practiceModeSelect = document.getElementById('practice-mode');
const resetStatsBtn = document.getElementById('reset-stats-btn');

const currentNumEl = document.getElementById('current-num');
const totalNumEl = document.getElementById('total-num');
const progressFill = document.getElementById('progress-fill');
const correctNumEl = document.getElementById('correct-num');
const wrongNumEl = document.getElementById('wrong-num');

const questionTypeTag = document.getElementById('question-type-tag');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');

const explanationCard = document.getElementById('explanation-card');
const resultBanner = document.getElementById('result-banner');
const resultIcon = document.getElementById('result-icon');
const resultText = document.getElementById('result-text');
const correctAnswerEl = document.getElementById('correct-answer');
const explanationText = document.getElementById('explanation-text');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

const finalScoreEl = document.getElementById('final-score');
const statTotalEl = document.getElementById('stat-total');
const statCorrectEl = document.getElementById('stat-correct');
const statWrongEl = document.getElementById('stat-wrong');
const statRateEl = document.getElementById('stat-rate');
const resultIconLarge = document.getElementById('result-icon-large');
const reviewBtn = document.getElementById('review-btn');
const restartBtn = document.getElementById('restart-btn');
const backHomeBtn = document.getElementById('back-home-btn');
const reviewSection = document.getElementById('review-section');
const reviewList = document.getElementById('review-list');

const backToHomeBtn = document.getElementById('back-to-home');
const backFromQuizBtn = document.getElementById('back-from-quiz');
const modePracticeBtn = document.getElementById('mode-practice');
const modeRealExamBtn = document.getElementById('mode-real-exam');

async function loadPracticeQuestions() {
    try {
        const response = await fetch('questions.json');
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                allQuestions = data;
                return;
            }
        }
    } catch (e) {}
}

async function loadRealExamQuestions() {
    try {
        const response = await fetch('questions_real_exam.json');
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                realExamQuestions = data;
                return;
            }
        }
    } catch (e) {}
}

async function init() {
    await Promise.all([loadPracticeQuestions(), loadRealExamQuestions()]);
    updateHomeStats();
}

init();

function generateQRCode() {
    const container = document.getElementById('qrcode-container');
    const urlEl = document.getElementById('qrcode-url');
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    
    urlEl.textContent = currentUrl;
    
    if (typeof QRCode !== 'undefined') {
        container.innerHTML = '';
        new QRCode(container, {
            text: currentUrl,
            width: 140,
            height: 140,
            colorDark: '#333333',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    } else {
        container.innerHTML = '<p class="qrcode-loading">二维码加载中...</p>';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateQRCode);
} else {
    generateQRCode();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showScreen(screen) {
    homeScreen.classList.remove('active');
    startScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    screen.classList.add('active');
}

function enterPracticeMode() {
    currentModule = 'practice';
    const startTitle = document.getElementById('start-title');
    const startDesc = document.getElementById('start-desc');
    const startIcon = document.getElementById('start-icon');
    const questionTypeOption = questionTypeSelect.querySelector('option[value="judge"]');
    
    startTitle.textContent = '练习模式';
    startDesc.textContent = '智能复习 + 错题练习，基于题库随机抽题';
    startIcon.textContent = '📝';
    questionTypeOption.style.display = '';
    
    updateStatsDisplay();
    showScreen(startScreen);
}

function enterRealExamMode() {
    currentModule = 'real';
    const startTitle = document.getElementById('start-title');
    const startDesc = document.getElementById('start-desc');
    const startIcon = document.getElementById('start-icon');
    const questionTypeOption = questionTypeSelect.querySelector('option[value="judge"]');
    
    startTitle.textContent = '真题模拟';
    startDesc.textContent = '历年期末考试真题，独立题库和错题集';
    startIcon.textContent = '📄';
    questionTypeOption.style.display = 'none';
    if (questionTypeSelect.value === 'judge') {
        questionTypeSelect.value = 'all';
    }
    
    updateStatsDisplay();
    showScreen(startScreen);
}

function startQuiz() {
    const questions = getCurrentQuestions();
    let count = parseInt(questionCountSelect.value);
    let typeFilter = questionTypeSelect.value;
    let mode = practiceModeSelect.value;

    let filteredQuestions = questions;
    if (typeFilter !== 'all') {
        filteredQuestions = questions.filter(q => q.type === typeFilter);
    }

    if (mode === 'wrong') {
        filteredQuestions = getWrongQuestions(filteredQuestions);
        if (filteredQuestions.length === 0) {
            alert('还没有错题记录，快去做题吧！');
            return;
        }
    }

    if (filteredQuestions.length === 0) {
        alert('没有符合条件的题目！');
        return;
    }

    if (count === 0 || count > filteredQuestions.length) {
        count = filteredQuestions.length;
    }

    let sourceQuestions = filteredQuestions;
    if (mode === 'weighted') {
        sourceQuestions = getWeightedQuestions(filteredQuestions);
    }

    const shuffled = shuffleArray(sourceQuestions);
    const selected = [];
    const seen = new Set();
    for (const q of shuffled) {
        if (selected.length >= count) break;
        const key = getQuestionKey(q);
        if (mode === 'weighted' && seen.has(key)) continue;
        seen.add(key);
        selected.push(q);
    }

    currentQuestions = selected;
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    wrongQuestions = [];

    totalNumEl.textContent = currentQuestions.length;
    correctNumEl.textContent = correctCount;
    wrongNumEl.textContent = wrongCount;

    showScreen(quizScreen);
    showQuestion();
}

function showQuestion() {
    const question = currentQuestions[currentIndex];
    answered = false;

    currentNumEl.textContent = currentIndex + 1;
    const progress = (currentIndex / currentQuestions.length) * 100;
    progressFill.style.width = progress + '%';

    let typeLabel = '单选题';
    if (question.type === 'multiple') typeLabel = '多选题';
    if (question.type === 'judge') typeLabel = '判断题';
    questionTypeTag.textContent = typeLabel;
    questionText.textContent = `${currentIndex + 1}. ${question.question}`;

    optionsList.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option-item';
        optionEl.dataset.index = index;
        let label = optionLabels[index];
        if (question.type === 'judge') {
            label = index === 0 ? '错' : '对';
        }
        optionEl.innerHTML = `
            <span class="option-label">${label}</span>
            <span class="option-text">${option}</span>
        `;
        optionEl.addEventListener('click', () => selectOption(index, optionEl));
        optionsList.appendChild(optionEl);
    });

    explanationCard.classList.add('hidden');
    if (question.type === 'multiple') {
        submitBtn.classList.remove('hidden');
    } else {
        submitBtn.classList.add('hidden');
    }
    nextBtn.textContent = currentIndex === currentQuestions.length - 1 ? '查看结果' : '下一题';
}

let selectedOptions = [];

function selectOption(index, optionEl) {
    if (answered) return;

    const question = currentQuestions[currentIndex];

    if (question.type === 'single' || question.type === 'judge') {
        selectedOptions = [index];
        document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
        optionEl.classList.add('selected');
        setTimeout(() => checkAnswer(), 200);
    } else {
        if (optionEl.classList.contains('selected')) {
            optionEl.classList.remove('selected');
            selectedOptions = selectedOptions.filter(i => i !== index);
        } else {
            optionEl.classList.add('selected');
            selectedOptions.push(index);
        }
    }
}

function checkAnswer() {
    if (answered) return;
    if (selectedOptions.length === 0) {
        alert('请至少选择一个选项！');
        return;
    }

    answered = true;
    const question = currentQuestions[currentIndex];
    const correctAnswers = question.answer.sort((a, b) => a - b).join(',');
    const userAnswers = [...selectedOptions].sort((a, b) => a - b).join(',');
    const isCorrect = correctAnswers === userAnswers;

    const optionEls = document.querySelectorAll('.option-item');
    optionEls.forEach(el => {
        el.classList.add('disabled');
        const idx = parseInt(el.dataset.index);
        if (question.answer.includes(idx)) {
            el.classList.add('correct');
        } else if (selectedOptions.includes(idx)) {
            el.classList.add('wrong');
        }
    });

    if (isCorrect) {
        correctCount++;
        correctNumEl.textContent = correctCount;
        resultBanner.className = 'result-banner correct';
        resultIcon.textContent = '✅';
        resultText.textContent = '回答正确！';
        recordAnswer(question, true);
    } else {
        wrongCount++;
        wrongNumEl.textContent = wrongCount;
        resultBanner.className = 'result-banner wrong';
        resultIcon.textContent = '❌';
        resultText.textContent = '回答错误';
        recordAnswer(question, false);
        let yourAnsText, correctAnsTextFull;
        if (question.type === 'judge') {
            yourAnsText = selectedOptions.map(i => (i === 1 ? '对' : '错')).join('、');
            correctAnsTextFull = question.answer.map(i => (i === 1 ? '对' : '错') + '. ' + question.options[i]).join('、');
        } else {
            yourAnsText = selectedOptions.map(i => optionLabels[i] + '. ' + question.options[i]).join('、');
            correctAnsTextFull = question.answer.map(i => optionLabels[i] + '. ' + question.options[i]).join('、');
        }
        wrongQuestions.push({
            question: question.question,
            yourAnswer: yourAnsText,
            correctAnswer: correctAnsTextFull,
            explanation: question.explanation
        });
    }

    let correctAnsText;
    if (question.type === 'judge') {
        correctAnsText = question.answer.map(i => (i === 1 ? '对' : '错')).join('、');
    } else {
        correctAnsText = question.answer.map(i => optionLabels[i]).join('、');
    }
    correctAnswerEl.innerHTML = `正确答案：<strong>${correctAnsText}</strong>`;
    explanationText.textContent = question.explanation || '暂无解析';

    explanationCard.classList.remove('hidden');
    submitBtn.classList.add('hidden');
    explanationCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function nextQuestion() {
    if (!answered) {
        const question = currentQuestions[currentIndex];
        if (question.type === 'multiple') {
            checkAnswer();
            return;
        }
    }

    currentIndex++;
    selectedOptions = [];

    if (currentIndex >= currentQuestions.length) {
        showResult();
    } else {
        showQuestion();
    }
}

function showResult() {
    const total = currentQuestions.length;
    const score = Math.round((correctCount / total) * 100);

    progressFill.style.width = '100%';

    finalScoreEl.textContent = score;
    statTotalEl.textContent = total;
    statCorrectEl.textContent = correctCount;
    statWrongEl.textContent = wrongCount;
    statRateEl.textContent = Math.round((correctCount / total) * 100) + '%';

    if (score >= 90) {
        resultIconLarge.textContent = '🏆';
    } else if (score >= 70) {
        resultIconLarge.textContent = '🎉';
    } else if (score >= 60) {
        resultIconLarge.textContent = '👍';
    } else {
        resultIconLarge.textContent = '💪';
    }

    reviewSection.classList.add('hidden');
    reviewBtn.textContent = '查看错题';

    if (wrongCount === 0) {
        reviewBtn.style.display = 'none';
    } else {
        reviewBtn.style.display = '';
    }

    updateHomeStats();
    showScreen(resultScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showReview() {
    if (reviewSection.classList.contains('hidden')) {
        reviewList.innerHTML = '';
        wrongQuestions.forEach((item, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-question">${index + 1}. ${item.question}</div>
                <div class="review-answers">
                    <div class="review-your-answer">你的答案：${item.yourAnswer}</div>
                    <div class="review-correct-answer">正确答案：${item.correctAnswer}</div>
                </div>
                <div class="review-explanation">📝 解析：${item.explanation || '暂无解析'}</div>
            `;
            reviewList.appendChild(reviewItem);
        });
        reviewSection.classList.remove('hidden');
        reviewBtn.textContent = '收起错题';
    } else {
        reviewSection.classList.add('hidden');
        reviewBtn.textContent = '查看错题';
    }
}

modePracticeBtn.addEventListener('click', enterPracticeMode);
modeRealExamBtn.addEventListener('click', enterRealExamMode);
backToHomeBtn.addEventListener('click', () => {
    updateHomeStats();
    showScreen(homeScreen);
});
backFromQuizBtn.addEventListener('click', () => {
    if (confirm('确定要退出答题吗？当前进度不会保存。')) {
        showScreen(startScreen);
    }
});
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', () => {
    updateStatsDisplay();
    showScreen(startScreen);
});
backHomeBtn.addEventListener('click', () => {
    updateHomeStats();
    showScreen(homeScreen);
});
reviewBtn.addEventListener('click', showReview);
if (resetStatsBtn) {
    resetStatsBtn.addEventListener('click', resetAllStats);
}

document.addEventListener('keydown', (e) => {
    if (!quizScreen.classList.contains('active')) return;
    
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7 };
    if (keyMap.hasOwnProperty(e.key)) {
        const index = keyMap[e.key];
        const optionEls = document.querySelectorAll('.option-item');
        if (optionEls[index]) {
            selectOption(index, optionEls[index]);
        }
    }
    
    if (e.key === 'Enter' && answered) {
        nextQuestion();
    }
});