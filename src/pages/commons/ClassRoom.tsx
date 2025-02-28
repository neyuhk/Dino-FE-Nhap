
import styles from '../../pages/commons/styles/ClassRoom.module.css';
import LearningPlatform from '../../components/ClassRoom/LearningPlatform/LearningPlatform.tsx'
import ClassroomList from '../../components/ClassRoom/ClassroomPage.tsx'
import { useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import RequireAuth from '../../components/RequireAuth/RequireAuth.tsx'
const ClassroomPage = () => {
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    return (
        <div className={styles.container}>
            <ClassroomList></ClassroomList>
        </div>
    );
};

export default ClassroomPage;
