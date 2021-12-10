import React from 'react';
import { Button, Heading, Card, FilePicker, majorScale, Pane, TextInput, toaster, Paragraph, TimeIcon } from 'evergreen-ui';
import { Formik } from 'formik';
import { addCandidateV2 } from 'firebase-service/addCandidateV2';
import { UserAddressContext } from 'context/userAddressContext';
import { useHistory } from 'react-router-dom';
import { checkIfExistingCandidate } from 'firebase-service/checkIfExistingCandidate';
import { EnumCandidateVerifyStatus } from 'models/EnumCandidateVerifyStatus.model';

function CandidateRegisterPage() {
    const history = useHistory();
    const [view, setView] = React.useState('FORM');
    const userAddress = React.useContext(UserAddressContext);
    const [file, setFile] = React.useState<any>(null); 
    React.useEffect(() => {
        checkIfExistingCandidate({
            ethAddress: userAddress,
        }).then((rs) =>{
            if (rs === EnumCandidateVerifyStatus.APPROVED) {
                toaster.notify('This address has already been registered');
                history.push('/candidate-profile');
            } 
            if (rs === EnumCandidateVerifyStatus.PENDING) {
                setView('PENDING');
            } 
        });
    })
    if (!userAddress) {
        return null;
    }
    if (view === 'PENDING') {
        return (<Pane>
            <TimeIcon size={48} marginBottom={majorScale(2)} />
            <Heading>
                Your request is sucessfully submitted
            </Heading>
            <Paragraph>
                Your request to participate is being review
                <br />
                Please recheck your account after 2-3 days, thank you.
            </Paragraph>
        </Pane>);
    }
    return (

        <Pane display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
            <Pane maxWidth={majorScale(64)}>
                <Heading>
                    Register your credential
                </Heading>
                <Paragraph marginBottom={majorScale(2)}>
                    Please attach your profile information in order to join our grading system.
                    <br />
                    You can only this action once, so be careful.
                    <br />
                    After you have registered, judge can create your score token and you can see it via you Profile section.
                    <br />
                    Make sure your input name matches the information in your indentity card.
                </Paragraph>
            </Pane>
            <Formik
                initialValues={{
                    ethAddress: userAddress,
                    name: '',
                }}
                onSubmit={async (values, actions) => {
                    if (!values.name) {
                        toaster.danger('Please fill in your real name.');
                        return;
                    }
                    if (await addCandidateV2(values)) {
                        toaster.success(`Your credential has been added to our pending list, waiting for approval`);
                        setView('PENDING');
                    }
                    
                }}
            >
                {({handleSubmit, handleChange, values}) => {
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
                                <TextInput
                                    name='name'
                                    onChange={handleChange}
                                    value={values.name}
                                    width='100%'
                                    placeholder='Candidate name'/>
                            </Pane>
                            <Pane  marginBottom={majorScale(2)}>
                                <FilePicker
                                    width='100%'
                                    multiple
                                    onChange={files => setFile(files)}
                                    placeholder="Please upload your Indentity card"
                                />
                                {
                                    !!file && <img style={{
                                        marginTop: majorScale(2),
                                    }} src='https://i.imgur.com/NpGeq0m.png' alt='mock KYC' /> 
                                }
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
                            <Pane marginBottom={majorScale(2)} display='flex' justifyContent='flex-end'>
                                <Button onClick={() => handleSubmit()} appearance='primary'>
                                    Register
                                </Button>
                            </Pane>
                        </Card>
                    )
                }
    }
            </Formik>
        </Pane>
    );
}

export default CandidateRegisterPage;