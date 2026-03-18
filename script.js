/**
 * الصفحة الرئيسية — الاستبيانات تعمل عبر الانتقال لصفحة الاختبار (quiz.html).
 * يتطلب تحميل config.js قبل هذا الملف لوجود QUIZ_CONFIG.
 */
var QUIZ_CONFIG = window.QUIZ_CONFIG || {};

(function () {
  "use strict";

  var selector = document.getElementById("quiz-selector");
  var runWrap = document.getElementById("quiz-run-wrap");
  var quizIntro = document.getElementById("quiz-intro");
  var quizBack = document.getElementById("quiz-back");
  var form = document.getElementById("quiz-form");
  var questionsEl = document.getElementById("quiz-questions");
  var progressBar = document.getElementById("quiz-progress-bar");
  var stepLabel = document.getElementById("quiz-step-label");
  var btnPrev = document.getElementById("quiz-prev");
  var btnNext = document.getElementById("quiz-next");
  var btnSubmit = document.getElementById("quiz-submit");

  if (!selector || !runWrap || !form || !questionsEl || !progressBar) return;

  var currentQuiz = null;
  var currentIndex = 0;
  var answers = [];

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function getQuestions() {
    return currentQuiz ? QUIZ_CONFIG[currentQuiz].questions : [];
  }

  function renderQuestion(index) {
    var questions = getQuestions();
    var q = questions[index];
    if (!q) return;
    var name = "q" + index;
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
    progressBar.style.width = pct + "%";
    progressBar.parentElement.setAttribute("aria-valuenow", Math.round(pct));
    stepLabel.textContent = "السؤال " + (currentIndex + 1) + " من " + total;
  }

  function updateButtons() {
    var total = getQuestions().length;
    btnPrev.hidden = currentIndex === 0;
    btnNext.hidden = currentIndex === total - 1;
    btnSubmit.hidden = currentIndex !== total - 1;
  }

  function startQuiz(quizKey) {
    currentQuiz = quizKey;
    var config = QUIZ_CONFIG[quizKey];
    if (!config) return;
    quizIntro.textContent = config.intro;
    answers = [];
    currentIndex = 0;
    selector.hidden = true;
    runWrap.hidden = false;
    renderQuestion(0);
    updateProgress();
    updateButtons();
  }

  function backToSelector() {
    currentQuiz = null;
    currentIndex = 0;
    answers = [];
    runWrap.hidden = true;
    selector.hidden = false;
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

  function getRangeForScore(quizKey, score) {
    var config = QUIZ_CONFIG[quizKey];
    if (!config || !config.ranges) return null;
    for (var i = 0; i < config.ranges.length; i++) {
      if (score <= config.ranges[i].max) return config.ranges[i];
    }
    return config.ranges[config.ranges.length - 1];
  }

  if (selector && !document.querySelector(".quiz-type-card[href]")) {
    selector.querySelectorAll(".quiz-type-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var q = btn.getAttribute("data-quiz");
        if (q && QUIZ_CONFIG[q]) startQuiz(q);
      });
    });
  }

  if (quizBack) quizBack.addEventListener("click", function (e) { e.preventDefault(); backToSelector(); });

  btnNext.addEventListener("click", goNext);
  btnPrev.addEventListener("click", goPrev);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (answers[currentIndex] == null) return;
    var score = getTotalScore();
    var path = window.location.pathname || "/";
    var sep = path.indexOf("?") === -1 ? "?" : "&";
    window.location.href = path + sep + "quiz=" + encodeURIComponent(currentQuiz) + "&score=" + score + "#quiz-results";
  });
})();

/**
 * Hero — Parallax
 */
(function () {
  "use strict";
  var hero = document.querySelector(".hero");
  var parallaxEl = document.querySelector("[data-parallax]");
  if (!hero || !parallaxEl) return;
  var ticking = false;
  function updateParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var rect = hero.getBoundingClientRect();
    var centerY = rect.top + rect.height / 2;
    var viewportCenter = window.innerHeight / 2;
    var offset = (centerY - viewportCenter) * 0.03;
    parallaxEl.style.transform = "translateY(" + offset + "px) scale(1.02)";
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  updateParallax();
})();

/**
 * Quiz Results — message, primary CTA, recommended book from quiz + score
 */
