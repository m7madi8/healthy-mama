/**
 * صفحة الاختبار المخصصة: نوع من الرابط، ثم عرض الأسئلة، ثم تحليل النتيجة والكتاب الموصى به.
 * يعتمد على QUIZ_CONFIG من config.js.
 */
function initQuizPage() {
  "use strict";

  var config = window.QUIZ_CONFIG;
  if (!config) return;

  var params = new URLSearchParams(window.location.search);
  var type = params.get("type");
  var pickEl = document.getElementById("quiz-page-pick");
  var runEl = document.getElementById("quiz-page-run");
  var resultsEl = document.getElementById("quiz-page-results");
  var titleEl = document.getElementById("quiz-page-title");
  var introEl = document.getElementById("quiz-page-intro");
  var progressBar = document.getElementById("quiz-page-progress-bar");
  var stepLabel = document.getElementById("quiz-page-step-label");
  var form = document.getElementById("quiz-page-form");
  var questionsEl = document.getElementById("quiz-page-questions");
  var btnPrev = document.getElementById("quiz-page-prev");
  var btnNext = document.getElementById("quiz-page-next");
  var btnSubmit = document.getElementById("quiz-page-submit");
  var resultScoreEl = document.getElementById("quiz-page-result-score");
  var resultStateEl = document.getElementById("quiz-page-result-state");
  var resultMessageEl = document.getElementById("quiz-page-result-message");
  var resultCta = document.getElementById("quiz-page-result-cta");
  var resultBookCard = document.getElementById("quiz-page-result-book-card");
  var resultBookTitle = document.getElementById("quiz-page-result-book-title");
  var resultBookLink = document.getElementById("quiz-page-result-book-link");
  var resultBookImg = document.getElementById("quiz-page-result-book-img");

  var quizConfig = null;
  var currentIndex = 0;
  var answers = [];

  var bookImages = { "book-postnatal": "1.png", "book-prep": "2.png", "book-pregnancy": "3.png" };

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function getQuestions() {
    return quizConfig && quizConfig.questions ? quizConfig.questions : [];
  }

  function renderQuestion(index) {
    if (!questionsEl) return;
    var questions = getQuestions();
    var q = questions[index];
    if (!q) return;
    var name = "qp" + index;
    var selected = answers[index] != null ? answers[index] : null;
    var html = "<div class=\"quiz-q\" data-q=\"" + index + "\"><p class=\"quiz-q-text\">" + escapeHtml(q.text) + "</p><div class=\"quiz-q-options\">";
    q.options.forEach(function (opt, i) {
      var checked = selected === i ? " checked=\"checked\"" : "";
      html += "<label class=\"quiz-option\"><input type=\"radio\" name=\"" + name + "\" value=\"" + i + "\"" + checked + "><span class=\"quiz-option-text\">" + escapeHtml(opt.text) + "</span></label>";
    });
    html += "</div></div>";
    questionsEl.innerHTML = html;
    questionsEl.querySelectorAll(".quiz-q").forEach(function (el) {
      el.style.display = "none";
    });
    var currentEl = questionsEl.querySelector("[data-q=\"" + index + "\"]");
    if (currentEl) currentEl.style.display = "block";
    questionsEl.querySelectorAll("input[name=\"" + name + "\"]").forEach(function (radio) {
      radio.addEventListener("change", function () {
        answers[index] = parseInt(radio.value, 10);
      });
    });
  }

  function updateProgress() {
    var questions = getQuestions();
    var total = questions.length;
    var pct = total ? ((currentIndex + 1) / total) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = pct + "%";
      progressBar.parentElement.setAttribute("aria-valuenow", Math.round(pct));
    }
    if (stepLabel) stepLabel.textContent = "السؤال " + (currentIndex + 1) + " من " + total;
  }

  function updateButtons() {
    var total = getQuestions().length;
    if (btnPrev) btnPrev.hidden = currentIndex === 0;
    if (btnNext) btnNext.hidden = currentIndex === total - 1;
    if (btnSubmit) btnSubmit.hidden = currentIndex !== total - 1;
  }

  function getTotalScore() {
    var questions = getQuestions();
    var sum = 0;
    for (var i = 0; i < questions.length; i++) {
      var o = answers[i];
      if (o == null) continue;
      var opt = questions[i].options[o];
      if (opt && typeof opt.value === "number") sum += opt.value;
    }
    return sum;
  }

  function getRangeForScore(score) {
    if (!quizConfig || !quizConfig.ranges) return null;
    for (var i = 0; i < quizConfig.ranges.length; i++) {
      if (score <= quizConfig.ranges[i].max) return quizConfig.ranges[i];
    }
    return quizConfig.ranges[quizConfig.ranges.length - 1];
  }

  function showPick() {
    if (pickEl) pickEl.hidden = false;
    if (runEl) runEl.hidden = true;
    if (resultsEl) resultsEl.hidden = true;
  }

  function showRun() {
    if (pickEl) { pickEl.hidden = true; pickEl.style.display = "none"; }
    if (runEl) { runEl.hidden = false; runEl.style.display = ""; }
    if (resultsEl) { resultsEl.hidden = true; resultsEl.style.display = "none"; }
  }

  function showResults() {
    if (pickEl) { pickEl.hidden = true; pickEl.style.display = "none"; }
    if (runEl) { runEl.hidden = true; runEl.style.display = "none"; }
    if (resultsEl) { resultsEl.hidden = false; resultsEl.style.display = ""; }
    if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startQuiz(key) {
    quizConfig = config[key];
    if (!quizConfig) return;
    document.title = (quizConfig.title || "الاختبار") + " | نوال عمر";
    if (titleEl) titleEl.textContent = quizConfig.title || "";
    if (introEl) introEl.textContent = quizConfig.intro || "";
    answers = [];
    currentIndex = 0;
    showRun();
    renderQuestion(0);
    updateProgress();
    updateButtons();
  }

  function goNext() {
    if (answers[currentIndex] == null) return;
    var total = getQuestions().length;
    if (currentIndex < total - 1) {
      currentIndex++;
      renderQuestion(currentIndex);
      updateProgress();
      updateButtons();
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion(currentIndex);
      updateProgress();
      updateButtons();
    }
  }

  function displayResult(score, range) {
    var maxScore = quizConfig.maxScore || 30;
    if (resultScoreEl) resultScoreEl.textContent = "نتيجتك: " + score + " من " + maxScore;
    var bookId = (range && range.bookId) ? range.bookId : (quizConfig.bookId || "book-postnatal");
    var bookTitle = (range && range.bookTitle) ? range.bookTitle : (quizConfig.bookTitle || "");
    var ctaText = (range && range.cta) ? range.cta : (quizConfig.cta || "احصلي على الكتاب");
    if (resultStateEl) {
      resultStateEl.textContent = range && range.stateTitle ? "حالتك: " + range.stateTitle : "";
      resultStateEl.style.display = range && range.stateTitle ? "" : "none";
    }
    var messageText = range ? range.message : "";
    if (quizConfig.disclaimer) messageText = quizConfig.disclaimer + "\n\n" + messageText;
    if (resultMessageEl) resultMessageEl.textContent = messageText;
    var bookUrl = bookId + ".html";
    if (resultCta) {
      resultCta.textContent = ctaText;
      resultCta.href = bookUrl;
    }
    if (resultBookTitle) resultBookTitle.textContent = bookTitle;
    if (resultBookLink) resultBookLink.href = bookUrl;
    if (resultBookImg) resultBookImg.src = bookImages[bookId] || "1.png";
    if (resultBookImg) resultBookImg.alt = bookTitle ? bookTitle : "";
    showResults();
  }

  if (pickEl) { pickEl.hidden = true; pickEl.style.display = "none"; }
  if (runEl) { runEl.hidden = true; runEl.style.display = "none"; }
  if (resultsEl) { resultsEl.hidden = true; resultsEl.style.display = "none"; }

  if (type && config[type]) {
    startQuiz(type);
  } else {
    if (pickEl) { pickEl.hidden = false; pickEl.style.display = ""; }
  }

  if (btnPrev) btnPrev.addEventListener("click", goPrev);
  if (btnNext) btnNext.addEventListener("click", goNext);
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (answers[currentIndex] == null) return;
      var score = getTotalScore();
      var range = getRangeForScore(score);
      displayResult(score, range);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuizPage);
} else {
  initQuizPage();
}
