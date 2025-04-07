import QuizzCard from "./QuizzCard";
import DoQuizz from "./DoQuizz";

function QuizArea() {
  return (
    <div>
      <div className="flex grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <h1 className="text-xl font-bold">My QUizzes</h1>
        <div className="mt-10 flex gap-2 flex-wrap">
          <QuizzCard />
          <QuizzCard />
          <QuizzCard />
          <QuizzCard />
          <QuizzCard />
          <QuizzCard />
          <DoQuizz/>
        </div>
      </div>
    </div>
  );
}

export default QuizArea;
