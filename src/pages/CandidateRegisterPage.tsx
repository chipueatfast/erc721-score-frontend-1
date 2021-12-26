import React, { useState, useContext, useEffect } from 'react';
import { Button, Heading, Card, FilePicker, majorScale, Pane, TextInput, toaster, Paragraph, TimeIcon } from 'evergreen-ui';
import { Formik } from 'formik';
import { addCandidateV2 } from 'firebase-service/addCandidateV2';
import { UserAddressContext } from 'context/userAddressContext';
import { useHistory } from 'react-router-dom';
import { checkIfExistingCandidate } from 'firebase-service/checkIfExistingCandidate';
import { EnumCandidateVerifyStatus } from 'models/EnumCandidateVerifyStatus.model';

import styles from '../public/css/candidateRegisterPage.module.css';

function CandidateRegisterPage() {
  const history = useHistory();
  const [view, setView] = useState('FORM');
  const userAddress = useContext(UserAddressContext);
  const [file, setFile] = useState<any>(null);
  useEffect(() => {
    checkIfExistingCandidate({
      ethAddress: userAddress,
    }).then((rs) => {
      if (rs === EnumCandidateVerifyStatus.APPROVED) {
        toaster.notify('This address has already been registered');
        history.push('/candidate-profile');
      }
      if (rs === EnumCandidateVerifyStatus.PENDING) {
        setView('PENDING');
      }
    });
  }, []);
  if (!userAddress) {
    return null;
  }
  if (view === 'PENDING') {
    return (<div className={styles.candidateRegisterContainer}>
      <div className='candidate-register-wrapper'>
        <div className='icon-wrapper'>
          <TimeIcon />
        </div>
        <div className='heading-wrapper'>
          <div className='heading'>
            Your request is sucessfully submitted
          </div>
          <div className='description'>
            Your request to participate is being review
            <br />
            Please recheck your account after 2-3 days, thank you.
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className={styles.candidateRegisterContainer}>
      <div className='heading-wrapper'>
        <div className='heading'>
          Register your credential
        </div>
        <div className='description'>
          Please attach your profile information in order to join our grading system.
          <br />
          You can only this action once, so be careful.
          <br />
          After you have registered, judge can create your score token and you can see it via you Profile section.
          <br />
          Make sure your input name matches the information in your indentity card.
        </div>
      </div>
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
        {({ handleSubmit, handleChange, values }) => {
          return (
            <Card
              className='card-wrapper'
              elevation={1}
            >
              <div className='input-wrapper'>
                <TextInput
                  name='name'
                  onChange={handleChange}
                  value={values.name}
                  width='100%'
                  placeholder='Candidate name' />
              </div>
              <div className='input-wrapper'>
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
              </div>
              <div className='input-wrapper'>
                <TextInput
                  disabled
                  name='ethAddress'
                  onChange={handleChange}
                  value={values.ethAddress}
                  width='100%'
                  placeholder='Registered ethereum address' />
              </div>
              <div className='actions-wrapper'>
                <Button onClick={() => handleSubmit()} appearance='primary'>
                  Register
                </Button>
              </div>
            </Card>
          )
        }
        }
      </Formik>
    </div>
  );
}

export default CandidateRegisterPage;