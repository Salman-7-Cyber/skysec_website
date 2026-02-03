// --- 1. Canvas Background Animation ---
const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setCanvasSize();

let particlesArray;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
  }

  draw() {
    ctx.fillStyle = "#00f2ff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i = 0; i < 100; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 - distance / 1000})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
  setCanvasSize();
  init();
});

// --- 2. Scroll Reveal Animation ---
window.addEventListener("scroll", reveal);

function reveal() {
  const reveals = document.querySelectorAll(".reveal");

  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const revealTop = reveals[i].getBoundingClientRect().top;
    const revealPoint = 150;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add("active");
    }
  }
}

reveal();

// --- 3. Validation Helpers ---
function isTooShort(text) {
  return text.trim().length < 10;
}

function isTooLong(text) {
  return text.trim().length > 10000;
}

function isGibberish(text) {
  const trimmed = text.trim();
  const words = trimmed.match(/[a-zA-Z]{2,}/g);
  const wordCount = words ? words.length : 0;
  const totalTokens = trimmed.split(/\s+/).length;

  if (totalTokens > 0 && (wordCount / totalTokens) < 0.3) {
    return true;
  }

  const specialChars = trimmed.match(/[\[\]\{\}\^\\]/g);
  const specialCount = specialChars ? specialChars.length : 0;

  if (specialCount > trimmed.length * 0.2) {
    return true;
  }

  return false;
}

// --- 4. Code Detection ---
function containsCode(text) {
  const trimmed = text.trim();

  // HTML tags: <script>, <img>, <iframe>, <div>, <a href>, etc.
  const htmlTags = /<\s*(script|img|iframe|div|a|form|input|svg|object|embed|link|style|meta|body|html|head)\b[^>]*>/i;

  // JavaScript patterns
  const jsPatterns = /\b(function\s*\(|var\s+|let\s+|const\s+|=>|document\.|window\.|alert\s*\(|eval\s*\(|fetch\s*\(|XMLHttpRequest|console\.|require\s*\(|import\s+|export\s+)\b/i;

  // Python patterns
  const pythonPatterns = /\b(def\s+|import\s+|from\s+\w+\s+import|print\s*\(|class\s+\w+|if\s+__name__|self\.)\b/i;

  // PHP patterns
  const phpPatterns = /<\?php|\$_GET|\$_POST|\$_SERVER|echo\s+/i;

  // SQL patterns
  const sqlPatterns = /\b(SELECT\s+.*\s+FROM|INSERT\s+INTO|UPDATE\s+.*\s+SET|DELETE\s+FROM|DROP\s+TABLE|CREATE\s+TABLE|ALTER\s+TABLE|UNION\s+SELECT)\b/i;

  // C / C++ / Java patterns
  const cPatterns = /\b(#include\s*<|public\s+static|private\s+|protected\s+|int\s+main\s*\(|void\s+\w+\s*\(|System\.out\.print)\b/i;

  // Curly braces blocks (code structure)
  const curlyBraces = /\{[^}]*\}/;

  // Check each pattern
  if (htmlTags.test(trimmed)) return true;
  if (jsPatterns.test(trimmed)) return true;
  if (pythonPatterns.test(trimmed)) return true;
  if (phpPatterns.test(trimmed)) return true;
  if (sqlPatterns.test(trimmed)) return true;
  if (cPatterns.test(trimmed)) return true;

  // Curly braces + semicolons together = likely code
  if (curlyBraces.test(trimmed) && trimmed.includes(";")) return true;

  return false;
}

// --- 5. Retry / Delay Helper ---
function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const allButtons = document.querySelectorAll('button');
      for (let btn of allButtons) {
        if (btn.disabled) {
          if (attempt === 1) {
            btn.textContent = "Analyzing...";
          } else {
            btn.textContent = "Please wait...";
          }
        }
      }

      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error;
      console.warn("Attempt " + attempt + " failed:", error.message);

      if (attempt < maxRetries) {
        await delay(5);
      }
    }
  }

  throw lastError;
}
// --- (Hamburger Menu) ---
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mainNav = document.getElementById("mainNav");
  const navOverlay = document.getElementById("navOverlay");
  const projectsToggle = document.getElementById("projectsToggle");
  const projectsDropdown = document.getElementById("projectsDropdown");

  if (!hamburgerBtn || !mainNav || !navOverlay) return;

  hamburgerBtn.addEventListener("click", function () {
    hamburgerBtn.classList.toggle("active");
    mainNav.classList.toggle("open");
    navOverlay.classList.toggle("active");
  });

  navOverlay.addEventListener("click", function () {
    hamburgerBtn.classList.remove("active");
    mainNav.classList.remove("open");
    navOverlay.classList.remove("active");
  });

  if (projectsToggle && projectsDropdown) {
    projectsToggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        projectsDropdown.classList.toggle("open");
      }
    });
  }
});

