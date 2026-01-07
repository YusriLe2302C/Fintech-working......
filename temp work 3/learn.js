/* ==========================================
   BUDGETWISE GENZ - LEARNING MODULE
   Gamified financial education
   ========================================== */

let currentLesson = null;

function initLearning() {
  loadLearningStats();
  renderModules();
}

function loadLearningStats() {
  const progress = Store.getLearningProgress();
  const achievements = Store.getAchievements();

  // Streak
  document.getElementById('streakCount').textContent = progress.currentStreak || 0;

  // Points and level
  document.getElementById('totalPoints').textContent = progress.totalPoints || 0;
  document.getElementById('levelText').textContent = `Level ${progress.level || 1}`;

  // Lessons completed
  const totalLessons = LearningData.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completed = progress.completedLessons.length;
  document.getElementById('lessonsCompleted').textContent = completed;
  document.getElementById('totalLessons').textContent = `of ${totalLessons}`;

  // Achievements
  document.getElementById('achievementCount').textContent = achievements.unlocked.length;
}

function renderModules() {
  const container = document.getElementById('modulesContainer');
  const progress = Store.getLearningProgress();
  const completedLessons = progress.completedLessons || [];

  container.innerHTML = LearningData.modules.map(module => {
    const moduleLessons = module.lessons;
    const completedInModule = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
    const progressPercent = (completedInModule / moduleLessons.length) * 100;

    return `
      <div class="card mb-2">
        <div class="flex-between mb-1">
          <div>
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
              <span style="font-size: 2.5rem;">${module.icon}</span>
              <div>
                <h2 style="margin: 0; font-size: 1.5rem;">${module.title}</h2>
                <p style="color: var(--text-secondary); margin: 0.25rem 0 0 0;">${module.description}</p>
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-purple);">
              ${completedInModule}/${moduleLessons.length}
            </div>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">Completed</p>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-bar" style="margin-bottom: 1.5rem;">
          <div class="progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
        
        <!-- Lessons -->
        <div style="display: grid; gap: 0.75rem;">
          ${moduleLessons.map(lesson => {
      const isCompleted = completedLessons.includes(lesson.id);
      return `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="font-size: 1.5rem;">${isCompleted ? '✅' : '📖'}</div>
                  <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${lesson.title}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                      ${isCompleted ? 'Completed' : `Earn ${lesson.points} points`}
                    </div>
                  </div>
                </div>
                <button class="btn-primary" onclick="openLessonById(${lesson.id}, ${module.id})" 
                        style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                  ${isCompleted ? 'Review' : 'Start'} →
                </button>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function openLessonById(lessonId, moduleId) {
  // Find the lesson in the data
  const module = LearningData.modules.find(m => m.id === moduleId);
  if (!module) return;

  const lesson = module.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  openLesson(lesson);
}

function openLesson(lesson) {
  currentLesson = lesson;

  document.getElementById('lessonTitle').textContent = lesson.title;
  document.getElementById('lessonContent').textContent = lesson.content;

  // Reset quiz section
  document.getElementById('quizSection').classList.add('hidden');
  document.getElementById('completeBtn').textContent = 'Take Quiz →';
  document.getElementById('completeBtn').onclick = showQuiz;

  document.getElementById('lessonModal').classList.remove('hidden');
}

function closeLessonModal() {
  document.getElementById('lessonModal').classList.add('hidden');
  currentLesson = null;
}

function showQuiz() {
  if (!currentLesson || !currentLesson.quiz) return;

  const quizSection = document.getElementById('quizSection');
  const quiz = currentLesson.quiz;

  document.getElementById('quizQuestion').textContent = quiz.question;

  const optionsHTML = quiz.options.map((option, index) => `
    <button class="quiz-option" onclick="selectAnswer(${index})" 
            style="padding: 1rem; background: var(--bg-card); border: 2px solid var(--border-color); 
                   border-radius: 12px; cursor: pointer; text-align: left; transition: all 0.2s;
                   font-family: Inter, sans-serif; color: var(--text-primary); font-size: 0.95rem;">
      ${option}
    </button>
  `).join('');

  document.getElementById('quizOptions').innerHTML = optionsHTML;
  document.getElementById('quizFeedback').classList.add('hidden');

  quizSection.classList.remove('hidden');
  document.getElementById('completeBtn').style.display = 'none';
}

function selectAnswer(selectedIndex) {
  if (!currentLesson) return;

  const quiz = currentLesson.quiz;
  const isCorrect = selectedIndex === quiz.correct;

  // Show feedback
  const feedback = document.getElementById('quizFeedback');
  feedback.className = '';
  feedback.classList.remove('hidden');

  if (isCorrect) {
    feedback.style.background = 'rgba(16, 185, 129, 0.2)';
    feedback.style.border = '2px solid var(--accent-green)';
    feedback.style.color = 'var(--accent-green)';
    feedback.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 2rem;">✅</span>
        <div>
          <div style="font-weight: 700; margin-bottom: 0.25rem;">Correct!</div>
          <div style="opacity: 0.9;">Great job! You earned ${currentLesson.points} points.</div>
        </div>
      </div>
      <button class="btn-success" onclick="completeLesson()" 
              style="margin-top: 1rem; width: 100%;">
        Mark as Complete
      </button>
    `;
  } else {
    feedback.style.background = 'rgba(239, 68, 68, 0.2)';
    feedback.style.border = '2px solid var(--cat-entertainment)';
    feedback.style.color = 'var(--cat-entertainment)';
    feedback.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 2rem;">❌</span>
        <div>
          <div style="font-weight: 700; margin-bottom: 0.25rem;">Not quite right</div>
          <div style="opacity: 0.9;">The correct answer is: ${quiz.options[quiz.correct]}</div>
        </div>
      </div>
      <button class="btn-primary" onclick="showQuiz()" 
              style="margin-top: 1rem; width: 100%;">
        Try Again
      </button>
    `;
  }

  // Disable all option buttons
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
  });
}

function completeLesson() {
  if (!currentLesson) return;

  const progress = Store.getLearningProgress();

  // Check if already completed
  if (!progress.completedLessons.includes(currentLesson.id)) {
    Store.completeLesson(currentLesson.id);

    // Check for achievements
    checkAchievements();

    Utils.showToast(`🎉 Lesson completed! +${currentLesson.points} points`);
  }

  closeLessonModal();
  loadLearningStats();
  renderModules();
}

function checkAchievements() {
  const progress = Store.getLearningProgress();
  const achievements = Store.getAchievements();

  // First lesson
  if (progress.completedLessons.length === 1 && !achievements.unlocked.includes('first_lesson')) {
    Store.unlockAchievement('first_lesson');
    Utils.showToast('🎯 Achievement Unlocked: Getting Started!');
  }

  // Week streak
  if (progress.currentStreak >= 7 && !achievements.unlocked.includes('week_streak')) {
    Store.unlockAchievement('week_streak');
    Utils.showToast('🔥 Achievement Unlocked: Week Warrior!');
  }

  // 100 points
  if (progress.totalPoints >= 100 && !achievements.unlocked.includes('point_100')) {
    Store.unlockAchievement('point_100');
    Utils.showToast('💯 Achievement Unlocked: Century!');
  }

  // All lessons
  const totalLessons = LearningData.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  if (progress.completedLessons.length === totalLessons && !achievements.unlocked.includes('all_lessons')) {
    Store.unlockAchievement('all_lessons');
    Utils.showToast('👑 Achievement Unlocked: Financial Guru!');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initLearning);
