import React from 'react';
import { FirebaseDatabaseTransaction } from '@react-firebase/database';
import { Pane, TextInput, Card, Button, majorScale, Select, Alert } from 'evergreen-ui';
import {Formik} from 'formik';
import { updateScoreToken } from 'services/updateScoreToken';
import { convertScoreFormToScoreHash } from 'services/convertScoreFormToScoreHash';
import { scoreSheetPath } from 'firebase-service/scoreSheetPath';
import { IScore } from 'models/IScore.model';

interface IProps {
    userAddress: string;
}

export function UpdateTokenPage(props: IProps) {
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    if (!props.userAddress) {
        return null;
    }
    return (
        <Pane>
            <FirebaseDatabaseTransaction path={scoreSheetPath}>
                {({ runTransaction }) => {                        
                    return (<Formik
                        initialValues={{
                            tokenId: '',
                            score: '',
                            subject: '',
                            candidateAddress: '',
                        }}
                        onSubmit={(values) => {
                            updateScoreToken({
                                scoreHash: convertScoreFormToScoreHash({
                                    ...values,
                                } as IScore),
                                tokenId: Number(values.tokenId),
                                fromAddress: props.userAddress,
                            }).then(result => {
                                if (result.reponse && result.reponse.tokenId) {
                                    const tokenId = result.reponse.tokenId;
                                runTransaction({
                                    reducer: (state) => {
                                        if (!state) {
                                            state={};
                                        }
                                        state[tokenId]={
                                            ...values,
                                            createdDate: (new Date()).toString(),
                                        };
                                        return {...state};
                                    }
                                }).then(() => {});
                                setSuccessMessage(`The token ID ${tokenId} has been updated`)
                            }
                            if ("errorMessage" in result && typeof result.errorMessage === 'string') {
                                setErrorMessage(result.errorMessage);
                            }                        
                        })
                    }}
                >
                    {
                        ({
                            values,
                            handleSubmit,
                            handleChange,
                        }) => {
            return  (
            <Pane 
                width='100%'
                justifyContent='center'
            >
                <Card
                    marginBottom={majorScale(2)}
                    border
                    elevation={1}
                    width='100%'
                    maxWidth={majorScale(64)}
                    paddingY={majorScale(2)}
                    paddingX={majorScale(4)}
                >
                    <Pane
                        marginBottom={majorScale(2)}
                    >
                        <TextInput
                            name='tokenId'
                            onChange={handleChange}
                            value={values.tokenId}
                            width='50%'
                            placeholder='Token Id'
                        />
                    </Pane>
                    <Select
                        name='subject'
                        value={values.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        marginBottom={majorScale(2)}
                    >
                        <option value="" disabled>Subject</option>
                        <option value="math">Math</option>
                        <option value="literature">Literature</option>
                        <option value="english">English</option>
                    </Select>
                    <Pane
                        marginBottom={majorScale(2)}
                    >
                        <TextInput
                            name='score'
                            onChange={handleChange}
                            value={values.score}
                            width='50%'
                            placeholder='Score'
                        />
                    </Pane>
                    <Pane
                        marginBottom={majorScale(2)}
                    >
                        <TextInput
                            name='candidateAddress'
                            onChange={handleChange}
                            value={values.candidateAddress}
                            placeholder='Candidate address'
                        />

                    </Pane>
                    <Button
                        type='submit'
                        appearance='primary'
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Update score token
                    </Button>

                </Card>
            </Pane>)}}
            </Formik>)}}
        </FirebaseDatabaseTransaction>
            <Pane
                width='100%'
                maxWidth={majorScale(64)}
            >
                {
                    !!errorMessage &&
                    <Alert
                        intent='danger'
                        title={errorMessage}
                    />
                }
                {
                    !!successMessage && 
                    <Alert
                        intent='success'
                        title={successMessage}
                    />
                }
            </Pane>
        </Pane>
    );
}