(function () {
  "use strict";
  var messageWrap = document.getElementById("quiz-results-message-wrap");
  var messageEl = document.getElementById("quiz-results-message");
  var ctaWrap = document.getElementById("quiz-result-cta-wrap");
  var ctaBtn = document.getElementById("quiz-result-cta");
  var booksGrid = document.querySelector(".quiz-books-grid");

  if (!messageWrap || !messageEl) return;

  var params = new URLSearchParams(window.location.search);
  var quiz = params.get("quiz");
  var scoreStr = params.get("score");
  var score = scoreStr !== null ? parseInt(scoreStr, 10) : NaN;

  if (!quiz || !QUIZ_CONFIG[quiz] || isNaN(score)) return;

  var config = QUIZ_CONFIG[quiz];
  var range = null;
  for (var i = 0; i < config.ranges.length; i++) {
    if (score <= config.ranges[i].max) {
      range = config.ranges[i];
      break;
    }
  }
  if (!range) range = config.ranges[config.ranges.length - 1];

  var messageText = range.message;
  if (config.disclaimer) messageText = config.disclaimer + "\n\n" + messageText;
  messageEl.textContent = messageText;
  var bookId = range.bookId || config.bookId;
  var ctaText = range.cta || config.cta;
  if (ctaWrap && ctaBtn) {
    ctaBtn.textContent = ctaText;
    ctaBtn.href = bookId + ".html";
    ctaWrap.hidden = false;
  }
  if (booksGrid && bookId) {
    booksGrid.querySelectorAll(".quiz-book-card").forEach(function (card) {
      if (card.getAttribute("data-book-id") === bookId) {
        card.classList.add("quiz-recommended");
      } else {
        card.classList.remove("quiz-recommended");
      }
    });
  }
})();

/**
 * Contact — form submit, thank-you
 */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  var formWrap = document.getElementById("contact-form-wrap");
  var thanks = document.getElementById("contact-thanks");
  if (!form || !formWrap || !thanks) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    formWrap.hidden = true;
    thanks.hidden = false;
    thanks.setAttribute("aria-live", "polite");
    form.reset();
  });
})();

/**
 * Nav — فتح/إغلاق قائمة الموبايل (نسخة مبسّطة وموثوقة)
 */
(function () {
  "use strict";

  function initNav() {
    var nav = document.getElementById("site-nav");
    var checkbox = document.getElementById("nav-open");
    var menu = document.getElementById("nav-menu");
    if (!nav || !checkbox) return;

    if (menu) {
      var links = menu.querySelectorAll("a");
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
          checkbox.checked = false;
        });
      }
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") checkbox.checked = false;
    });

    // تفعيل ظل الهيدر عند السكرول
    var scrollThreshold = 24;
    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNav);
  } else {
    initNav();
  }
})();

/**
 * زر الصوت على فيديو قسم «من أنا»
 */
(function () {
  "use strict";
  var done = false;
  function run() {
    if (done) return;
    var video = document.getElementById("about-video");
    var btn = document.getElementById("about-video-sound");
    if (!video || !btn) return;
    done = true;
    var iconMuted = btn.querySelector(".about-video-sound-icon--muted");
    var iconUnmuted = btn.querySelector(".about-video-sound-icon--unmuted");

    function updateIcon() {
      var m = video.muted;
      if (iconMuted) iconMuted.hidden = !m;
      if (iconUnmuted) iconUnmuted.hidden = m;
      btn.setAttribute("aria-label", m ? "تشغيل الصوت" : "كتم الصوت");
    }

    function toggleSound(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      video.muted = !video.muted;
      if (!video.muted) {
        video.volume = 1;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
      updateIcon();
    }

    btn.addEventListener("click", toggleSound, true);
    btn.addEventListener("touchend", function (e) {
      e.preventDefault();
      toggleSound(e);
    }, { passive: false });
    updateIcon();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  window.addEventListener("load", run, { once: true });
})();

/**
 * Scroll animations — ظهور ناعم للأقسام
 */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var sections = document.querySelectorAll("[data-animate]");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: [0, 0.05, 0.15]
    }
  );
  sections.forEach(function (el) {
    observer.observe(el);
  });
})();

/**
 * Smooth scroll للروابط الداخلية (#)
 */
(function () {
  "use strict";
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var href = anchor.getAttribute("href");
    if (href === "#" || !href) return;
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
