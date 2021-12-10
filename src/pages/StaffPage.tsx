import React from 'react';
import {
  Button,
  Heading,
  Card,
  majorScale,
  Pane,
  TextInput,
  toaster,
  Tablist,
  Tab
} from 'evergreen-ui';
import { UserAddressContext } from 'context/userAddressContext';
import { Formik } from 'formik';
import { grantAuditorRole } from 'services/grantAuditorRole';
import { addAuditor } from 'firebase-service/addAuditor';
import AuditorTable from './staff-page-components/AuditorTable';
import JudgeTable from './staff-page-components/JudgeTable';
import { grantJudgeRole } from 'services/grantJudgeRole';
import { addJudge } from 'firebase-service/addJudge';
import styles from '../public/css/staffPage.module.css';

function StaffPage() {
  const userAddress = React.useContext(UserAddressContext);
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  return (
    <div className={styles.staffPageContainer}>
      <Tablist
        className="tab-list"
        flexBasis={240}
      >
        <Tab
          id='aud'
          key='aud'
          onSelect={() => setSelectedIndex(0)}
          isSelected={0 === selectedIndex}
          aria-controls={`panel-aud`}
        >
          Auditors
        </Tab>
        <Tab
          id='jud'
          key='jud'
          onSelect={() => setSelectedIndex(1)}
          isSelected={1 === selectedIndex}
          aria-controls={`panel-jud`}
        >
          Judges
        </Tab>
      </Tablist>
      {
        selectedIndex === 0 && <>
          <Heading className="heading-2">
            Auditors
          </Heading>
          <Formik
            initialValues={{
              ethAddress: '',
              name: ''
            }}
            onSubmit={async (values, actions) => {
              if (!values.name || !values.ethAddress) {
                toaster.danger('Please fill in all fields.');
                return;
              }
              const blockchain = await grantAuditorRole({ fromAddress: userAddress, auditorEthAddress: values.ethAddress });
              if (!blockchain.status && blockchain.errorMessage) {
                toaster.danger(blockchain.errorMessage);
                return;
              }
              await addAuditor({ ethAddress: values.ethAddress, name: values.name });
              toaster.success('Admitted new auditor.');
              actions.resetForm();
            }}>
            {({ handleSubmit, handleChange, values }) => {
              return (
                <Card
                  className="card-adding-role-wrapper"
                  elevation={1}
                >
                  <div className='input-wrapper'>
                    <TextInput
                      name='name'
                      onChange={handleChange}
                      value={values.name}
                      width='100%'
                      placeholder='Auditor name' />
                  </div>
                  <div className='input-wrapper'>
                    <TextInput
                      name='ethAddress'
                      onChange={handleChange}
                      value={values.ethAddress}
                      width='100%'
                      placeholder='Auditor address' />
                  </div>
                  <div className='actions-wrapper'>
                    <Button onClick={() => handleSubmit()} appearance='primary'>
                      Add auditor
                    </Button>
                  </div>
                </Card>
              )
            }
            }
          </Formik>
          <div className='auditor-table-wrapper'>
            <AuditorTable />
          </div>
        </>
      }
      {
        selectedIndex === 1 && <>
          <Heading marginBottom={majorScale(2)}>
            Judges
          </Heading>
          <Formik
            initialValues={{
              ethAddress: '',
              name: ''
            }}
            onSubmit={async (values, actions) => {
              if (!values.name || !values.ethAddress) {
                toaster.danger('Please fill in all fields.');
                return;
              }
              const blockchain = await grantJudgeRole({ fromAddress: userAddress, judgeEthAddress: values.ethAddress });
              if (!blockchain.status && blockchain.errorMessage) {
                toaster.danger(blockchain.errorMessage);
                return;
              }
              await addJudge({ ethAddress: values.ethAddress, name: values.name });
              toaster.success('Admitted new judge.');
              actions.resetForm();
            }}>
            {({ handleSubmit, handleChange, values }) => {
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
                      placeholder='Judge name' />
                  </Pane>
                  <Pane marginBottom={majorScale(2)}>
                    <TextInput
                      name='ethAddress'
                      onChange={handleChange}
                      value={values.ethAddress}
                      width='100%'
                      placeholder='Judge address' />
                  </Pane>
                  <Pane marginBottom={majorScale(2)} display='flex' justifyContent='flex-end'>
                    <Button onClick={() => handleSubmit()} appearance='primary'>
                      Add judge
                    </Button>
                  </Pane>
                </Card>
              )
            }
            }
          </Formik>
          <JudgeTable /></>
      }

    </div>
  );
}

export default StaffPage;