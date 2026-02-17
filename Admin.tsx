import { useState, useEffect } from "react";
import {
  addQuestion,
  getQuestions,
  getAnswers,
  getWinner,
  type Question,
  type Answer,
} from "@/lib/store";

const ADMIN_PASS = "dal2025";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showCorrectOnly, setShowCorrectOnly] = useState(false);

  useEffect(() => {
    if (authenticated) {
      setQuestions(getQuestions());
    }
  }, [authenticated]);

  useEffect(() => {
    if (selectedQ) {
      setAnswers(getAnswers(selectedQ));
    }
  }, [selectedQ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) setAuthenticated(true);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText || !correctAnswer || !startTime || !endTime) return;
    addQuestion({
      text: questionText,
      correctAnswer,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    });
    setQuestions(getQuestions());
    setQuestionText("");
    setCorrectAnswer("");
    setStartTime("");
    setEndTime("");
  };

  const selectedQuestion = questions.find((q) => q.id === selectedQ);
  const winner = selectedQuestion
    ? getWinner(selectedQuestion.id, selectedQuestion.correctAnswer)
    : null;

  const displayedAnswers = showCorrectOnly && selectedQuestion
    ? answers.filter(
        (a) =>
          a.answer.trim().toLowerCase() ===
          selectedQuestion.correctAnswer.trim().toLowerCase()
      )
    : answers;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold text-primary text-center mb-6">لوحة الأدمن</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-primary-foreground font-bold py-3
                         hover:bg-gold-light transition-all duration-300"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">لوحة تحكم الأدمن</h1>

      {/* Add question */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">إضافة سؤال جديد</h2>
        <form onSubmit={handleAddQuestion} className="flex flex-col gap-4">
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="نص السؤال..."
            rows={3}
            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground
                       placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="الإجابة الصحيحة"
            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground
                       placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">وقت البداية</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">وقت النهاية</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground font-bold py-3
                       hover:bg-gold-light transition-all duration-300"
          >
            إضافة السؤال
          </button>
        </form>
      </div>

      {/* Questions list */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">الأسئلة</h2>
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لا توجد أسئلة بعد</p>
        ) : (
          <div className="flex flex-col gap-2">
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQ(q.id);
                  setShowCorrectOnly(false);
                }}
                className={`text-right rounded-lg border px-4 py-3 transition-all duration-200 ${
                  selectedQ === q.id
                    ? "border-primary bg-secondary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-foreground truncate">{q.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  الإجابة: {q.correctAnswer}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Answers for selected question */}
      {selectedQ && selectedQuestion && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-bold text-foreground">الإجابات</h2>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={showCorrectOnly}
                onChange={(e) => setShowCorrectOnly(e.target.checked)}
                className="accent-primary"
              />
              الصحيحة فقط
            </label>
          </div>

          {/* Winner */}
          {winner && (
            <div className="rounded-lg bg-secondary border border-primary/30 p-4 mb-4 text-center gold-border-glow">
              <p className="text-sm text-muted-foreground">🏆 فائز اليوم</p>
              <p className="text-xl font-bold text-primary">{winner.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(winner.timestamp).toLocaleString("ar-SA")}
              </p>
            </div>
          )}

          {displayedAnswers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">لا توجد إجابات</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-2 px-3 text-muted-foreground font-semibold">#</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-semibold">الاسم</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-semibold">الإجابة</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-semibold">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAnswers
                    .sort(
                      (a, b) =>
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    )
                    .map((a, i) => {
                      const isCorrect =
                        a.answer.trim().toLowerCase() ===
                        selectedQuestion.correctAnswer.trim().toLowerCase();
                      return (
                        <tr key={a.id} className="border-b border-border/50">
                          <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
                          <td className="py-2 px-3 font-medium text-foreground">{a.name}</td>
                          <td className={`py-2 px-3 ${isCorrect ? "text-accent" : "text-destructive"}`}>
                            {a.answer} {isCorrect ? "✓" : "✗"}
                          </td>
                          <td className="py-2 px-3 text-muted-foreground text-xs">
                            {new Date(a.timestamp).toLocaleString("ar-SA")}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
