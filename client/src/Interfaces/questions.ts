export interface Questions {
    id: string;
    duration?: string;
    title: string;
    answers: {
      id: string,
      title: string
    } [];
    correctAnswer: string;
    marks: number;
    quizId: string;
  }  