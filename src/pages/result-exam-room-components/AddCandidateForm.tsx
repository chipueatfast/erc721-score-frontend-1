import React from 'react';
import {Alert, Autocomplete, Button, Card, majorScale, Pane, TextInput, toaster} from 'evergreen-ui';
import {Formik} from 'formik';
import {addCandidateToFirebaseService} from 'firebase-service/addCandidateToFirebaseService';
import {mintAToken} from 'services/mintAToken';
import {convertScoreFormToScoreHash} from 'services/convertScoreFormToScoreHash';
import {UserAddressContext} from 'context/userAddressContext';
import { getExamRoomDocument } from 'firebase-service/getExamRoomDocument';
import { getCandidateAutocomplete } from 'firebase-service/getCandidateAutocomplete';

function AddCandidateForm(props : {
    roomId: string;
    subject: string;
}) {
    const [errorMessage,
        setErrorMessage] = React.useState < string > ('');
    const [successMessage,
        setSuccessMessage] = React.useState < string > ('');
    const userAddress = React.useContext(UserAddressContext);
    const [candidateList, setCandidateList] = React.useState<{ethAddress: string; name: string;}[]>([]);
    React.useEffect(() => {
        getCandidateAutocomplete().then(rs => {
            setCandidateList(rs);
        })
    }, []);
    return (
        <Formik
            initialValues={{
            ethAddress: '',
            name: '',
            score: ''
        }}
            onSubmit={async (values, actions) => {
            if (!values.name || !values.ethAddress || !values.score) {
                setErrorMessage('All fields are mandatory');
                return;
            }
            const registeredAddresses = await getExamRoomDocument({
                roomId: props.roomId,
            });
            if (!!registeredAddresses && Object.keys(registeredAddresses).includes(values.ethAddress)) {
                toaster.danger('This candidate address already have a score result!');
                return;
            }
            await mintAToken({
                scoreHash: convertScoreFormToScoreHash({subject: props.subject, score: values.score, candidateAddress: values.ethAddress}),
                toAddress: values.ethAddress,
                fromAddress: userAddress
            }).then(result => {
                if (result.reponse && result.reponse.tokenId) {
                    const tokenId = result.reponse.tokenId;
                    addCandidateToFirebaseService({
                        tokenId,
                        subject: props.subject,
                        roomId: props.roomId,
                        ethAddress: values.ethAddress,
                        candidateName: values.name,
                        score: values.score,
                    });
                    setSuccessMessage(`The new minted token ID is: ${tokenId}`);
                }
                if ("errorMessage" in result && typeof result.errorMessage === 'string') {
                    setErrorMessage(result.errorMessage);
                }
                actions.resetForm();
            })
        }}>
            {({handleSubmit, handleChange, setFieldValue, values}) => {
                return (
                    <Card
                        marginBottom={majorScale(2)}
                        border
                        elevation={1}
                        width='100%'
                        maxWidth={majorScale(64)}
                        paddingY={majorScale(2)}
                        paddingX={majorScale(4)}>
                        <Pane marginBottom={majorScale(2)}>
                            <Autocomplete
                                onChange={(changedItem: any) => {
                                    setFieldValue('ethAddress', candidateList.find(c => c.name === changedItem)?.ethAddress);
                                    setFieldValue('name', changedItem);

                                }}
                                items={candidateList.map(c => c.name)}
                                >
                                {(autoCompleteProps: any) => {
                                    const { getInputProps, getRef } = autoCompleteProps;
                                    return (
                                    <TextInput
                                        width='100%'
                                        placeholder="Candidate name"
                                        ref={getRef}
                                        {...getInputProps()}
                                    />
                                    )
                                }}
                            </Autocomplete>
                        </Pane>
                        <Pane marginBottom={majorScale(2)}>
                            <TextInput
                                disabled
                                name='ethAddress'
                                onChange={handleChange}
                                value={values.ethAddress}
                                width='100%'
                                placeholder='Registered ethereum address'/>
                        </Pane>
                        <Pane marginBottom={majorScale(2)}>
                            <TextInput
                                name='score'
                                onChange={handleChange}
                                value={values.score}
                                width='100%'
                                placeholder='Score'/>
                        </Pane>
                        <Pane marginBottom={majorScale(2)} display='flex' justifyContent='flex-end'>
                            <Button onClick={() => handleSubmit()} appearance='primary'>
                                Add candidate
                            </Button>
                        </Pane>
                        <Pane width='100%' maxWidth={majorScale(64)}>
                            {!!errorMessage && !successMessage && <Alert intent='danger' title={errorMessage}/> }
                            {!!successMessage && <Alert intent='success' title={successMessage}/> }
                        </Pane>
                    </Card>
                )
            }
}
        </Formik>
    );
}

export default AddCandidateForm;