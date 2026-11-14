// EQUILIBRIA · Private Health — Biological Age Assessment
// Each question has 4 options scored 0–3 (higher = stronger aging signal)

const QUESTIONS = [
  {
    title: "When do you usually fall asleep, and how is your sleep?",
    options: [
      { text: "Asleep before 11pm, straight through the night", score: 0 },
      { text: "Around midnight, occasional wake-ups", score: 1 },
      { text: "After 1am, or restless / waking often", score: 2 },
      { text: "Chronically late nights / rely on sleep aids", score: 3 },
    ],
  },
  {
    title: "In the first 30 minutes after waking, you usually feel…",
    options: [
      { text: "Awake and alert immediately", score: 0 },
      { text: "Need a coffee to come around", score: 1 },
      { text: "Foggy, sleepy through the morning", score: 2 },
      { text: "Running on caffeine all day", score: 3 },
    ],
  },
  {
    title: "How often do you exercise consistently each week?",
    options: [
      { text: "3+ times a week, mixing strength and cardio", score: 0 },
      { text: "1–2 times a week", score: 1 },
      { text: "Occasionally, when I remember", score: 2 },
      { text: "Almost never", score: 3 },
    ],
  },
  {
    title: "How much sugary drink / processed food is in your daily diet?",
    options: [
      { text: "Almost none", score: 0 },
      { text: "Occasionally, 1–2 times a week", score: 1 },
      { text: "Some every day", score: 2 },
      { text: "Mostly takeout, high sugar and fat", score: 3 },
    ],
  },
  {
    title: "What is the trend in your waistline / body fat?",
    options: [
      { text: "Stable for years, no belly fat", score: 0 },
      { text: "A bit more than a few years ago, but under control", score: 1 },
      { text: "Clear belly fat / high visceral fat", score: 2 },
      { text: "Weight keeps swinging, hard to control", score: 3 },
    ],
  },
  {
    title: "Over the past month, your stress level has been…",
    options: [
      { text: "Occasional stress, I can self-regulate", score: 0 },
      { text: "Often stressed, but sleep is fine", score: 1 },
      { text: "High stress, affecting sleep or appetite", score: 2 },
      { text: "Chronically wound up, near breaking", score: 3 },
    ],
  },
  {
    title: "After intense exercise or a late night, how long does recovery take?",
    options: [
      { text: "One good sleep and I'm fine", score: 0 },
      { text: "One to two days", score: 1 },
      { text: "Three or more days", score: 2 },
      { text: "Harder and harder to recover", score: 3 },
    ],
  },
  {
    title: "Standing on one leg with your eyes closed, how long can you hold?",
    options: [
      { text: "30 seconds or more", score: 0 },
      { text: "10–30 seconds", score: 1 },
      { text: "5–10 seconds", score: 2 },
      { text: "Under 5 seconds / can't balance", score: 3 },
    ],
  },
  {
    title: "Your smoking / drinking?",
    options: [
      { text: "No smoking, little or no alcohol", score: 0 },
      { text: "No smoking, but frequent social drinking", score: 1 },
      { text: "Occasional smoking, or regular drinking", score: 2 },
      { text: "Long-term smoker", score: 3 },
    ],
  },
  {
    title: "How old do people assume you are, compared to your actual age?",
    options: [
      { text: "Usually guessed 5+ years younger", score: 0 },
      { text: "About my age", score: 1 },
      { text: "Often look tired / worn", score: 2 },
      { text: "Usually guessed older", score: 3 },
    ],
  },
];

const BANDS = [
  {
    max: 7,
    offset: -6,
    title: "Your body is 5–8 years younger than your age",
    desc: "Your habits are putting the brakes on cellular aging. Don't relax — a few hidden risks tend to surface after forty-five, and it's worth knowing them early.",
    recs: [
      { text: "After forty-five, aging is decided by your cells", href: "article-1.html" },
      { text: "You're not tired because of a lack of sleep", href: "article-2.html" },
    ],
  },
  {
    max: 15,
    offset: 0,
    title: "Your body matches your actual age",
    desc: "You're holding even with your age — but your peers are quietly pulling ahead. Start on these three things and you can likely wind back about five years.",
    recs: [
      { text: "Strength first, then blood sugar, then sleep", href: "article-1.html" },
      { text: "The ten-minute recovery method", href: "article-2.html" },
    ],
  },
  {
    max: 23,
    offset: 4,
    title: "Your body is 3–5 years older than your age",
    desc: "Your body is already signaling: metabolism, energy, and recovery are all sliding. The good news — most of it is reversible. Start with the one that matters most.",
    recs: [
      { text: "Reverse the slide — start with strength", href: "article-1.html" },
      { text: "Find out why your recovery broke", href: "article-2.html" },
      { text: "Sugar is aging you faster than time", href: "article-3.html" },
    ],
  },
  {
    max: 30,
    offset: 8,
    title: "Your body is 8+ years older than your age",
    desc: "Don't panic — anti-aging isn't mysticism. Cellular repair has a clear path, and starting with one thing can produce visible change within three months.",
    recs: [
      { text: "Understand it at the cellular level first", href: "article-1.html" },
      { text: "The ten-minute, zero-cost recovery method", href: "article-2.html" },
      { text: "Sugar is aging you faster than time", href: "article-3.html" },
    ],
  },
];

function bandFor(score) {
  return BANDS.find((b) => score <= b.max) || BANDS[BANDS.length - 1];
}

