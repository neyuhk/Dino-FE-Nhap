
import { User } from './model.ts'

export interface Exercise {
    id: string;
    type: "quiz" | "test";
    time: number;
    title: string;
    description: string;
    score?: number;
    isCompleted: boolean;
    submittedAt?: string;
    endDate: Date;
}

export interface Quiz{
    id: string;
    typeAnswer: 'multiple_choice' | 'one_choice';
    question: string;
    answer: string[];
    image: string;
    index: number;
}

export interface Lesson {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    images: string[];
    body: string;
    course_id: Course;
    createdAt: string;
    updatedAt: string;

    exercises: Exercise[];
    order: number;
    duration: number;
    isCompleted: boolean;
    progress: number;
    averageScore?: number;
    lastAccessedAt?: string;
}

export interface Assignment {
    id: string;
    courseId: string;
    lessonId: string;
    title: string;
    description: string;
    type: 'multiple_choice' | 'coding' | 'theory';
    dueDate: Date;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    content: string;
    status: 'submitted' | 'graded' | 'returned';
    score?: number;
    feedback?: string;
    submittedAt: Date;
    gradedAt?: Date;
}

export interface Teacher {
    _id: string;
    username: string;
    email: string;
    phonenumber: string;
    role: string;
    avatar: string[];
    birthday: Date;
}

export interface Course {
    _id: string;
    teacherId: string;
    title: string;
    description: string;
    images: string[];
    start_date: string;
    end_date: string;
    certification: string;
    createdAt: string;
    updatedAt: string;
    progress: number;
    students: User[];
}

export interface Classroom {
    _id: string;
    name: string;
    images: string[];
    description: string;
    teacher_id: User;
    courses: Course[];
    createdAt: Date;
    updatedAt: Date;
    students: User[];
}

// Add this to your model/classroom.ts file
// Make sure to import the User interface

export interface Student extends User {
    studentId: string;
    enrollmentDate: string;
    courses: string[];
    progress: {
        courseId: string;
        completedLessons: string[];
        completionPercentage: number;
        lastAccessDate: string;
    }[];
    grades: {
        courseId: string;
        lessonId: string;
        exerciseId: string;
        score: number;
        maxScore: number;
        submittedAt: string;
    }[];
    attendance: {
        date: string;
        status: 'present' | 'absent' | 'late';
    }[];
    rank?: number;
    averageScore?: number;
}

// Mock data for students

