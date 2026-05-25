// Converted to ISR-safe route
export const revalidate = 1800;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Flashcards = () => {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const response = await fetch('/api/flashcards');
      const data = await response.json();
      setFlashcards(data);
    };
    fetchFlashcards();
  }, []);

  return (
    <div>
      {flashcards.map((flashcard) => (
        <div key={flashcard.id}>
          <h2>{flashcard.question}</h2>
          <p>{flashcard.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default Flashcards;