// --- 6. Phishing Detection API ---
async function analyzeEmail() {
  const emailText = document.getElementById("emailText").value;

  // --- Validation ---
  if (!emailText || emailText.trim().length === 0) {
    alert("Please paste the email content first.");
    return;
  }

  if (isTooShort(emailText)) {
    alert("The text is too short.\nPlease paste a complete email to analyze.");
    return;
  }

  if (isTooLong(emailText)) {
    alert("The text is too long.\nPlease paste a shorter email to analyze.");
    return;
  }

  if (isGibberish(emailText)) {
    alert("The text appears to be unreadable or contains random characters.\nPlease paste a real email to analyze.");
    return;
  }

  if (containsCode(emailText)) {
    alert("Code detected in the input.\nThis tool only accepts email text, not code.\nPlease paste a real email to analyze.");
    return;
  }

  // --- Find the button ---
  const allButtons = document.querySelectorAll('button');
  let analyzeBtn = null;

  for (let btn of allButtons) {
    if (btn.textContent.includes("Analyze")) {
      analyzeBtn = btn;
      break;
    }
  }

  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";
  }

  // --- Send to API with retry ---
  try {
    const response = await fetchWithRetry(
      'https://salman7qari-phishing-email-detection.hf.space/analyze',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: emailText.trim() }),
        mode: 'cors',
      },
      3
    );

    const result = await response.json();
    console.log("API Result:", result);

    // --- Handle API errors ---
    if (!response.ok) {
      if (response.status === 400) {
        if (isTooShort(emailText)) {
          alert("The text is too short.\nPlease paste a complete email to analyze.");
        } else if (isTooLong(emailText)) {
          alert("The text is too long.\nPlease paste a shorter email to analyze.");
        } else if (isGibberish(emailText)) {
          alert("The text appears to be unreadable or contains random characters.\nPlease paste a real email to analyze.");
        } else if (containsCode(emailText)) {
          alert("Code detected in the input.\nThis tool only accepts email text, not code.\nPlease paste a real email to analyze.");
        } else {
          alert("The text could not be processed.\nPlease try pasting the email again.");
        }
      } else {
        alert("The service is temporarily unavailable.\nPlease try again in a few moments.");
      }
      return;
    }

    if (result.error) {
      alert("The text could not be processed.\nPlease try pasting the email again.");
      return;
    }

    renderResult(result);

  } catch (error) {
    console.error("All retries failed:", error);
    alert("The service is temporarily unavailable.\nPlease try again in a few moments.");
  } finally {
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "Analyze";
    }
  }
}

// --- 7. Render Results ---
function renderResult(data) {
  const resultCard = document.getElementById("resultCard");
  const riskTitle = document.getElementById("riskTitle");
  const riskScore = document.getElementById("riskScore");
  const phishingType = document.getElementById("phishingType");
  const reasonsList = document.getElementById("reasonsList");
  const recommendationText = document.getElementById("recommendationText");

  if (!resultCard) {
    console.error("resultCard element not found!");
    return;
  }

  resultCard.classList.remove("hidden", "high", "medium", "low");

  if (riskTitle) riskTitle.textContent = data.risk_level;
  if (riskScore) riskScore.textContent = (data.risk_score * 100).toFixed(2) + "%";
  if (phishingType) phishingType.textContent = data.phishing_type || "Unknown";
  if (recommendationText) recommendationText.textContent = data.recommendation;

  if (data.risk_score >= 0.7) {
    resultCard.classList.add("high");
  } else if (data.risk_score >= 0.4) {
    resultCard.classList.add("medium");
  } else {
    resultCard.classList.add("low");
  }

  if (reasonsList) {
    reasonsList.innerHTML = "";
    if (data.reasons && data.reasons.length > 0) {
      data.reasons.forEach(reason => {
        const li = document.createElement("li");
        li.textContent = reason;
        reasonsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No specific phishing indicators detected.";
      reasonsList.appendChild(li);
    }
  }

  resultCard.scrollIntoView({ behavior: "smooth" });
}
