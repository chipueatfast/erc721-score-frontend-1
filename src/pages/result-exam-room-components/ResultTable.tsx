import React from 'react';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { majorScale, Text, minorScale, Pane, Table } from 'evergreen-ui';
import ResultRow from './ResultRow';

function ResultTable(props: {
    roomId: string;
    subject: string;
}) {
    return (
        <FirebaseDatabaseNode path={`candidate-results/${props.roomId}`}>
            {
                (results) => {
                    return (<Pane marginBottom={majorScale(10)}>
                        <Table>
                            <Table.Head>
                                <Table.HeaderCell>
                                    TokenID
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Candidate name
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Candidate address
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Score
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Validated on blockchain
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Actions
                                </Table.HeaderCell>
                            </Table.Head>                        
                        </Table>
                        {
                            (!results || !results.value) ? (<Table.Row>
                            <Pane display='flex' alignItems='center' marginX={minorScale(3)}>
                                <Text>
                                    No data yet
                                </Text>
                            </Pane>
                        </Table.Row>) :
                            Object.keys(results.value).map((k: string, index: number) => {
                                const scoreSheet: {
                                    name: string;
                                    id: string;
                                    score: number;
                                    tokenId: number;
                                } = results.value[k];
                                return (<ResultRow position={index} key={scoreSheet.id} subject={props.subject} {...scoreSheet} roomId={props.roomId} />)
                            })
                        }

                    </Pane>)
                }
            }
        </FirebaseDatabaseNode>
    );
}

export default ResultTable;