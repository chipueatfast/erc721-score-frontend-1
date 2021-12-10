import {UserAddressContext} from 'context/userAddressContext';
import {BanCircleIcon, Heading, majorScale, minorScale, Pane, Paragraph, Table, Text, TickCircleIcon} from 'evergreen-ui';
import {getScoreResultOfAnAddress} from 'firebase-service/getScoreResultOfAnAddress';
import React from 'react';
import {useHistory} from 'react-router-dom';
import CandidateResultRow from './candidate-profile-components/CandidateResultRow';

interface IProps {}

function CandidateProfilePage(props : IProps) {
    const userAddress = React.useContext(UserAddressContext);
    const history = useHistory();
    const [candidateResult,
        setCandidateResult] = React.useState < {
        createdDate: string;
        id: string;
        name: string;
        score: string;
        tokenId: string;
        roomId: string;
        subject: string;
    }[] > ([]);
    React.useEffect(() => {
        if (userAddress) {
            getScoreResultOfAnAddress({userAddress}).then(rs => {
                setCandidateResult(rs);
            })
        }
    }, [userAddress])
    return (
        <Pane marginX={majorScale(16)}>
            <Pane marginBottom={majorScale(2)}>
                <Heading>
                    See your result in participated exams
                </Heading>
                <Paragraph>
                    Your result has been recorded and secured reliability. 
                    <br />
                    Result that does not have green tick in 'Verifed on blockchain' will not be accepted as valid result.
                </Paragraph>
            </Pane>

            <Table>
                <Table.Head>
                    <Table.HeaderCell>
                        Score
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Subject
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Exam name
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Created at
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Verified on blockchain
                    </Table.HeaderCell>

                </Table.Head>
                <Table.Body>
                    {candidateResult.length === 0 && (<Table.Row>
                                        <Pane display='flex' alignItems='center' marginX={minorScale(3)}>
                                            <Text>
                                                No data yet
                                            </Text>
                                        </Pane>
                                    </Table.Row>)}
                    {candidateResult.map((r, index) => {
                        return (<CandidateResultRow r={r} index={index}/>)})
                    }
                </Table.Body>
            </Table>
        </Pane>
    );
}

export default CandidateProfilePage;