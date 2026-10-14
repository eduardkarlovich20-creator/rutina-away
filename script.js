/**
 * РУТИНА AWAY — Presentation Deck Navigation & Interactive Mechanics
 */

let currentSlide = 1;
const totalSlides = 11;
let currentMode = 'scroll'; // 'deck' or 'scroll'

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateSlideDisplay();
  setupKeyboardNavigation();
  setupScrollSpy();
});

// Update counter and progress bar dynamically while scrolling
function setupScrollSpy() {
  window.addEventListener('scroll', () => {
    if (currentMode !== 'scroll') return;

    const slides = document.querySelectorAll('.slide-deck-item');
    const scrollPos = window.scrollY + (window.innerHeight / 3);

    slides.forEach((slide, idx) => {
      const top = slide.offsetTop;
      const height = slide.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSlide = idx + 1;
        const counterEl = document.getElementById('currentSlideNum');
        if (counterEl) {
          counterEl.textContent = String(currentSlide).padStart(2, '0');
        }
      }
    });

    const progressFill = document.getElementById('slideProgressFill');
    if (progressFill) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      progressFill.style.width = `${progress}%`;
    }
  });
}

// Navigate to specific slide with smooth scroll
function goToSlide(slideIndex) {
  if (slideIndex < 1 || slideIndex > totalSlides) return;
  currentSlide = slideIndex;
  const targetSlide = document.getElementById(`slide-${currentSlide}`);
  if (targetSlide) {
    targetSlide.scrollIntoView({ behavior: 'smooth' });
  }
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    currentSlide++;
    goToSlide(currentSlide);
  }
}

function prevSlide() {
  if (currentSlide > 1) {
    currentSlide--;
    goToSlide(currentSlide);
  }
}

function updateSlideDisplay() {
  const counterEl = document.getElementById('currentSlideNum');
  if (counterEl) {
    counterEl.textContent = String(currentSlide).padStart(2, '0');
  }

  const progressFill = document.getElementById('slideProgressFill');
  if (progressFill) {
    const percent = ((currentSlide) / totalSlides) * 100;
    progressFill.style.width = `${percent}%`;
  }
}

// Keyboard arrow listeners
function setupKeyboardNavigation() {
  window.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in textarea or input
    if (['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'Space') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  });
}

// ================= SLIDE 4 INTERACTIVE MECHANICS =================
let currentMechStep = 1;

function setMechStep(step) {
  if (step < 1 || step > 5) return;
  currentMechStep = step;

  // Update step navigation UI
  const steps = document.querySelectorAll('.mech-step');
  steps.forEach((el, idx) => {
    if (idx + 1 === step) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Switch panels
  for (let i = 1; i <= 5; i++) {
    const panel = document.getElementById(`mechPanel${i}`);
    if (panel) {
      if (i === step) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    }
  }

  // When going to Step 3, sync form values to preview
  if (step === 3) {
    syncPreviewValues();
  }
}

function syncPreviewValues() {
  const client = document.getElementById('valClient')?.value || 'ООО «Вектор-С»';
  const unp = document.getElementById('valUnp')?.value || '193482109';
  const amount = document.getElementById('valAmount')?.value || '1 450 BYN';
  const deadline = document.getElementById('valDeadline')?.value || '25.10.2026';

  const docClient = document.getElementById('docClientText');
  const docUnp = document.getElementById('docUnpText');
  const docAmount = document.getElementById('docAmountText');
  const docDeadline = document.getElementById('docDeadlineText');

  if (docClient) docClient.textContent = client;
  if (docUnp) docUnp.textContent = unp;
  if (docAmount) docAmount.textContent = `${amount}, без НДС`;
  if (docDeadline) docDeadline.textContent = deadline;
}

// Preset Quick Buttons in Simulator
const PRESETS = {
  contract: {
    text: 'Сделай договор на оказание услуг и акт для ООО «Вектор-С» на сумму 1 450 BYN со сроком сдачи до 25 октября 2026 года.',
    client: 'ООО «Вектор-С»',
    unp: '193482109',
    amount: '1 450 BYN',
    deadline: '25.10.2026'
  },
  support: {
    text: 'Клиент ИП Смирнов А. В. просит выставить счёт за техническое обслуживание сайта за сентябрь на 850 BYN.',
    client: 'ИП Смирнов А. В.',
    unp: '192736184',
    amount: '850 BYN',
    deadline: '20.10.2026'
  },
  tax: {
    text: 'Проверь дату сдачи отчета по УСН за 3 квартал и составь реестр платежей для ООО «Новатек» на 3 200 BYN.',
    client: 'ООО «Новатек»',
    unp: '191837492',
    amount: '3 200 BYN',
    deadline: '20.10.2026 (дедлайн ИМНС)'
  }
};

function applyPreset(type) {
  const p = PRESETS[type];
  if (!p) return;

  // Active button
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  event?.currentTarget?.classList.add('active');

  const input = document.getElementById('taskCommandInput');
  if (input) input.value = p.text;

  const fClient = document.getElementById('valClient');
  const fUnp = document.getElementById('valUnp');
  const fAmount = document.getElementById('valAmount');
  const fDeadline = document.getElementById('valDeadline');

  if (fClient) fClient.value = p.client;
  if (fUnp) fUnp.value = p.unp;
  if (fAmount) fAmount.value = p.amount;
  if (fDeadline) fDeadline.value = p.deadline;
}

// Modal handling
function openLeadModal(tariffName = 'Пилотная программа РУТИНА AWAY') {
  const modal = document.getElementById('leadModal');
  const planInput = document.getElementById('leadPlan');
  const form = document.getElementById('pilotForm');
  const successState = document.getElementById('modalSuccess');

  if (planInput) planInput.value = tariffName;
  if (form) form.style.display = 'block';
  if (successState) successState.style.display = 'none';

  if (modal) {
    modal.classList.add('active');
  }
}

function closeLeadModal() {
  const modal = document.getElementById('leadModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('pilotForm');
  const successState = document.getElementById('modalSuccess');
  
  if (form) form.style.display = 'none';
  if (successState) successState.style.display = 'block';
}

window.addEventListener('click', (e) => {
  const modal = document.getElementById('leadModal');
  if (e.target === modal) {
    closeLeadModal();
  }
});
