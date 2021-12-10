import React from 'react';
import {Button, Card, Heading, majorScale, Pane, Paragraph, Select, Table, TableHeaderCell, TextInput} from 'evergreen-ui';
import CreateExamRoomForm from './exam-room-components/CreateExamRoomForm';
import { UserAddressContext } from 'context/userAddressContext';
import { ExamRoomTable } from './exam-room-components/ExamRoomTable';

function ExamRoomPage() {
    const userAddress = React.useContext(UserAddressContext);
    return (
        <Pane marginX={majorScale(8)}>
            <Pane marginBottom={majorScale(2)}>
                <Heading>
                    Host an exam and submit score result of candidates
                </Heading>
                <Paragraph>
                    Create folders to store all exam record in one place.
                </Paragraph>
            </Pane>
            <CreateExamRoomForm userAddress={userAddress} />
            <ExamRoomTable userAddress={userAddress} />

        </Pane>
    );
}

export default ExamRoomPage;