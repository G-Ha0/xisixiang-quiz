const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let wrongQuestions = [];
let answered = false;

const sampleQuestions = [
    {
        type: "single",
        question: "马克思主义中国化的第一个重大理论成果是？",
        options: [
            "毛泽东思想",
            "邓小平理论",
            "“三个代表”重要思想",
            "科学发展观"
        ],
        answer: [0],
        explanation: "毛泽东思想是马克思主义中国化的第一个重大理论成果。毛泽东思想是马克思列宁主义在中国的运用和发展，是被实践证明了的关于中国革命和建设的正确的理论原则和经验总结，是中国共产党集体智慧的结晶。"
    },
    {
        type: "single",
        question: "中国特色社会主义进入新时代的时间标志是？",
        options: [
            "党的十八大",
            "党的十九大",
            "党的十八届三中全会",
            "党的十九届四中全会"
        ],
        answer: [1],
        explanation: "党的十九大报告指出，经过长期努力，中国特色社会主义进入了新时代，这是我国发展新的历史方位。作出这个重大政治判断，是改革开放以来我国经济社会发展进步的必然结果，是我国社会主要矛盾运动的必然结果，是党团结带领人民开创光明未来的必然要求。"
    },
    {
        type: "single",
        question: "我国社会主要矛盾已经转化为？",
        options: [
            "人民日益增长的物质文化需要同落后的社会生产之间的矛盾",
            "人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾",
            "无产阶级和资产阶级之间的矛盾",
            "生产力和生产关系之间的矛盾"
        ],
        answer: [1],
        explanation: "党的十九大明确指出，我国社会主要矛盾已经转化为人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾。主要依据有以下三个方面：一是经过改革开放40年的发展，我国社会生产力水平总体上显著提高，很多方面进入世界前列。二是人民生活水平显著提高，对美好生活的向往更加强烈。三是影响满足人们美好生活需要的因素很多，但主要是发展的不平衡不充分问题。"
    },
    {
        type: "multiple",
        question: "“四个全面”战略布局包括？",
        options: [
            "全面建设社会主义现代化国家",
            "全面深化改革",
            "全面依法治国",
            "全面从严治党"
        ],
        answer: [0, 1, 2, 3],
        explanation: "“四个全面”战略布局，即全面建设社会主义现代化国家、全面深化改革、全面依法治国、全面从严治党。“四个全面”战略布局是党在新形势下治国理政的总方略，是事关党和国家长远发展的总战略。"
    },
    {
        type: "multiple",
        question: "新发展理念包括？",
        options: [
            "创新、协调",
            "绿色、开放",
            "共享",
            "高速"
        ],
        answer: [0, 1, 2],
        explanation: "新发展理念是习近平新时代中国特色社会主义经济思想的主要内容，包括创新、协调、绿色、开放、共享的发展理念。创新是引领发展的第一动力，协调是持续健康发展的内在要求，绿色是永续发展的必要条件，开放是国家繁荣发展的必由之路，共享是中国特色社会主义的本质要求。"
    },
    {
        type: "single",
        question: "中国共产党的根本宗旨是？",
        options: [
            "实现共产主义",
            "全心全意为人民服务",
            "解放和发展生产力",
            "建设社会主义现代化强国"
        ],
        answer: [1],
        explanation: "全心全意为人民服务是中国共产党的根本宗旨。中国共产党始终代表最广大人民根本利益，与人民休戚与共、生死相依，没有任何自己特殊的利益，从来不代表任何利益集团、任何权势团体、任何特权阶层的利益。"
    },
    {
        type: "single",
        question: "社会主义的本质是？",
        options: [
            "公有制和按劳分配",
            "解放生产力，发展生产力，消灭剥削，消除两极分化，最终达到共同富裕",
            "人民当家作主",
            "无产阶级专政"
        ],
        answer: [1],
        explanation: "邓小平在1992年南方谈话中提出了社会主义本质的著名论断：“社会主义的本质，是解放生产力，发展生产力，消灭剥削，消除两极分化，最终达到共同富裕。”这一论断，从生产力和生产关系的统一中，科学地回答了什么是社会主义的问题。"
    },
    {
        type: "multiple",
        question: "以下属于“五位一体”总体布局的有？",
        options: [
            "经济建设",
            "政治建设",
            "文化建设",
            "社会建设"
        ],
        answer: [0, 1, 2, 3],
        explanation: "“五位一体”总体布局是指经济建设、政治建设、文化建设、社会建设、生态文明建设五位一体。“五位一体”总体布局是一个有机整体，其中经济建设是根本，政治建设是保证，文化建设是灵魂，社会建设是条件，生态文明建设是基础。"
    },
    {
        type: "single",
        question: "中国梦的本质是？",
        options: [
            "国家富强、民族振兴、人民幸福",
            "实现共产主义",
            "全面建成小康社会",
            "建设社会主义现代化强国"
        ],
        answer: [0],
        explanation: "中国梦的本质是国家富强、民族振兴、人民幸福。国家富强，是指我国综合国力进一步增强，中国特色社会主义事业进一步发展和完善。民族振兴，就是通过自身的不断发展与强大，继承并创造中华民族的优秀文化以及先进的文明成果，进而使中华民族再次处于世界领先的地位。人民幸福，就是人民权利保障更加充分、人人得享共同发展。"
    },
    {
        type: "single",
        question: "党执政兴国的第一要务是？",
        options: [
            "改革",
            "发展",
            "稳定",
            "创新"
        ],
        answer: [1],
        explanation: "发展是党执政兴国的第一要务。发展是解决我国一切问题的基础和关键。实现中华民族伟大复兴的中国梦，不断提高人民生活水平，必须坚定不移把发展作为党执政兴国的第一要务，坚持解放和发展社会生产力，坚持社会主义市场经济改革方向，推动经济持续健康发展。"
    }
];