const state = {
  age: null,
  answers: new Array(QUESTIONS.length).fill(null),
  current: 0,
};

const root = document.getElementById("quiz");
const ageEl = document.getElementById("quiz-age");
const progressFill = document.getElementById("quiz-progress-fill");
const progressCount = document.getElementById("quiz-progress-count");
const questionEl = document.getElementById("quiz-question");
const resultEl = document.getElementById("quiz-result");

function renderProgress() {
  const answered = state.answers.filter((a) => a !== null).length;
  const total = QUESTIONS.length;
  const pct = Math.round((answered / total) * 100);
  progressFill.style.width = pct + "%";
  progressCount.textContent = answered + " / " + total;
}

function renderQuestion() {
  resultEl.classList.remove("is-active");
  questionEl.style.display = "block";
  const q = QUESTIONS[state.current];

  let html =
    '<div class="quiz__question">' +
    '<div class="quiz__q-label">Question ' +
    (state.current + 1) +
    " / " +
    QUESTIONS.length +
    "</div>" +
    '<h2 class="quiz__q-title">' +
    q.title +
    "</h2>" +
    '<div class="quiz__options">';

  q.options.forEach((opt, i) => {
    const sel = state.answers[state.current] === i ? " is-selected" : "";
    html +=
      '<button type="button" class="quiz__option' +
      sel +
      '" data-index="' +
      i +
      '">' +
      opt.text +
      "</button>";
  });

  html += "</div>";

  html += '<div class="quiz__actions">';
  if (state.current > 0) {
    html +=
      '<button type="button" class="btn btn--ghost" id="quiz-back">Back</button>';
  }
  html +=
    '<button type="button" class="btn btn--primary" id="quiz-next" disabled>Next</button>';
  html += "</div></div>";

  questionEl.innerHTML = html;

  const nextBtn = document.getElementById("quiz-next");
  const backBtn = document.getElementById("quiz-back");

  const refreshNext = () => {
    if (!nextBtn) return;
    const hasAnswer = state.answers[state.current] !== null;
    const needsAge = state.current === 0 && state.age === null;
    nextBtn.disabled = !hasAnswer || needsAge;
  };

  questionEl.querySelectorAll(".quiz__option").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.answers[state.current] = parseInt(btn.dataset.index, 10);
      questionEl
        .querySelectorAll(".quiz__option")
        .forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      refreshNext();
    });
  });

  refreshNext();

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (state.current < QUESTIONS.length - 1) {
        state.current++;
        renderQuestion();
        renderProgress();
      } else {
        finish();
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (state.current > 0) {
        state.current--;
        renderQuestion();
        renderProgress();
      }
    });
  }

  renderProgress();
}

function finish() {
  const score = state.answers.reduce((a, b) => a + b, 0);
  const band = bandFor(score);
  const pct = Math.round((score / 30) * 100);

  questionEl.style.display = "none";
  progressFill.style.width = "100%";
  progressCount.textContent = QUESTIONS.length + " / " + QUESTIONS.length;

  let agesHtml =
    '<div class="result__ages"><div class="result__age">' +
    '<span class="result__age-num">' +
    score +
    "</span>" +
    '<span class="result__age-label">Aging-signal score (0–30)</span></div>';

  if (state.age && state.age > 0) {
    const bio = state.age + band.offset;
    agesHtml +=
      '<div class="result__age">' +
      '<span class="result__age-num">' +
      bio +
      " yrs</span>" +
      '<span class="result__age-label">Estimated biological age (actual ' +
      state.age +
      ")</span></div>";
  }

  agesHtml += "</div>";

  let recsHtml = "";
  band.recs.forEach((r) => {
    recsHtml += '<a href="' + r.href + '">' + r.text + " →</a>";
  });

  resultEl.innerHTML =
    '<div class="result__card">' +
    '<div class="result__label">Your result</div>' +
    agesHtml +
    '<div class="meter">' +
    '<div class="meter__labels"><span>Younger</span><span>Even</span><span>Older</span></div>' +
    '<div class="meter__track"><div class="meter__fill"></div><div class="meter__mark"></div></div>' +
    '<div class="meter__captions"><span>0</span><span>15</span><span>30</span></div>' +
    "</div>" +
    '<h3 class="result__title">' +
    band.title +
    "</h3>" +
    '<p class="result__desc">' +
    band.desc +
    "</p>" +
    '<div class="result__rec">' +
    recsHtml +
    "</div>" +
    '<a class="result__report" href="#report">Apply for access →</a>' +
    "</div>";

  requestAnimationFrame(() => {
    const fill = resultEl.querySelector(".meter__fill");
    const mark = resultEl.querySelector(".meter__mark");
    if (fill) fill.style.width = pct + "%";
    if (mark) mark.style.left = pct + "%";
  });

  resultEl.classList.add("is-active");
  resultEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

if (root) {
  const list = document.getElementById("age-list");
  const opts = [];
  for (let a = 18; a <= 100; a++) {
    opts.push('<option value="' + a + '"></option>');
  }
  if (list) list.innerHTML = opts.join("");

  ageEl.addEventListener("input", () => {
    const v = parseInt(ageEl.value, 10);
    state.age = isNaN(v) ? null : v;
    const nextBtn = document.getElementById("quiz-next");
    if (nextBtn && state.current === 0 && state.answers[0] !== null) {
      nextBtn.disabled = false;
    }
  });

  renderQuestion();
}
