window.addEventListener('load', () => {
    const playBtn = document.getElementById('play-btn');
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const nextBtn = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result-container');
    const correctAnswersElement = document.getElementById('correct-answers');

    let questions = [];
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    playBtn.addEventListener('click', startQuiz);

    nextBtn.addEventListener('click', () => {
        const userAnswer = document.querySelector('input[name="answer"]:checked').value;
        if (questions[currentQuestionIndex].choices.find(choice => choice.id == userAnswer).isCorrect) {
            correctAnswers++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    });

    function startQuiz() {
        fetch(`http://localhost:3000/api/questions`)

            .then(res => res.json())
            .then(data => {
                questions = data;
                currentQuestionIndex = 0;
                correctAnswers = 0;

                playBtn.parentElement.style.display = 'none';
                quizContainer.style.display = 'block';

                showQuestion();
            })
            .catch(err => {
                console.error(err);
                alert('Failed to start the quiz.');
            });
    }

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <h3>${question.text}</h3>
            ${question.choices.map(choice =>
            `<label>
                <input type="radio" name="answer" value="${choice.id}" required> 
                ${choice.text}
            </label>`).join('')}
        `;
    }

    function finishQuiz() {
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        correctAnswersElement.textContent = `You got ${correctAnswers} out of ${questions.length} correct!`;
    }
});
