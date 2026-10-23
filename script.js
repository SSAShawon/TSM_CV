(() => {
  const idModal = document.getElementById('idModal');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxMedium = document.getElementById('lightboxMedium');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const prevWorkBtn = document.getElementById('prevWorkBtn');
  const nextWorkBtn = document.getElementById('nextWorkBtn');
  const toast = document.getElementById('statusToast');

  let lastFocusedElement = null;
  let toastTimer = null;
  let activeTriggers = [];
  let currentWorkIndex = 0;

  function openModal(modal, triggerEl) {
    lastFocusedElement = triggerEl || document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeButton = modal.querySelector('[data-close-modal]');
    if (closeButton) closeButton.focus();
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // Student ID Modal triggers
  document.querySelectorAll('[data-open-id]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(idModal, btn));
  });

  // Close buttons & backdrop clicks
  [idModal, lightboxModal].forEach((modal) => {
    modal.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => closeModal(modal));
    });
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  // Print / Save PDF triggers
  const printBtn = document.getElementById('printCvBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
  document.querySelectorAll('[data-print-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });

  // Copy Phone Number with accessible toast feedback
  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2600);
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject) => {
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(input);
        resolve();
      } catch (err) {
        document.body.removeChild(input);
        reject(err);
      }
    });
  }

  document.querySelectorAll('[data-copy-phone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const phone = btn.getAttribute('data-copy-phone');
      copyText(phone)
        .then(() => showToast('Copied mobile number: 01747-661141'))
        .catch(() => showToast('Mobile number: 01747-661141'));
    });
  });

  // Portfolio Category Filtering
  const filterTabs = Array.from(document.querySelectorAll('.filter-tab'));
  const workCards = Array.from(document.querySelectorAll('.work-card'));

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.getAttribute('data-filter');
      filterTabs.forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle('is-active', isCurrent);
        t.setAttribute('aria-selected', String(isCurrent));
      });

      workCards.forEach((card) => {
        const matches = selected === 'all' || card.getAttribute('data-category') === selected;
        card.hidden = !matches;
      });
    });
  });

  // Portfolio Lightbox Viewer
  function getVisibleTriggers() {
    return workCards
      .filter((card) => !card.hidden)
      .map((card) => card.querySelector('.work-trigger'));
  }

  function renderLightboxItem(index) {
    if (!activeTriggers.length) return;
    currentWorkIndex = (index + activeTriggers.length) % activeTriggers.length;
    const trigger = activeTriggers[currentWorkIndex];
    const imgEl = trigger.querySelector('img');

    lightboxImg.src = trigger.getAttribute('data-src');
    lightboxImg.alt = imgEl ? imgEl.alt : trigger.getAttribute('data-title');
    lightboxTitle.textContent = trigger.getAttribute('data-title');
    lightboxCategory.textContent = trigger.getAttribute('data-category-label');
    lightboxMedium.textContent = trigger.getAttribute('data-medium');
    lightboxCounter.textContent = `${currentWorkIndex + 1} / ${activeTriggers.length}`;
  }

  workCards.forEach((card) => {
    const trigger = card.querySelector('.work-trigger');
    trigger.addEventListener('click', () => {
      activeTriggers = getVisibleTriggers();
      const idx = activeTriggers.indexOf(trigger);
      renderLightboxItem(idx >= 0 ? idx : 0);
      openModal(lightboxModal, trigger);
    });
  });

  prevWorkBtn.addEventListener('click', () => renderLightboxItem(currentWorkIndex - 1));
  nextWorkBtn.addEventListener('click', () => renderLightboxItem(currentWorkIndex + 1));

  // Keyboard navigation & Escape support
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!idModal.hidden) closeModal(idModal);
      if (!lightboxModal.hidden) closeModal(lightboxModal);
    } else if (!lightboxModal.hidden && event.key === 'ArrowLeft') {
      renderLightboxItem(currentWorkIndex - 1);
    } else if (!lightboxModal.hidden && event.key === 'ArrowRight') {
      renderLightboxItem(currentWorkIndex + 1);
    }
  });
})();
