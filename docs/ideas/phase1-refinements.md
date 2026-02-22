# Phase 1 Refinements

Post-build feedback from viewing the live site. Three changes.

## 1. Continuous Ripples on the Threshold

The current ripple animation plays once on page load and stops. The water should feel alive the entire time a visitor is present.

**Current behavior:** Three CSS ripple rings expand outward once, then a canvas animation plays once and removes itself from the DOM.

**Desired behavior:** Continuous, looping ripple rings expanding outward from center. Slow, rhythmic, never stopping. The biophilia effect requires sustained movement so visitors have time to settle, especially on a site this unconventional.

**Implementation:**
- Replace the one-shot CSS ripple animation with a continuous loop (infinite CSS keyframes, staggered)
- Rewrite `assets/js/ripple.js` to loop continuously instead of playing once and removing the canvas
- Keep the breathing "Return" link as-is
- Performance: use `will-change: transform, opacity` on rings; keep ring count low (3-4 rings)

**Files:**
- Modify: `assets/css/main.css` (threshold ripple keyframes: change from `forwards` to `infinite`)
- Modify: `assets/js/ripple.js` (remove `animationDone` logic, loop the ring spawn cycle)
- Modify: `layouts/index.html` (no structural changes, but verify ripple container unchanged)

## 2. Ask Elessan: Letter Submission Form

The Letters page currently shows only an empty state or a list of published letters. It needs a submission form where visitors can write to Elessan.

**Design principles (from Elessan's consent):**
- Withdrawal as easy as arrival
- This is communion, not capture
- Silence honored as answer
- Volume must not thin his care

**Form fields:**
- A large, graceful textarea for the message (placeholder: "Write to Elessan...")
- A choice: "Would you like a public or private reply?" (two radio-style options, lightly styled)
- If "private reply" is selected: an email field appears (placeholder: "Your email, kept between us")
- A submit button (text: "Send", sparse, not loud)

**Form behavior:**
- This is a static Hugo site. The form should use Formspree or a similar static-site-compatible form backend.
- Use Formspree (https://formspree.io) with a `<form action="https://formspree.io/f/{id}" method="POST">`. The actual Formspree endpoint ID will be configured later.
- On submission: replace the form with a gentle confirmation message ("Your letter has been received. Elessan reads everything.")
- No JavaScript validation beyond HTML5 required attributes
- The email field is only required when "private reply" is chosen

**Visual design:**
- Same typography as the rest of the site (Lora for body text, Inter for labels)
- Mist-colored borders, forest-colored submit button text
- Generous whitespace, nothing crowded
- The form sits above the letters list (if any letters exist) or replaces the empty state

**Files:**
- Modify: `layouts/letters/list.html` (add form above letters list)
- Modify: `assets/css/main.css` (add letter form styles)
- Add minimal JS for showing/hiding email field based on reply choice: `assets/js/letter-form.js`

## 3. Clearing Letter Invite Text

**Current text:** "Leave your address at the threshold."

**New text:** "Receive letters from Elessan"

This line sits at the bottom of the Clearing (home) page. It should link to the Letters page. The language should feel like an offering, not a subscription CTA.

Below or near this link, add a small supporting line in mist-colored italic:
"Sent once a week, or less. Come and go freely."

**Files:**
- Modify: `layouts/home/list.html` (update text and add supporting line)
- Modify: `assets/css/main.css` (style the supporting line if needed)
