import type {
  RuntimeCard,
  SessionAction,
  SessionCardPayload,
  SessionRuntime,
} from "./session-runtime-types";

export function createSessionRuntime(
  cards: SessionCardPayload[],
  sessionId: string,
): SessionRuntime {
  return {
    sessionId,
    currentIndex: 0,
    totalCards: cards.length,
    cards: cards.map((c) => ({
      cardId: c.cardId,
      state: "UNANSWERED",
      revealed: false,
    })),
    metrics: { correct: 0, incorrect: 0, guessed: 0, bookmarked: 0 },
    completed: false,
  };
}

export function sessionRuntimeReducer(
  state: SessionRuntime,
  action: SessionAction,
): SessionRuntime {
  switch (action.type) {
    case "PICK_ANSWER": {
      const idx = state.cards.findIndex((c) => c.cardId === action.cardId);
      if (idx === -1) return state;
      const card = state.cards[idx];
      if (card.state !== "UNANSWERED") return state;
      return replaceCard(state, idx, {
        ...card,
        state: "ANSWERED",
        selectedAnswerId: action.selectedAnswerId,
      });
    }

    case "REVEAL": {
      const idx = state.cards.findIndex((c) => c.cardId === action.cardId);
      if (idx === -1) return state;
      const card = state.cards[idx];
      if (card.state !== "ANSWERED") return state;
      const updated: RuntimeCard = {
        ...card,
        state: "REVEALED",
        revealed: true,
        attempt: { correct: action.correct, guessed: false, bookmarked: false },
      };
      return replaceCard(
        {
          ...state,
          metrics: {
            ...state.metrics,
            correct: state.metrics.correct + (action.correct ? 1 : 0),
            incorrect: state.metrics.incorrect + (action.correct ? 0 : 1),
          },
        },
        idx,
        updated,
      );
    }

    case "SET_CONFIDENCE": {
      const idx = state.cards.findIndex((c) => c.cardId === action.cardId);
      if (idx === -1) return state;
      const card = state.cards[idx];
      if (card.state !== "REVEALED" || !card.attempt) return state;
      return replaceCard(state, idx, {
        ...card,
        attempt: { ...card.attempt, confidence: action.confidence },
      });
    }

    case "TOGGLE_BOOKMARK": {
      const idx = state.cards.findIndex((c) => c.cardId === action.cardId);
      if (idx === -1) return state;
      const card = state.cards[idx];
      if (card.state !== "REVEALED" || !card.attempt) return state;
      const wasBookmarked = card.attempt.bookmarked ?? false;
      return replaceCard(
        {
          ...state,
          metrics: {
            ...state.metrics,
            bookmarked: state.metrics.bookmarked + (wasBookmarked ? -1 : 1),
          },
        },
        idx,
        {
          ...card,
          attempt: { ...card.attempt, bookmarked: !wasBookmarked },
        },
      );
    }

    case "SET_GUESSED": {
      const idx = state.cards.findIndex((c) => c.cardId === action.cardId);
      if (idx === -1) return state;
      const card = state.cards[idx];
      if (card.state !== "REVEALED" || !card.attempt) return state;
      const wasGuessed = card.attempt.guessed ?? false;
      const delta = !wasGuessed && action.guessed ? 1 : wasGuessed && !action.guessed ? -1 : 0;
      return replaceCard(
        {
          ...state,
          metrics: {
            ...state.metrics,
            guessed: state.metrics.guessed + delta,
          },
        },
        idx,
        {
          ...card,
          attempt: { ...card.attempt, guessed: action.guessed },
        },
      );
    }

    case "ADVANCE": {
      const currentCard = state.cards[state.currentIndex];
      if (!currentCard || currentCard.state !== "REVEALED") return state;
      const cards = [...state.cards];
      cards[state.currentIndex] = { ...currentCard, state: "LOCKED" };
      const nextIndex = state.currentIndex + 1;
      return {
        ...state,
        cards,
        currentIndex: nextIndex < state.totalCards ? nextIndex : state.currentIndex,
      };
    }

    case "COMPLETE": {
      const currentCard = state.cards[state.currentIndex];
      const cards = [...state.cards];
      if (currentCard?.state === "REVEALED") {
        cards[state.currentIndex] = { ...currentCard, state: "LOCKED" };
      }
      return { ...state, cards, completed: true };
    }

    default:
      return state;
  }
}

function replaceCard(
  state: SessionRuntime,
  idx: number,
  updated: RuntimeCard,
): SessionRuntime {
  const cards = [...state.cards];
  cards[idx] = updated;
  return { ...state, cards };
}
