// --- 1. أنيميشن الخلفية (Canvas) ---
const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setCanvasSize();

let particlesArray;

// إنشاء الجزيئات
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

    // رسم خطوط بين النقاط القريبة (شبكة)
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

// --- 2. أنيميشن ظهور العناصر عند السكرول (Scroll Reveal) ---
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

async function analyzeEmail() {
  const text = document.getElementById("emailText").value;

  if (text.trim().length < 10) {
    alert("Please paste a full email.");
    return;
  }

  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: text })
  });

  const data = await response.json();

 renderResult(data);
}

function renderResult(data) {
  const resultCard = document.getElementById("resultCard");
  const riskTitle = document.getElementById("riskTitle");
  const riskScore = document.getElementById("riskScore");
  const phishingType = document.getElementById("phishingType");
  const reasonsList = document.getElementById("reasonsList");
  const recommendationText = document.getElementById("recommendationText");

  resultCard.classList.remove("hidden", "high", "medium", "low");

  riskTitle.textContent = data.risk_level;
  riskScore.textContent = (data.risk_score * 100).toFixed(2) + "%";
  phishingType.textContent = data.phishing_type || "Unknown";
  recommendationText.textContent = data.recommendation;

  if (data.risk_score >= 0.7) {
    resultCard.classList.add("high");
  } else if (data.risk_score >= 0.4) {
    resultCard.classList.add("medium");
  } else {
    resultCard.classList.add("low");
  }

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

  resultCard.scrollIntoView({ behavior: "smooth" });

  const infoCards = document.querySelectorAll(".info-card");

infoCards.forEach(card => {
  card.classList.remove("high", "medium", "low");
  card.classList.add(riskLevel);
});

}
