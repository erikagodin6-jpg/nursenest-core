# Live Layout Drift Comparison

Generated: 2026-05-10T21:21:17.880Z

Live base: https://www.nursenest.ca

Local base: not provided. Set `NN_LAYOUT_AUDIT_LOCAL_BASE_URL=http://127.0.0.1:<port>` after a local production build to populate local-build rows.

## Marker Comparison

| Target | Route | Marker | Exists In Repo | Exists In Local Build | Exists In Raw HTML | Exists In Browser DOM | Exists In Live CSS | Asset Content-Type Correct | Conclusion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| live | homepage | `nn-home-marketing-rich-hero` | yes | n/a | no | no | yes | yes | C candidate: premium CSS exists but route body marker is absent from HTML. |
| live | homepage | `nn-premium-hero-grid` | yes | n/a | no | no | yes | yes | C candidate: premium CSS exists but route body marker is absent from HTML. |
| live | homepage | `nn-premium-hero-panel` | yes | n/a | no | no | yes | yes | C candidate: premium CSS exists but route body marker is absent from HTML. |
| live | learner-app | `data-nn-learner-dashboard-convergence` | yes | n/a | no | no | no | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | learner-app | `nn-learner-dashboard-convergence` | yes | n/a | no | no | yes | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | practice-tests-hub | `data-nn-learner-area="practice-tests"` | yes | n/a | no | no | no | yes | Auth-gated anonymous shell; requires authenticated capture for final route verdict. |
| live | practice-tests-hub | `data-nn-premium-platform-module="practice-tests"` | yes | n/a | no | no | no | yes | Auth-gated anonymous shell; requires authenticated capture for final route verdict. |
| live | practice-tests-hub | `nn-practice-tests-hub-premium` | yes | n/a | no | no | no | yes | Auth-gated anonymous shell; requires authenticated capture for final route verdict. |
| live | practice-tests-hub | `data-nn-practice-exam-hub-convergence` | yes | n/a | no | no | no | yes | Auth-gated anonymous shell; requires authenticated capture for final route verdict. |
| live | flashcards-hub | `data-nn-premium-flashcard-convergence` | yes | n/a | no | no | yes | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | flashcards-hub | `data-nn-premium-platform-module="flashcards"` | yes | n/a | no | no | no | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | flashcards-hub | `data-nn-e2e-flashcards-hub` | yes | n/a | no | no | no | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | flashcards-hub | `nn-flashcards-hub-premium` | yes | n/a | no | no | yes | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | report-card | `data-nn-learner-report-card-convergence` | yes | n/a | no | no | no | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | report-card | `nn-learner-report-card-convergence` | yes | n/a | no | no | yes | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | report-card | `nn-report-card-premium` | yes | n/a | no | no | yes | yes | C/auth-gated: premium CSS exists but anonymous HTML does not render route markers. |
| live | rn-questions-hub | `MarketingPracticeQuestionsHubClient` | yes | n/a | yes | yes | no | yes | Markers present in hydrated browser DOM. |
| live | rn-questions-hub | `PathwayHero` | yes | n/a | no | no | no | yes | Markers present in hydrated browser DOM. |
| live | rn-questions-hub | `Start Mix` | yes | n/a | yes | yes | no | yes | Markers present in hydrated browser DOM. |
| live | rn-lessons-hub | `nn-premium-lessons-system` | yes | n/a | yes | yes | yes | yes | Markers present in hydrated browser DOM. |
| live | rn-lessons-hub | `nn-premium-lessons-hub-hero` | yes | n/a | yes | yes | yes | yes | Markers present in hydrated browser DOM. |
| live | rn-lessons-hub | `data-nn-premium-full-platform-convergence` | yes | n/a | no | no | yes | yes | Markers present in hydrated browser DOM. |
| live | cat-entry | `cat` | yes | n/a | yes | yes | yes | yes | Markers present in hydrated browser DOM. |
| live | cat-entry | `adaptive` | yes | n/a | yes | yes | yes | yes | Markers present in hydrated browser DOM. |
| live | cat-entry | `NurseNest` | yes | n/a | yes | yes | no | yes | Markers present in hydrated browser DOM. |

## Static Asset Content-Type Proof

### live: homepage

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/?cb=1778448038557`
Assets discovered: 30 (26 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0470t3~ez4iqa.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

### live: learner-app

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/app?cb=1778448039543`
Assets discovered: 31 (27 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0470t3~ez4iqa.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

### live: practice-tests-hub

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/app/practice-tests?pathwayId=ca-rn-nclex-rn&cb=1778448040563`
Assets discovered: 31 (27 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0470t3~ez4iqa.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

### live: flashcards-hub

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/app/flashcards?pathwayId=ca-rn-nclex-rn&cb=1778448041932`
Assets discovered: 31 (27 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0470t3~ez4iqa.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

### live: report-card

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/app/account/report?cb=1778448042914`
Assets discovered: 31 (27 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0470t3~ez4iqa.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

### live: rn-questions-hub

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/canada/rn/nclex-rn/questions?cb=1778448043877`
Assets discovered: 32 (28 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0470t3~ez4iqa.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

### live: rn-lessons-hub

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/canada/rn/nclex-rn/lessons?cb=1778448045062`
Assets discovered: 33 (29 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-lmwpf3gpn~f.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

### live: cat-entry

Page: `200` `text/html; charset=utf-8` `https://www.nursenest.ca/canada/rn/nclex-rn/cat?cb=1778448045826`
Assets discovered: 32 (28 JS, 4 CSS); sampled: 10

| Asset | Status | Content-Type | Correct Type | Returned HTML |
| --- | ---: | --- | --- | --- |
| `/_next/static/chunks/00j6oip7rq4x1.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/06bv4~g8b-t_7.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/07_qakfj5smkh.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0fb55art1w3hj.css` | 200 | `text/css; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0-evlt20unw2w.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0.om4iw1bthpt.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03to.smy53z6l.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/03~yq9q893hmn.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/04.i-__.as.dk.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |
| `/_next/static/chunks/0470t3~ez4iqa.js` | 200 | `application/javascript; charset=UTF-8` | yes | no |

## Classification Notes

- A: redesign markers are not in repo/source.
- B: markers are in repo/local build but absent from live responses, indicating deployment drift/stale artifact/wrong source.
- C: markers are in live assets but the route renders another shell or branch.
- D: emitted `/_next/static` assets return HTML or wrong content-type.

