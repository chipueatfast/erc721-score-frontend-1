import React from 'react';
import {Pane, Heading, Text, Strong, Table, majorScale, Spinner, Button, Paragraph, TableHeaderCell, TickCircleIcon} from 'evergreen-ui';
import {getAllScoreToken} from 'firebase-service/getAllScoreToken';
import {convertScoreFormToScoreHash} from 'services/convertScoreFormToScoreHash';
import {getScoreHash} from 'services/getScoreHash';
import ErrorRow from './audit-page-component/ErrorRow';

function AuditorPage() {
    const [activateScan, setActivateScan] = React.useState(0);
    const [errorResult,
        setErrorResult] = React.useState < any > ([]);
    const [totalTokenCount,
        setTotalTokenCount] = React.useState(0);
    React.useEffect(() => {
        async function scan() {
            const allTokens = await getAllScoreToken();
            setTotalTokenCount(allTokens.length);
            allTokens.forEach(async(token) => {
                const calculatedScoreHash = convertScoreFormToScoreHash({
                    subject: token.subject,
                    candidateAddress: token.id,
                    score: token
                        .score
                        .toString()
                });
                const scoreHash = await getScoreHash({
                    tokenId: Number(token.tokenId)
                });
                if (scoreHash !== calculatedScoreHash) {
                    setErrorResult((oldErrorResult : any) => {
                        return [
                            ...oldErrorResult,
                            token
                        ]
                    });
                }
            });
        }
        scan();
    }, []);
    if (activateScan === 0) {
        return (<Pane>
            <Heading>
                Auditor Section
            </Heading>
            <Pane marginBottom={majorScale(2)}>
                <Paragraph>
                    Scan and monitor the whole system to detect invalidity in all minted result. 
                    <br />
                    Please have your device plugged in powersource because this action may cost a lot of computation resource. 
                    <br />
                    While the SCAN action is running, do not close this tab.
                </Paragraph>
            </Pane>
            <Button onClick={() => {
                setActivateScan(1);
                setTimeout(() => {
                    setActivateScan(2);
                }, 5000);
            }} appearance='primary'>
                Scan
            </Button>
        </Pane>)
    }
    if (activateScan === 1) {
        return (<Pane>
            <Heading>
                Auditor Section
            </Heading>
            <Pane marginTop={majorScale(2)} display='flex' justifyContent='row' alignItems='center'>
                <Spinner />
            </Pane>

        </Pane>)
    }
    return (
        <Pane>
            <Heading>
                Auditor Section
            </Heading>
            <Pane marginBottom={majorScale(2)}>
                <Paragraph>
                    <Strong>
                        Total evaluation:&nbsp;
                    </Strong>
                    <Text>
                        {totalTokenCount}
                    </Text>
                    <br/>
                    <Strong>
                        Violation detected:&nbsp;
                    </Strong>
                    <Text>
                        {errorResult.length}
                    </Text>
                </Paragraph>
            </Pane>
            {
                errorResult.length === 0 ?
                <Pane alignItems='center' display='flex'>
                    <TickCircleIcon size={48} color='success' marginRight={majorScale(2)}/>
                    <Strong>
                        No issues detected, the whole system is reliable
                    </Strong>
                </Pane> :
                <Table>
                    <Table.Head>
                        <TableHeaderCell>
                            TOKEN ID
                        </TableHeaderCell>
                        <TableHeaderCell>
                            CANDIDATE NAME
                        </TableHeaderCell>
                        <TableHeaderCell>
                            SCORE
                        </TableHeaderCell>
                        <TableHeaderCell>
                            JUDGE NAME
                        </TableHeaderCell>
                    </Table.Head>
                    <Table.Body>
                        {errorResult.map((eR : any) => {
                                return (<ErrorRow key={eR.id + eR.roomId} eR={eR}/>)
                            })
                        }
                    </Table.Body>
                </Table>
            }

        </Pane>
    );
}

export default AuditorPage;