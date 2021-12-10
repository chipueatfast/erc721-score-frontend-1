import React, { useState} from 'react';
import { Button, Heading, majorScale, Pane, Paragraph, SearchInput, Text } from 'evergreen-ui';
import { Formik } from 'formik';
import { getScoreHash } from 'services/getScoreHash';
import { ResultScoreSheetV2 } from './candidate-page-components/ResultScoreSheetV2';
import { getOwnerBytokenId } from 'services/getOwnerBytokenId';
import { getAllScoreToken } from 'firebase-service/getAllScoreToken';

export function SearchPage() {
    const [tokenInfo, setTokenInfo] = useState<{
        tokenId: number;
        roomId: string;
        candidateAddress: string;
    } | null>(null);
    const [scoreHash, setScoreHash] = useState<string>('');
    const [judgeAddress, setJudgeAddress] = useState<string>('');

    return (
        <Pane display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
            <Formik
               initialValues={{
                    tokenId: '',
                }}
                onSubmit={(values) => {
                    getScoreHash({
                        tokenId: Number(values.tokenId),
                    }).then(setScoreHash);
                    getOwnerBytokenId({
                        tokenId: Number(values.tokenId),
                    }).then(setJudgeAddress);
                    getAllScoreToken().then(rs => {
                        const toFindToken = rs.find(token => token.tokenId === values.tokenId);
                        if (toFindToken) {
                            setTokenInfo({
                                roomId: toFindToken?.roomId,
                                tokenId: Number(values.tokenId),
                                candidateAddress: toFindToken.id,       
                            });
                        }
                    });
                }}
            >
                {
                    ({
                        handleChange,
                        handleSubmit,
                    }) => {
                    return (
                    <Pane
                        marginBottom={majorScale(2)}
                    >
                        <Heading>
                            Search a specific result by token ID
                        </Heading>
                        <Paragraph marginBottom={majorScale(2)}>
                            In case you need to look deeper into one single case to scrutinize, <br /> this function provide more insight on the published result.
                        </Paragraph>
                        <SearchInput 
                            name='tokenId'
                            onChange={handleChange}
                            placeholder='Token ID' 
                            marginRight={majorScale(1)}
                        />
                        <Button
                            onClick={(e: any) => handleSubmit()}
                        >
                            Find score token
                        </Button>
                        </Pane>
                                    )
                                }
                            }
                        </Formik>
                        {(tokenInfo && (!!tokenInfo.tokenId || tokenInfo.tokenId === 0)) && !scoreHash && <Text>NOT FOUND ON BLOCKCHAIN</Text>}
                        {(tokenInfo && (!!tokenInfo.tokenId || tokenInfo.tokenId === 0)) && !!judgeAddress && !!scoreHash && <ResultScoreSheetV2 
                            judgeAddress={judgeAddress} 
                            givenScoreHash={scoreHash} 
                            candidateAddress={tokenInfo.candidateAddress}
                            tokenId={tokenInfo.tokenId} 
                            roomId={tokenInfo.roomId}
                        />}
                    </Pane>
    );
}