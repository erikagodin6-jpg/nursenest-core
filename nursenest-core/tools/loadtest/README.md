# Load testing (k6)

Install [k6](https://k6.io/docs/getting-started/installation/), start the app (`npm run start` or `dev`), then:

```bash
cd nursenest-core
BASE_URL=http://127.0.0.1:3000 npm run loadtest:k6
```

Authenticated paths (lessons, questions, flashcards, account) run only when you pass a session cookie:

```bash
BASE_URL=http://127.0.0.1:3000 K6_SESSION_COOKIE='next-auth.session-token=YOUR_VALUE' npm run loadtest:k6
```

Tune thresholds in `k6-smoke.js`. Watch logs for `slow_query_detected`, `db_query_queue_pressure`, `get_user_access_timing` (`slowRead`), and `api_handler_slow` (when wired).
