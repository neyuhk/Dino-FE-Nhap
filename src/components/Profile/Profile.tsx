import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import ProjectList from './ProjectList/ProjectList.tsx'
import AboutMe from './AboutMe/AboutMe.tsx'
import { Project, User } from '../../model/model.ts'
import ProfileCourses from './Courses/Profile-Courses.tsx'
import { Typography } from 'antd'
import SavedProjects from './SavedProjects/SavedProjects.tsx'
import { useSelector } from 'react-redux'
import { getFavoriteProjects} from '../../services/project.ts'

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('projects')
    const { user } = useSelector((state: any) => state.auth)
    const { Title } = Typography
    const [savedProjects, setSavedProjects] = useState<Project[]>([]);

    const handleUpdateUser = (updatedUser: Partial<User>) => {
        // setUser((prev) => ({
        //     ...prev,
        //     ...updatedUser,
        //     updatedAt: new Date().toDateString(),
        // }))
    }

    const handleSaveToggle = (projectId: string) => {
        const updatedProjects = savedProjects.filter(
            (project) => project._id !== projectId
        );
        setSavedProjects(updatedProjects);
    };
    useEffect(() => {
        const fetchSavedProjects = async () => {
            try {
                const response = await getFavoriteProjects(user._id);
                setSavedProjects(response.data);
            } catch (error) {
                console.error('Error fetching saved projects:', error);
            }
        };

        fetchSavedProjects();
    }, [])
    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <div className={styles.avatar}>
                    <img
                        src={user.avatar? user.avatar:'https://i.pinimg.com/474x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg'}
                        className={styles.avatar}
                        />
                </div>
                <div className={styles.userInfo}>
                    <h1 className={styles.userName}>{user.username}</h1>
                    <p className={styles.userEmail}>{user.email}</p>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li
                            className={activeTab === 'me' ? styles.active : ''}
                            onClick={() => setActiveTab('me')}
                        >
                            Tôi
                        </li>
                        <li
                            className={
                                activeTab === 'projects' ? styles.active : ''
                            }
                            onClick={() => setActiveTab('projects')}
                        >
                            Dự án
                        </li>
                        <li
                            className={
                                activeTab === 'saved' ? styles.active : ''
                            }
                            onClick={() => setActiveTab('saved')}
                        >
                            Dự án đã lưu
                        </li>
                    </ul>
                </nav>
            </header>
            <main className={styles.content}>
                {activeTab === 'me' ? (
                    <AboutMe user={user} onUpdateUser={handleUpdateUser} />
                ) : null}

                {activeTab === 'projects' ? <ProjectList /> : null}

                {activeTab === 'classes' ? (
                    <ProfileCourses courses={mockCourses} />
                ) : null}

                {activeTab === 'saved' ? (
                    <SavedProjects
                        projects={savedProjects}
                        onSaveToggle={handleSaveToggle}
                    />
                ) : null}
            </main>
        </div>
    )
}

export default Profile
