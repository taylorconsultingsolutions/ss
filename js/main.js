/* ============================================================
   Savor & Simplify — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* --- Nav hamburger --- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Active nav link (mobile nav only; desktop active set in markup per page) --- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Cart counter (localStorage) --- */
  let cartCount = parseInt(localStorage.getItem('ss_cart') || '0', 10);

  function updateCartDisplay() {
    document.querySelectorAll('.nav__cart-count').forEach(el => {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    });
  }

  document.querySelectorAll('.product-card__add').forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      localStorage.setItem('ss_cart', cartCount);
      updateCartDisplay();
      const original = btn.innerHTML;
      btn.innerHTML = checkSVG();
      btn.style.background = 'var(--terracotta)';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
      }, 1200);
    });
  });

  updateCartDisplay();

  function checkSVG() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline></svg>`;
  }

  /* --- Wishlist toggle --- */
  document.querySelectorAll('.product-card__wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('active');
      btn.innerHTML = isActive ? heartFilledSVG() : heartSVG();
      btn.style.color = isActive ? 'var(--terracotta)' : '';
    });
  });

  function heartSVG() {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>`;
  }

  function heartFilledSVG() {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>`;
  }

  /* --- Product filter pills (homepage) --- */
  const pills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      productCards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });

  /* --- Newsletter form --- */
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter__input');
      const btn = newsletterForm.querySelector('.newsletter__submit');
      // Use browser constraint validation on the email input
      if (!input.checkValidity()) {
        input.reportValidity();
        input.style.borderColor = 'var(--terracotta)';
        return;
      }
      input.style.borderColor = '';
      btn.textContent = 'Subscribed!';
      btn.style.background = 'var(--terracotta)';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    });
  }

  /* --- Contact form --- */
  const contactForm = document.querySelector('.js-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.textContent = 'Message Sent!';
      btn.style.background = 'var(--terracotta)';
      contactForm.reset();
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
      }, 4000);
    });
  }

  /* --- Scroll fade-in (Intersection Observer) --- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* --- Shop sidebar filters (checkboxes, category only) --- */
  const checkboxes = document.querySelectorAll('.shop-filter__option input[type="checkbox"][value]');
  if (checkboxes.length) {
    checkboxes.forEach(cb => cb.addEventListener('change', applyShopFilters));
  }

  function applyShopFilters() {
    const checked = Array.from(checkboxes)
      .filter(cb => cb.checked && cb.value)
      .map(cb => cb.value);
    const shopCards = document.querySelectorAll('.shop-grid .product-card[data-category]');
    if (!shopCards.length) return;

    let visibleCount = 0;
    shopCards.forEach(card => {
      const show = !checked.length || checked.includes(card.dataset.category);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    const countEl = document.querySelector('.shop-main__count');
    if (countEl) countEl.textContent = visibleCount + ' products';
  }

})();
