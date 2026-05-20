#!/bin/bash
set -e

BASE="http://localhost:5000/api/admin/mlt/pipeline/generate"
LOGF="/home/runner/workspace/.local/mlt-run.log"
touch "$LOGF"

log() { echo "[$(date +%H:%M:%S)] $1" | tee -a "$LOGF"; }

generate_batch() {
  local disc="$1"
  local count="$2"
  local result
  result=$(curl -s -X POST "$BASE" \
    -H "Content-Type: application/json" \
    -d "{\"countryTrack\":\"both\",\"count\":$count,\"discipline\":\"$disc\",\"model\":\"gpt-4o-mini\",\"dryRun\":false,\"generateFlashcards\":true,\"adminId\":\"system\"}" \
    --connect-timeout 10 --max-time 600 2>&1)
  echo "$result"
}

DISCIPLINES=(
  "Clinical Chemistry:252"
  "Hematology:224"
  "Microbiology:196"
  "Immunohematology / Blood Banking:140"
  "Hemostasis / Coagulation:112"
  "Urinalysis & Body Fluids:84"
  "Immunology / Serology:84"
  "Molecular Diagnostics:70"
  "Laboratory Operations & Quality Management:70"
  "Phlebotomy & Specimen Collection:56"
  "Point-of-Care Testing:42"
  "Histotechnology:28"
  "Cytotechnology:14"
  "Mycology:14"
  "Parasitology:7"
  "Virology:7"
)

BATCH=50
TOTAL_Q=0
TOTAL_F=0
BATCH_NUM=0

log "=== Starting 1400 MLT Question Generation ==="

for entry in "${DISCIPLINES[@]}"; do
  IFS=':' read -r disc target <<< "$entry"
  remaining=$target
  
  while [ "$remaining" -gt 0 ]; do
    sz=$remaining
    [ "$sz" -gt "$BATCH" ] && sz=$BATCH
    
    BATCH_NUM=$((BATCH_NUM + 1))
    log "Batch $BATCH_NUM: $disc ($sz qs, $remaining left)"
    
    result=$(generate_batch "$disc" "$sz")
    
    accepted=$(echo "$result" | grep -oP '"totalAccepted":\K[0-9]+' 2>/dev/null || echo "0")
    flashcards=$(echo "$result" | grep -oP '"flashcardsCreated":\K[0-9]+' 2>/dev/null || echo "0")
    
    if [ "$accepted" = "0" ] && echo "$result" | grep -q "error"; then
      log "  FAILED: $(echo "$result" | head -c 200)"
    else
      log "  OK: $accepted accepted, $flashcards flashcards"
    fi
    
    TOTAL_Q=$((TOTAL_Q + accepted))
    TOTAL_F=$((TOTAL_F + flashcards))
    remaining=$((remaining - sz))
    
    log "  Running total: $TOTAL_Q questions, $TOTAL_F flashcards"
    sleep 1
  done
done

log ""
log "=== FINAL: $TOTAL_Q questions, $TOTAL_F flashcards, $BATCH_NUM batches ==="
