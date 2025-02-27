import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import QuizComponent from './Quiz/QuizComponent';
import { getAnsweredQuiz, getNextQuiz, getQuizByExerciseId } from '../../../services/lesson'
import { Exercise, Quiz } from '../../../model/classroom';
import styles from './LearningChallenge.module.css';
import TestComponent from './TestComponent/TestComponent.tsx'

const LearningChallenge: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { exercise } = location.state as { exercise: Exercise };
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

    useEffect(() => {
        if (!exercise) {
            setLoading(false);
            return;
        }

        const fetchQuizzes = async () => {
            try {
                const quizzes = await getQuizByExerciseId(exercise.id);
                setQuizList(quizzes);
                setCurrentQuiz(quizzes[0] || null);
                setProgress(0);
            } catch (error) {
                console.error('Lỗi khi tải câu hỏi:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [exercise]);

    // const handleGetNextQuiz = async (currentIndex: number) => {
    //     const nextQuiz = await getNextQuiz(currentIndex) ?? null;
    //     setCurrentQuiz(nextQuiz);
    //     setProgress((currentIndex + 1) / quizList.length * 100);
    // };
    const handleSubmitAnswer = async (quizId: string, answer: string) => {
        const quiz = quizList.find(q => q.id === quizId);
        if (!quiz) {
            console.error("Quiz not found!");
            return { isCorrect: false, correctAnswer: '' };
        }
        const trueAnswer = await getAnsweredQuiz(quizId);
        const isCorrect = answer === trueAnswer;
        return { isCorrect, correctAnswer: trueAnswer };
    };
    const generateRandomCorrectAnswers = (quizList: Quiz[]): Record<string, string[]> => {
        const correctAnswers: Record<string, string[]> = {};

        quizList.forEach(quiz => {
            if (quiz.typeAnswer === "one_choice") {
                // Chọn ngẫu nhiên một đáp án đúng
                correctAnswers[quiz.id] = [quiz.answer[Math.floor(Math.random() * quiz.answer.length)]];
            } else if (quiz.typeAnswer === "multiple_choice") {
                // Chọn ngẫu nhiên một số đáp án (từ 1 đến tất cả)
                const shuffledAnswers = [...quiz.answer].sort(() => Math.random() - 0.5);
                const numberOfCorrectAnswers = Math.floor(Math.random() * quiz.answer.length) + 1;
                correctAnswers[quiz.id] = shuffledAnswers.slice(0, numberOfCorrectAnswers);
            }
        });

        return correctAnswers;
    };

    const handleSubmitTest = async (answers: Record<string, string[]>): Promise<{ score: number }> => {
        // Tạo đáp án đúng giả lập
        const correctAnswers = generateRandomCorrectAnswers(quizList);

        let correctCount = 0;
        let totalQuestions = quizList.length;

        // So sánh câu trả lời của người dùng với đáp án đúng
        quizList.forEach(quiz => {
            const userAnswers = answers[quiz.id] || [];
            const actualCorrectAnswers = correctAnswers[quiz.id] || [];

            // Kiểm tra nếu tất cả câu trả lời của người dùng khớp với đáp án đúng
            if (
                userAnswers.length === actualCorrectAnswers.length &&
                userAnswers.every(ans => actualCorrectAnswers.includes(ans))
            ) {
                correctCount++;
            }
        });

        // Tính điểm (theo %)
        const score = (correctCount / totalQuestions) * 100;

        return { score };
    };

    const handleNextQuestion = () => {
        setCurrentQuizIndex(prev => (prev + 1) % quizList.length);
        setCurrentQuiz(quizList[currentQuizIndex]);
    };
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingSpinner} size={48} />
                <p>Đang tải bài tập...</p>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <AlertCircle size={64} className={styles.errorIcon} />
                    <h2>Không tìm thấy bài tập!</h2>
                    <p>Hãy quay lại và chọn một bài tập để tiếp tục.</p>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <div className={styles.exerciseInfo}>
                    <BookOpen size={24} />
                    <div>
                        <h1>{exercise.title || 'Bài tập'}</h1>
                        <p>{quizList.length} câu hỏi</p>
                    </div>
                </div>
            </header>

            {progress > 0 && (
                <div className={styles.progressContainer}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <main className={styles.mainContent}>
                {exercise.type === 'quiz' ? (
                    currentQuiz ? (
                        <QuizComponent
                            quiz={currentQuiz}
                            onSubmitAnswer={handleSubmitAnswer}
                            onNextQuestion={handleNextQuestion}
                            time={60}
                        />
                    ) : (
                        <div className={styles.completionContainer}>
                            <img
                                src="https://i.pinimg.com/originals/62/c3/79/62c379ae3baad2a6f3810a8ad1a19d47.gif"
                                alt="Completion"
                                className={styles.completionImage}
                            />
                            <h2>Hoàn thành bài tập!</h2>
                            <p>Bạn đã hoàn thành tất cả các câu hỏi.</p>
                            <button
                                className={styles.backButton}
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft size={20} />
                                Quay lại danh sách
                            </button>
                        </div>
                    )
                ): exercise.type === 'test' ? (
                    <TestComponent
                        exercise={exercise}
                        quizList={quizList}
                        onSubmit = {handleSubmitTest}
                    />
                ) : (
                    <div className={styles.errorContainer}>
                        <AlertCircle size={64} className={styles.errorIcon} />
                        <h2>Loại bài tập không hợp lệ</h2>
                        <p>Loại bài tập này hiện không được hỗ trợ.</p>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={20} />
                            Quay lại
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LearningChallenge;