const STORAGE_KEY = 'quiz_app_stats';

function loadStats() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
    } catch (e) {}
    return { questionRecords: {} };
}

function saveStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
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
    const doneEl = document.getElementById('stat-done');
    const wrongEl = document.getElementById('stat-wrong-total');
    if (doneEl) doneEl.textContent = getAllDoneCount(allQuestions);
    if (wrongEl) wrongEl.textContent = getWrongCount(allQuestions);
}

function resetAllStats() {
    if (confirm('确定要重置所有答题进度吗？错题记录也会被清空。')) {
        localStorage.removeItem(STORAGE_KEY);
        updateStatsDisplay();
        alert('进度已重置！');
    }
}

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const fileStatus = document.getElementById('file-status');
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
const reviewSection = document.getElementById('review-section');
const reviewList = document.getElementById('review-list');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                allQuestions = data;
                fileStatus.textContent = `已加载：${data.length} 道题目`;
                fileStatus.style.color = '#10b981';
                updateStatsDisplay();
                return;
            }
        }
    } catch (e) {
    }
    allQuestions = sampleQuestions;
    updateStatsDisplay();
}

loadQuestions();

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
    startScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    screen.classList.add('active');
}

function startQuiz() {
    let count = parseInt(questionCountSelect.value);
    let typeFilter = questionTypeSelect.value;
    let mode = practiceModeSelect.value;

    let filteredQuestions = allQuestions;
    if (typeFilter !== 'all') {
        filteredQuestions = allQuestions.filter(q => q.type === typeFilter);
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

    if (question.type === 'single') {
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
    explanationText.textContent = question.explanation;

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
                <div class="review-explanation">📝 解析：${item.explanation}</div>
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

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if (Array.isArray(data) && data.length > 0) {
                const valid = validateQuestions(data);
                if (valid) {
                    allQuestions = data;
                    fileStatus.textContent = `已加载：${data.length} 道题目`;
                    fileStatus.style.color = '#10b981';
                } else {
                    alert('题目数据格式不正确，请检查格式！');
                }
            } else {
                alert('题目数据格式不正确，应为非空数组！');
            }
        } catch (err) {
            alert('JSON文件解析失败，请检查文件格式！');
        }
    };
    reader.readAsText(file);
}

function validateQuestions(questions) {
    for (const q of questions) {
        if (!q.question || !Array.isArray(q.options) || !Array.isArray(q.answer) || q.answer.length === 0) {
            return false;
        }
        if (!q.type || !['single', 'multiple'].includes(q.type)) {
            return false;
        }
        for (const ans of q.answer) {
            if (ans < 0 || ans >= q.options.length) {
                return false;
            }
        }
    }
    return true;
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', () => {
    updateStatsDisplay();
    showScreen(startScreen);
});
reviewBtn.addEventListener('click', showReview);
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
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
