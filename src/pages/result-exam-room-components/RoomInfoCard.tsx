import React from 'react';
import firebase from 'firebase/app';
import {Card, majorScale, Pane, Text} from 'evergreen-ui';
import { getExamRoomNameByRoomId } from 'firebase-service/getExamRoomNameByRoomId';
import { mapSubjectValueToLabel } from 'utils/mapSubjectValueToLabel';

function RoomInfoCard(props : {
    roomId: string;
    judgeAddress: string;
    subject: string;
}) {
    const [judgeName,
        setJudgeName] = React.useState('');
    const [examName,
        setExamName] = React.useState('');
    React.useEffect(() => {
        if (props.judgeAddress) {
            const ref = firebase
            .database()
            .ref(`judge/${props.judgeAddress}`);
        ref
            .get()
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
    }, [props.judgeAddress])
    return (
        <Card             
            marginRight={majorScale(4)}
            backgroundColor={'#b5bcd1'}
            marginBottom={majorScale(2)}
            elevation={1}
            width='100%'
            maxWidth={majorScale(48)}
            paddingY={majorScale(2)}
            paddingX={majorScale(4)}
        >
            <Pane display='flex' flexDirection='row' alignItems='center' marginBottom={majorScale(2)} height={32}>
                <Text >
                    <Text fontWeight='bold'>Exam name:</Text> {examName}
                </Text>
            </Pane>
            <Pane display='flex' flexDirection='row' alignItems='center' height={32} marginBottom={majorScale(2)}>
                <Text >
                    <Text fontWeight='bold'>Judge name:</Text>  {judgeName}
                </Text>
            </Pane>
            <Pane display='flex' flexDirection='row' alignItems='center' height={32} marginBottom={majorScale(2)}>
                <Text >
                    <Text fontWeight='bold'>Subject:</Text> {mapSubjectValueToLabel(props.subject)}
                </Text>

            </Pane>
        </Card>)
}

export default RoomInfoCard;