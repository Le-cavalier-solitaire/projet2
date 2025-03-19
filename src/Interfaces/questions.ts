interface Question {
    id : string,
    duration ?: number,
    title : string,
    answers : {
        id : string,
        title : string
    }
    correctAnswer : string,
    marks : number,
    quizId : string
}