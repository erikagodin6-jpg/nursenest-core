#!/bin/bash
BASE_URL="http://localhost:5000/api/admin/mlt/pipeline/generate"
LOG_FILE="/home/runner/workspace/.local/mlt-1400-run.log"

echo "[$(date)] Starting 1400 MLT question generation" | tee -a $LOG_FILE

declare -A PLAN
PLAN["Clinical Chemistry"]=252
PLAN["Hematology"]=224
PLAN["Microbiology"]=196
PLAN["Immunohematology / Blood Banking"]=140
PLAN["Hemostasis / Coagulation"]=112
PLAN["Urinalysis & Body Fluids"]=84
PLAN["Immunology / Serology"]=84
PLAN["Molecular Diagnostics"]=70
PLAN["Laboratory Operations & Quality Management"]=70
PLAN["Phlebotomy & Specimen Collection"]=56
PLAN["Point-of-Care Testing"]=42
PLAN["Histotechnology"]=28
PLAN["Cytotechnology"]=14
PLAN["Mycology"]=14
PLAN["Parasitology"]=7
PLAN["Virology"]=7

BATCH_SIZE=50
TOTAL_ACCEPTED=0
TOTAL_FLASHCARDS=0
BATCH_NUM=0

for DISC in "Clinical Chemistry" "Hematology" "Microbiology" "Immunohematology / Blood Banking" "Hemostasis / Coagulation" "Urinalysis & Body Fluids" "Immunology / Serology" "Molecular Diagnostics" "Laboratory Operations & Quality Management" "Phlebotomy & Specimen Collection" "Point-of-Care Testing" "Histotechnology" "Cytotechnology" "Mycology" "Parasitology" "Virology"; do
  TARGET=${PLAN[$DISC]}
  REMAINING=$TARGET
  
  while [ $REMAINING -gt 0 ]; do
    if [ $REMAINING -lt $BATCH_SIZE ]; then
      THIS_BATCH=$REMAINING
    else
      THIS_BATCH=$BATCH_SIZE
    fi
    
    BATCH_NUM=$((BATCH_NUM + 1))
    echo "[$(date)] Batch $BATCH_NUM: $DISC ($THIS_BATCH questions, $REMAINING remaining for discipline)" | tee -a $LOG_FILE
    
    RESULT=$(curl -s -X POST "$BASE_URL" \
      -H "Content-Type: application/json" \
      -d "{\"countryTrack\":\"both\",\"count\":$THIS_BATCH,\"discipline\":\"$DISC\",\"model\":\"gpt-4o-mini\",\"dryRun\":false,\"generateFlashcards\":true,\"adminId\":\"system\"}" \
      --max-time 300)
    
    ACCEPTED=$(echo "$RESULT" | grep -o '"totalAccepted":[0-9]*' | grep -o '[0-9]*' | head -1)
    FLASHCARDS=$(echo "$RESULT" | grep -o '"flashcardsCreated":[0-9]*' | grep -o '[0-9]*' | head -1)
    
    if [ -z "$ACCEPTED" ]; then
      echo "[$(date)] Batch $BATCH_NUM FAILED: $RESULT" | tee -a $LOG_FILE
      ACCEPTED=0
      FLASHCARDS=0
    fi
    
    TOTAL_ACCEPTED=$((TOTAL_ACCEPTED + ACCEPTED))
    TOTAL_FLASHCARDS=$((TOTAL_FLASHCARDS + FLASHCARDS))
    
    echo "[$(date)] Batch $BATCH_NUM complete: accepted=$ACCEPTED flashcards=$FLASHCARDS | Running total: $TOTAL_ACCEPTED questions, $TOTAL_FLASHCARDS flashcards" | tee -a $LOG_FILE
    
    REMAINING=$((REMAINING - THIS_BATCH))
    
    sleep 2
  done
done

echo "" | tee -a $LOG_FILE
echo "[$(date)] === FINAL SUMMARY ===" | tee -a $LOG_FILE
echo "[$(date)] Total questions accepted: $TOTAL_ACCEPTED" | tee -a $LOG_FILE
echo "[$(date)] Total flashcards: $TOTAL_FLASHCARDS" | tee -a $LOG_FILE
echo "[$(date)] Total batches: $BATCH_NUM" | tee -a $LOG_FILE
echo "[$(date)] Complete!" | tee -a $LOG_FILE
