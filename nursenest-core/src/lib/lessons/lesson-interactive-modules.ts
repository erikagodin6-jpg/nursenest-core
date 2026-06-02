import type {
  LessonInteractiveModule,
  LessonInteractiveModuleCategory,
  LessonInteractiveSoundLibraryItem,
  PathwayEmbeddedSoundLibraryId,
  PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import { CARDIAC_SOUND_RECORDS, type CardiacSoundRecord } from "@/lib/lessons/cardiac-sounds-library-data";
import { RESPIRATORY_SOUND_RECORDS, type RespiratorySoundRecord } from "@/lib/lessons/respiratory-sounds-library-data";
import { resolvePathwayLessonSoundLibraries } from "@/lib/lessons/pathway-lesson-sound-libraries";

const DEFAULT_SOUND_MODULE_CATEGORY: LessonInteractiveModuleCategory = "Assessment";

function respiratoryToItem(r: RespiratorySoundRecord): LessonInteractiveSoundLibraryItem {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    timing: r.timing,
    pitch: r.pitchQuality,
    clinicalSignificance: r.clinicalSignificance,
    commonCauses: [...r.commonCauses],
    audioUrl: r.audioSrc ?? null,
    auscultationSite: r.auscultationSite,
    waveformType: r.waveformType,
    allowedTiers: r.allowedTiers,
    countryNotes: r.countryNotes,
    clinicalPearl: r.clinicalPearl,
    miniQuestion: r.miniQuestion,
    examQuestionIds: [],
  };
}

function cardiacToItem(r: CardiacSoundRecord): LessonInteractiveSoundLibraryItem {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    timing: r.timing,
    pitch: r.pitchQuality,
    clinicalSignificance: r.clinicalSignificance,
    commonCauses: [...r.commonCauses],
    audioUrl: null,
    auscultationSite: r.auscultationSite,
    waveformType: r.waveformType,
    allowedTiers: r.allowedTiers,
    countryNotes: r.countryNotes,
    clinicalPearl: r.clinicalPearl,
    miniQuestion: r.miniQuestion,
    examQuestionIds: [],
  };
}

function hydrateSoundLibraryItems(library: PathwayEmbeddedSoundLibraryId): LessonInteractiveSoundLibraryItem[] {
  if (library === "respiratory_sounds") return RESPIRATORY_SOUND_RECORDS.map(respiratoryToItem);
  return CARDIAC_SOUND_RECORDS.map(cardiacToItem);
}

/**
 * Builds structured interactive modules for a pathway lesson (sound libraries from catalog metadata + inference).
 */
export function buildLessonInteractiveModules(lesson: PathwayLessonRecord): LessonInteractiveModule[] {
  const libs = resolvePathwayLessonSoundLibraries(lesson);
  const system = (lesson.system ?? lesson.bodySystem ?? "general").trim() || "general";
  return libs.map((soundLibrary) => ({
    id: `${lesson.slug}::${soundLibrary}`,
    type: "sound-library",
    soundLibrary,
    system,
    category: DEFAULT_SOUND_MODULE_CATEGORY,
    items: hydrateSoundLibraryItems(soundLibrary),
  }));
}

/** Prefer normalized `interactiveModules`; rebuild when missing (stale cache / legacy rows). */
export function getLessonInteractiveModules(lesson: PathwayLessonRecord): LessonInteractiveModule[] {
  if (lesson.interactiveModules?.length) return lesson.interactiveModules;
  return buildLessonInteractiveModules(lesson);
}
