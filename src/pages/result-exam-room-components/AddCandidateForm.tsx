import React, { useState, useEffect, useContext } from 'react';
import { Alert, Autocomplete, Button, Card, TextInput, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import { addCandidateToFirebaseService } from 'firebase-service/addCandidateToFirebaseService';
import { mintAToken } from 'services/mintAToken';
import { convertScoreFormToScoreHash } from 'services/convertScoreFormToScoreHash';
import { UserAddressContext } from 'context/userAddressContext';
import { getExamRoomDocument } from 'firebase-service/getExamRoomDocument';
import { getCandidateAutocomplete } from 'firebase-service/getCandidateAutocomplete';

import styles from '../../public/css/addCandidateForm.module.css';

function AddCandidateForm(props: {
  roomId: string;
  subject: string;
}) {
  const [errorMessage,
    setErrorMessage] = useState<string>('');
  const [successMessage,
    setSuccessMessage] = useState<string>('');
  const userAddress = useContext(UserAddressContext);
  const [candidateList, setCandidateList] = useState<{ ethAddress: string; name: string; }[]>([]);

  useEffect(() => {
    getCandidateAutocomplete().then(rs => {
      setCandidateList(rs);
    })
  }, []);

  return (
    <div className={styles.addCandidateFormContainer}>
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
            scoreHash: convertScoreFormToScoreHash({ subject: props.subject, score: values.score, candidateAddress: values.ethAddress }),
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
              setErrorMessage('');
            }
            if ("errorMessage" in result && typeof result.errorMessage === 'string') {
              setErrorMessage(result.errorMessage);
            }
            actions.resetForm();
          })
        }}>
        {({ handleSubmit, handleChange, setFieldValue, values }) => {
          return (
            <Card
              className="card-add-candidate-wrapper"
              elevation={1}
            >
              <div className='autocomplete-wrapper'>
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
                        placeholder="Candidate name"
                        ref={getRef}
                        {...getInputProps()}
                      />
                    )
                  }}
                </Autocomplete>
              </div>
              <div className="input-wrapper">
                <TextInput
                  disabled
                  name='ethAddress'
                  onChange={handleChange}
                  value={values.ethAddress}
                  placeholder='Registered ethereum address' />
              </div>
              <div className="input-wrapper">
                <TextInput
                  name='score'
                  onChange={handleChange}
                  value={values.score}
                  placeholder='Score' />
              </div>
              <div className='error-message-wrapper'>
                {!!errorMessage && <div className="error-message">{errorMessage}</div>}
              </div>
              <div className='actions-wrapper'>
                <Button onClick={() => handleSubmit()} appearance='primary'>
                  Add candidate
                </Button>
              </div>
            </Card>
          )
        }}
      </Formik>
      <div className='success-message-wrapper'>
        {!!successMessage && <Alert intent='success' title={successMessage} />}
      </div>
    </div>
  );
}

export default AddCandidateForm;