import React from 'react';
import AddCandidateForm from './result-exam-room-components/AddCandidateForm';
import ResultTable from './result-exam-room-components/ResultTable';
import RoomInfoCard from './result-exam-room-components/RoomInfoCard';
import { UserAddressContext } from 'context/userAddressContext';

import styles from '../public/css/resultExamRoomPage.module.css';

function ResultExamRoomPage({ roomId, subject }: {
  roomId: string;
  subject: string;
}) {
  const userAddress = React.useContext(UserAddressContext);

  return (
    <div className={styles.resultExamRoomPageContainer}>
      <div className='information-and-form-wrapper'>
        <RoomInfoCard subject={subject} roomId={roomId} judgeAddress={userAddress} />
        <AddCandidateForm subject={subject} roomId={roomId} />
      </div>
      <ResultTable subject={subject} roomId={roomId} />
    </div>
  );
}

export default ResultExamRoomPage;