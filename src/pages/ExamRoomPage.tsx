import React from 'react';
import CreateExamRoomForm from './exam-room-components/CreateExamRoomForm';
import { UserAddressContext } from 'context/userAddressContext';
import { ExamRoomTable } from './exam-room-components/ExamRoomTable';

import styles from '../public/css/examRoomPage.module.css';

function ExamRoomPage() {
    const userAddress = React.useContext(UserAddressContext);
    return (
        <div className={styles.examRoomPageContainer}>
            <div className='heading-wrapper'>
                <div className='heading'>
                    Host an exam and submit score result of candidates
                </div>
                <div className='description' >
                    Create folders to store all exam record in one place.
                </div>
            </div>
            <CreateExamRoomForm userAddress={userAddress} />
            <ExamRoomTable userAddress={userAddress} />
        </div>
    );
}

export default ExamRoomPage;