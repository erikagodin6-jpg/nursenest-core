#!/usr/bin/env bash
# Legacy fast path (custom esbuild flags). For production deploys on Render/Railway,
# use scripts/production-build.sh so behavior matches package.json "build" + verify.
set -e

START_SECONDS=$SECONDS
elapsed() { echo "[$(( SECONDS - START_SECONDS ))s]"; }

echo "$(elapsed) === Deploy Build Start ==="

rm -rf dist
mkdir -p dist

echo "$(elapsed) Step 1: Compile i18n..."
SKIP_I18N_VALIDATION=1 npx tsx -e "
(async () => {
  const { compileI18n } = await import('./script/compile-i18n');
  await compileI18n();
  console.log('i18n compiled');
})();
"
echo "$(elapsed) i18n done"

echo "$(elapsed) Step 2: Server bundle..."
LOADER="--loader:.png=empty --loader:.jpg=empty --loader:.jpeg=empty --loader:.svg=empty --loader:.webp=empty --loader:.gif=empty"

EXTERNALS=$(node -e "
const p=JSON.parse(require('fs').readFileSync('package.json','utf-8'));
const allow=['@google/generative-ai','axios','connect-pg-simple','cors','date-fns','drizzle-orm','drizzle-zod','express','express-rate-limit','express-session','jsonwebtoken','memorystore','multer','nanoid','nodemailer','openai','passport','passport-local','pg','stripe','uuid','ws','xlsx','zod','zod-validation-error'];
const allDeps=[...Object.keys(p.dependencies||{}),...Object.keys(p.devDependencies||{})];
console.log(allDeps.filter(d=>!allow.includes(d)).map(e=>'--external:'+e).join(' '));
")

npx esbuild server/index.ts \
  --bundle --platform=node --format=cjs \
  --outfile=dist/index.cjs \
  --define:process.env.NODE_ENV=\"production\" \
  --minify --log-level=error \
  $LOADER \
  --external:../client/src/data/lessons/index \
  $EXTERNALS \
  --alias:@=client/src --alias:@shared=shared
echo "$(elapsed) server done"

echo "$(elapsed) Step 3: Client bundle (vite)..."
NODE_OPTIONS='--max-old-space-size=4096' npx vite build --logLevel error 2>&1
echo "$(elapsed) client done"

rm -rf dist/public/videos dist/public/translations 2>/dev/null || true

echo "$(elapsed) === Deploy Build Complete ==="
