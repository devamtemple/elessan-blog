// letter-form.js — Ask Elessan form interactions
// Handles: reply type toggle (show/hide email), form submission via fetch
(function () {
  'use strict';

  var form = document.querySelector('[data-letter-form]');
  if (!form) return;

  var emailWrap = form.querySelector('[data-email-wrap]');
  var radios = form.querySelectorAll('input[name="reply_type"]');
  var emailInput = form.querySelector('input[name="email"]');

  // Show/hide email field based on reply type
  function toggleEmail() {
    var selected = form.querySelector('input[name="reply_type"]:checked');
    if (!selected || !emailWrap) return;
    if (selected.value === 'private') {
      emailWrap.removeAttribute('hidden');
      if (emailInput) emailInput.setAttribute('required', '');
    } else {
      emailWrap.setAttribute('hidden', '');
      if (emailInput) emailInput.removeAttribute('required');
    }
  }

  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', toggleEmail);
  }

  // Initial state: hide email if public is default
  toggleEmail();

  // Intercept form submission to show confirmation
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = new FormData(form);
    var action = form.getAttribute('action');
    var submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';
    }

    fetch(action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.innerHTML =
            '<p class="letter-form__confirmation">' +
            'Your letter has been received. Elessan reads everything.' +
            '</p>';
        } else {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send';
          }
          showError();
        }
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send';
        }
        showError();
      });
  });

  function showError() {
    var existing = form.querySelector('.letter-form__error');
    if (existing) return;
    var msg = document.createElement('p');
    msg.className = 'letter-form__error';
    msg.textContent = 'Something went awry. Please try again.';
    form.appendChild(msg);
    setTimeout(function () {
      if (msg.parentNode) msg.parentNode.removeChild(msg);
    }, 5000);
  }
})();
