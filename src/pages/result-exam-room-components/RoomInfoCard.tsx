import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Card, majorScale, Pane, Text } from 'evergreen-ui';
import { getExamRoomNameByRoomId } from 'firebase-service/getExamRoomNameByRoomId';
import { mapSubjectValueToLabel } from 'utils/mapSubjectValueToLabel';

import styles from '../../public/css/roomInfoCard.module.css';

function RoomInfoCard(props: {
  roomId: string;
  judgeAddress: string;
  subject: string;
}) {
  const [judgeName,
    setJudgeName] = useState('');
  const [examName,
    setExamName] = useState('');
  useEffect(() => {
    if (props.judgeAddress) {
      const ref = firebase
        .database()
        .ref(`judge/${props.judgeAddress}`);
      ref.get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            setJudgeName(snapshot.val().name);
          } else {
            console.log("No data available");
          }
        })
    }

    getExamRoomNameByRoomId({
      roomId: props.roomId
    }).then(setExamName);
  }, [props.judgeAddress]);

  return (
    <div className={styles.roomInfoCardContainer}>
      <Card
        className='card-wrapper'
        elevation={1}
      >
        <div className='text-wrapper'>
          <Text fontWeight='bold'>Exam name:</Text> {examName}
        </div>
        <div className='text-wrapper'>
          <Text fontWeight='bold'>Judge name:</Text>  {judgeName}
        </div>
        <div className='text-wrapper'>
          <Text fontWeight='bold'>Subject:</Text> {mapSubjectValueToLabel(props.subject)}
        </div>
      </Card>
    </div>
  )
}

export default RoomInfoCard;