import React, { useState, useEffect } from 'react';
import styles from './CourseStudents.module.css';
import { User } from '../../../../model/model.ts'
import { addStudent, getStudentByCourseId } from '../../../../services/course.ts'
import { getUserById } from '../../../../services/user.ts'
import EmptyStateNotification from '../common/EmptyStateNotification/EmptyStateNotification.tsx'

interface CourseStudentsProps {
    courseId: string;
}
const CourseStudents: React.FC<CourseStudentsProps> = ({ courseId }) => {
    const [students, setStudents] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchId, setSearchId] = useState<string>('')
    const [searchResult, setSearchResult] = useState<User | null>(null)
    const [pendingStudents, setPendingStudents] = useState<User[]>([])
    const [addingStudents, setAddingStudents] = useState<boolean>(false)
    const [searching, setSearching] = useState<boolean>(false);
    const [studentManagement, setStudentManagement] = useState<{
        open: boolean
        student: User | null
    }>({
        open: false,
        student: null,
    })

    useEffect(() => {
        fetchStudents()
    }, [courseId])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const data = await getStudentByCourseId(courseId)
            const listStudent = data.data
            setStudents(Array.isArray(listStudent) ? listStudent : [])
            setError(null)
        } catch (err) {
            console.error('Error fetching students:', err)
            setError('Không thể tải danh sách học sinh')
            setStudents([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchId.trim()) {
            setError('Vui lòng nhập ID học sinh');
            return;
        }

        try {
            setSearching(true); // Chỉ đặt searching, không đặt loading
            const data = await getUserById(searchId);
            setSearchResult(data.data);
            setError(null);
        } catch (err) {
            console.error('Error searching for user:', err);
            setError('Không tìm thấy học sinh với ID đã nhập');
            setSearchResult(null);
        } finally {
            setSearching(false);
        }
    }
    const addToPending = () => {
        if (searchResult) {
            // Check if student is already in the course
            if (students.some((student) => student._id === searchResult._id)) {
                setError('Học sinh này đã có trong lớp học')
                return
            }

            // Check if student is already in pending list
            if (
                pendingStudents.some(
                    (student) => student._id === searchResult._id
                )
            ) {
                setError('Học sinh này đã có trong danh sách chờ')
                return
            }

            setPendingStudents([...pendingStudents, searchResult])
            setSearchResult(null)
            setSearchId('')
            setError(null)
        }
    }

    const removePending = (id: string) => {
        setPendingStudents(
            pendingStudents.filter((student) => student._id !== id)
        )
    }

    const handleAddStudents = async () => {
        if (pendingStudents.length === 0) {
            setError('Không có học sinh nào trong danh sách chờ')
            return
        }

        setAddingStudents(true)

        try {
            // Add students one by one
            for (const student of pendingStudents) {
                await addStudent({
                    courseId: courseId,
                    studentId: student._id,
                })
            }

            // Clear pending list and refresh student list
            setPendingStudents([])
            await fetchStudents()
            setError(null)
        } catch (err) {
            console.error('Error adding students:', err)
            setError('Có lỗi khi thêm học sinh')
        } finally {
            setAddingStudents(false)
        }
    }

    const openStudentManagement = (student: User) => {
        setStudentManagement({
            open: true,
            student,
        })
    }

    const closeStudentManagement = () => {
        setStudentManagement({
            open: false,
            student: null,
        })
    }

    const handleRemoveStudent = async (studentId: string) => {
        try {
            // Implement remove student API call here
            // For now, just simulating removal from the local state
            setStudents(students.filter((student) => student._id !== studentId))
            closeStudentManagement()
        } catch (err) {
            console.error('Error removing student:', err)
            setError('Có lỗi khi xóa học sinh')
        }
    }

    if (loading && students.length === 0) {
        return <div className={styles.loading}>Đang tải...</div>
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Quản lý học sinh</h2>

            {/* Search for new students */}
            <div className={styles.searchSection}>
                <h3>Thêm học sinh mới</h3>
                <div className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Nhập ID học sinh"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button
                        onClick={handleSearch}
                        className={styles.searchButton}
                        disabled={searching} // Thay đổi từ loading thành searching
                    >
                        {searching ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </div>

                <div className={styles.errorContainer}>
                    {error && <div className={styles.error}>{error}</div>}
                </div>
                {/* Search Result */}
                <div className={styles.searchResultContainer}>
                    {searchResult && (
                        <div className={styles.searchResult}>
                            <div className={styles.studentCard}>
                                <div className={styles.avatarContainer}>
                                    <img
                                        src={
                                            searchResult.avatar ||
                                            '/images/default-avatar.png'
                                        }
                                        alt={searchResult.name}
                                        className={styles.avatar}
                                    />
                                </div>
                                <div className={styles.studentInfo}>
                                    <h4>{searchResult.name}</h4>
                                    <p>Email: {searchResult.email}</p>
                                    <p>Số điện thoại: {searchResult.phonenumber}</p>
                                </div>
                                <button
                                    onClick={addToPending}
                                    className={styles.addButton}
                                >
                                    Thêm vào hàng chờ
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                    {/* Pending Students */}
                {/* Pending Students - Phiên bản cải tiến */}
                {pendingStudents.length > 0 && (
                    <div className={styles.pendingSection}>
                        <h3>
                            Học sinh đang chờ thêm ({pendingStudents.length})
                        </h3>
                        <div className={styles.pendingList}>
                            {pendingStudents.map((student) => (
                                <div
                                    key={student._id}
                                    className={styles.pendingItem}
                                >
                                    <div className={styles.pendingInfo}>
                                        <img
                                            src={
                                                student.avatar || '/images/default-avatar.png'
                                            }
                                            alt={student.username}
                                            className={styles.smallAvatar}
                                        />
                                        <div className={styles.pendingDetails}>
                                            <span>{student.username || student.name}</span>
                                            <span className={styles.pendingEmail}>{student.email}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removePending(student._id)}
                                        className={styles.removeButton}
                                        title="Xóa khỏi danh sách chờ"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddStudents}
                            className={styles.addAllButton}
                            disabled={addingStudents}
                        >
                            {addingStudents ? (
                                <>
                                    <span className={styles.loadingIcon}>●</span>
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <span className={styles.plusIcon}>+</span>
                                    Thêm tất cả học sinh vào lớp
                                </>
                            )}
                        </button>
                    </div>
                )}
                </div>

                {/* Current Students List */}
                <div className={styles.studentsList}>
                    <h3>Danh sách học sinh ({students.length})</h3>

                    {students.length === 0 ? (
                        <EmptyStateNotification
                            title="Chưa có học sinh nào"
                            message="Khóa học này chưa có học sinh nào. Hãy tìm kiếm và thêm học sinh vào khóa học."
                            image="https://i.pinimg.com/originals/9f/7c/90/9f7c9024044595556cf3025fa510e369.gif"
                        />
                    ) : (
                        <div className={styles.studentsGrid}>
                            {students.map((student) => (
                                <div
                                    key={student._id}
                                    className={styles.studentCard}
                                >
                                    <div className={styles.avatarContainer}>
                                        <img
                                            src={
                                                student.avatar ||
                                                '/images/default-avatar.png'
                                            }
                                            alt={student.name}
                                            className={styles.avatar}
                                        />
                                    </div>
                                    <div className={styles.studentInfo}>
                                        <h4>{student.name}</h4>
                                        <p>Email: {student.email}</p>
                                        <p>Số điện thoại: {student.phonenumber}</p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            openStudentManagement(student)
                                        }
                                        className={styles.detailButton}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Student Management Modal */}
                {studentManagement.open && studentManagement.student && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h3>Quản lý học sinh</h3>
                                <button
                                    onClick={closeStudentManagement}
                                    className={styles.closeButton}
                                >
                                    ×
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.studentDetail}>
                                    <img
                                        src={
                                            studentManagement.student.avatar ||
                                            '/images/default-avatar.png'
                                        }
                                        alt={studentManagement.student.name}
                                        className={styles.detailAvatar}
                                    />
                                    <div className={styles.detailInfo}>
                                        <h4>{studentManagement.student.name}</h4>
                                        <p>ID: {studentManagement.student._id}</p>
                                        <p>
                                            Email: {studentManagement.student.email}
                                        </p>
                                        <p>
                                            Username:{' '}
                                            {studentManagement.student.username}
                                        </p>
                                        <p>
                                            Số điện thoại:{' '}
                                            {studentManagement.student.phonenumber}
                                        </p>
                                        <p>
                                            Ngày sinh:{' '}
                                            {new Date(
                                                studentManagement.student.birthday
                                            ).toLocaleDateString('vi-VN')}
                                        </p>
                                        <p>
                                            Ngày tham gia:{' '}
                                            {new Date(
                                                studentManagement.student.createdAt
                                            ).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button
                                    onClick={() =>
                                        handleRemoveStudent(
                                            studentManagement.student._id
                                        )
                                    }
                                    className={styles.deleteButton}
                                >
                                    Xóa khỏi lớp học
                                </button>
                                <button
                                    onClick={closeStudentManagement}
                                    className={styles.cancelButton}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            )
            }

            export default CourseStudents;