import React, { useEffect, useState } from 'react';
import { GraduationCap, Book, CheckCircle, AlertCircle, ChevronRight, Clock } from 'lucide-react';
import styles from './LessonList.module.css';
import { Exercise, Lesson } from '../../../model/classroom.ts'
import { getLessonByCourseId } from '../../../services/lesson.ts'
import { useSelector } from 'react-redux'
import RequireAuth from '../../RequireAuth/RequireAuth.tsx'
import { PATHS } from '../../../router/path.ts'
import { useLocation, useNavigate } from 'react-router-dom'

interface LessonListProps {
    courseId: string;
}

const LessonList: React.FC = () => {

    const location = useLocation();
    const { user } = useSelector((state: any) => state.auth);
    const { coursesId } = location.state as { coursesId: string};

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetchLessons();
    }, [coursesId]);

    const fetchLessons = async () => {
        try {
            console.log('courseId', coursesId);
            setIsLoading(true);
            const data = await getLessonByCourseId(coursesId);
            setLessons(data);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải bài học. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    const isExerciseExpired = (exercise: Exercise): boolean => {
        if (!exercise.endDate) return false;
        return new Date(exercise.endDate) < new Date();
    };

    const handleSelectExercise = (exercise: Exercise) => {
        // Prevent navigation if exercise is expired
        if (isExerciseExpired(exercise)) {
            return;
        }
        console.log(exercise);
        navigate(PATHS.CLASSROOM_LEARNING, { state: { exercise } });
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleLessonExpansion = (lessonId: string) => {
        setExpandedLessons(prevExpanded => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(lessonId)) {
                newExpanded.delete(lessonId);
            } else {
                newExpanded.add(lessonId);
            }
            return newExpanded;
        });
    };

    const isLessonExpanded = (lessonId: string): boolean => {
        return expandedLessons.has(lessonId);
    };

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                    <GraduationCap size={32} className={styles.loadingIcon} />
                </div>
                <p>Chờ xíuuuu... Hông ai iu anh bằng tôi iu anh..</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <AlertCircle size={32} className={styles.errorIcon} />
                <p>{error}</p>
                <button onClick={fetchLessons} className={styles.retryButton}>
                    Thử lại
                </button>
            </div>
        );
    }

    const filteredLessons = Array.isArray(lessons)
        ? lessons.filter(lesson => {
            switch (activeTab) {
                case 'completed':
                    return lesson.isCompleted;
                case 'incomplete':
                    return !lesson.isCompleted;
                default:
                    return true;
            }
        })
        : [];


    const getIncompleteExercises = (lesson: Lesson) => {
        return lesson.exercises.filter(ex => !ex.isCompleted).length;
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'completed' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Đã hoàn thành
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'incomplete' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('incomplete')}
                >
                    Chưa hoàn thành
                </button>
            </div>

            <div className={styles.lessonList}>
                {filteredLessons.map((lesson) => (
                    <div key={lesson._id} className={styles.lessonCard}>
                        <div
                            className={styles.lessonHeader}
                            onClick={() => toggleLessonExpansion(lesson._id)}
                        >
                            <div className={styles.lessonInfo}>
                                <Book size={24} className={styles.lessonIcon} />
                                <div>
                                    <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                                    <p className={styles.lessonMeta}>
                                        {lesson.duration} phút • {lesson.progress}% hoàn thành
                                    </p>
                                </div>
                            </div>

                            {lesson.isCompleted ? (
                                <CheckCircle size={24} className={styles.completedIcon} />
                            ) : (
                                getIncompleteExercises(lesson) > 0 && (
                                    <div className={styles.exerciseBadge}>
                                        {getIncompleteExercises(lesson)} bài tập chưa hoàn thành
                                    </div>
                                )
                            )}

                            <ChevronRight
                                size={24}
                                className={`${styles.expandIcon} ${isLessonExpanded(lesson._id) ? styles.expanded : ''}`}
                            />
                        </div>

                        <div className={`${styles.lessonDetails} ${isLessonExpanded(lesson._id) ? styles.detailsExpanded : ''}`}>
                            <p className={styles.lessonDescription}>{lesson.description}</p>

                            {lesson.exercises.length > 0 && (
                                <div className={styles.exerciseSection}>
                                    <h4>Bài tập ({lesson.exercises.length})</h4>
                                    <div className={styles.exerciseList}>
                                        {lesson.exercises.map((exercise) => {
                                            const expired = isExerciseExpired(exercise);
                                            return (
                                                <div
                                                    key={exercise.id}
                                                    className={`${styles.exerciseItem} ${expired ? styles.exerciseExpired : ''}`}
                                                    onClick={() => handleSelectExercise(exercise)}
                                                >
                                                    <div className={styles.exerciseInfo}>
                                                        <span className={styles.exerciseTitle}>{exercise.title}</span>
                                                        <p className={styles.exerciseDescription}>{exercise.description}</p>
                                                        {exercise.endDate && (
                                                            <div className={styles.exerciseDeadline}>
                                                                <Clock size={16} className={styles.deadlineIcon} />
                                                                <span className={`${expired ? styles.deadlineExpired : ''}`}>
                                                                    Hạn nộp: {formatDate(exercise.endDate.toLocaleDateString())}
                                                                    {expired ? ' (Đã hết hạn)' : ''}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {(exercise.score !== undefined || expired) && (
                                                            <span className={styles.exerciseScore}>
                                                                Điểm: {expired && !exercise.isCompleted ? '0' : exercise.score ?? 0}/10
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`
                                                        ${styles.exerciseStatus} 
                                                        ${exercise.isCompleted ? styles.completed : ''} 
                                                        ${expired && !exercise.isCompleted ? styles.expired : ''}
                                                    `}>
                                                        {expired && !exercise.isCompleted
                                                            ? 'Hết hạn'
                                                            : exercise.isCompleted
                                                                ? 'Đã hoàn thành'
                                                                : 'Chưa hoàn thành'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {lesson.averageScore !== undefined && (
                                <div className={styles.averageScore}>
                                    Điểm trung bình: <strong>{lesson.averageScore.toFixed(1)}/10</strong>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonList;