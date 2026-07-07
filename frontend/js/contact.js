// ── CONTACT FORM — Validation & Submission ───────────────────────

(function () {
  'use strict';

  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (!form) return;

  // ── VALIDATORS ─────────────────────────────────────────
  const validators = {
    firstName: {
      el: document.getElementById('firstName'),
      err: document.getElementById('firstNameErr'),
      validate(v) {
        if (!v.trim()) return 'First name is required.';
        if (v.trim().length < 2) return 'Please enter at least 2 characters.';
        return '';
      }
    },
    lastName: {
      el: document.getElementById('lastName'),
      err: document.getElementById('lastNameErr'),
      validate(v) {
        if (!v.trim()) return 'Last name is required.';
        if (v.trim().length < 2) return 'Please enter at least 2 characters.';
        return '';
      }
    },
    email: {
      el: document.getElementById('email'),
      err: document.getElementById('emailErr'),
      validate(v) {
        if (!v.trim()) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
        return '';
      }
    },
    projectType: {
      el: document.getElementById('projectType'),
      err: document.getElementById('projectTypeErr'),
      validate(v) {
        if (!v) return 'Please select a project type.';
        return '';
      }
    },
    message: {
      el: document.getElementById('message'),
      err: document.getElementById('messageErr'),
      validate(v) {
        if (!v.trim()) return 'Please tell us about your project.';
        if (v.trim().length < 20) return 'Please provide at least 20 characters.';
        return '';
      }
    }
  };

  // ── INLINE VALIDATION ────────────────────────────────────
  Object.values(validators).forEach(({ el, err, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const msg = validate(el.value);
        err.textContent = msg;
        el.classList.toggle('error', !!msg);
      }
    });
  });

  // ── FORM SUBMIT ──────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Run all validators
    let valid = true;
    Object.values(validators).forEach(({ el, err, validate }) => {
      if (!el) return;
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) valid = false;
    });

    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Collect form data
    const payload = {
      firstName:   document.getElementById('firstName').value.trim(),
      lastName:    document.getElementById('lastName').value.trim(),
      email:       document.getElementById('email').value.trim(),
      phone:       document.getElementById('phone').value.trim(),
      projectType: document.getElementById('projectType').value,
      budget:      document.getElementById('budget').value,
      message:     document.getElementById('message').value.trim(),
      newsletter:  document.getElementById('newsletter').checked,
      submittedAt: new Date().toISOString()
    };

    // Show loading state
    submitBtn.querySelector('.btn-text').hidden = true;
    submitBtn.querySelector('.btn-loading').hidden = false;
    submitBtn.disabled = true;

    try {
      // Simulate API call (replace with real endpoint)
      await simulateApiCall(payload);

      // Success
      form.style.display = 'none';
      formSuccess.hidden = false;

      // Also save to localStorage as fallback cache
      saveSubmissionLocally(payload);

    } catch (error) {
      submitBtn.querySelector('.btn-text').hidden = false;
      submitBtn.querySelector('.btn-loading').hidden = true;
      submitBtn.disabled = false;

      showToast('Something went wrong. Please try again or email us directly.', 'error');
    }
  });

  // ── SIMULATE API CALL ─────────────────────────────────────
  function simulateApiCall(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate for demo
        if (Math.random() > 0.05) {
          console.log('[Lumina] Form submission:', data);
          resolve({ success: true, id: `LM-${Date.now()}` });
        } else {
          reject(new Error('Network error'));
        }
      }, 1800);
    });
  }

  function saveSubmissionLocally(data) {
    try {
      const key = `lumina_inquiry_${Date.now()}`;
      const all = JSON.parse(sessionStorage.getItem('lumina_inquiries') || '[]');
      all.push({ key, ...data });
      sessionStorage.setItem('lumina_inquiries', JSON.stringify(all));
    } catch (_) {}
  }

  // ── TOAST NOTIFICATION ────────────────────────────────────
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
      background:${type === 'error' ? '#C05A3A' : '#B8923A'};
      color:white; padding:14px 28px; border-radius:4px;
      font-family:'DM Sans',sans-serif; font-size:0.85rem;
      box-shadow:0 8px 24px rgba(0,0,0,0.2); z-index:9999;
      animation:toastIn 0.3s ease;
    `;
    toast.textContent = message;

    const style = document.createElement('style');
    style.textContent = `@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
  }

  // ── NAV SCROLL ───────────────────────────────────────────
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
  }

})();
