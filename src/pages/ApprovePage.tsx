import React, { useContext, useState, useEffect } from 'react';
import { Text, Pane, Tooltip, IconButton, ManuallyEnteredDataIcon, Dialog, toaster, Paragraph, Strong } from 'evergreen-ui';
import { Table, Modal } from 'antd';
import { EnumCandidateVerifyStatus } from 'models/EnumCandidateVerifyStatus.model';
import { grantCandidateRole } from 'services/grantCandidateRole';
import { UserAddressContext } from 'context/userAddressContext';
import { approveCandidate } from 'firebase-service/approveCandidate';
import { rejectCandidate } from 'firebase-service/rejectCandidate';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { candidatePath } from 'firebase-service/candidatePath';
import styles from '../public/css/approvePage.module.css';

function ApprovePage() {
  const userAddress = useContext(UserAddressContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [candidateInformation, setCandidateInformation] = useState({ name: '', ethAddress: '' });
  console.log('isModalVisible: ', isModalVisible);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const { name, ethAddress } = candidateInformation;
    const rs = await grantCandidateRole({
      candidateName: name,
      candidateEthAddress: ethAddress,
      fromAddress: userAddress,
    });
    if (!rs.status && rs.errorMessage) {
      toaster.danger(rs.errorMessage);
      return;
    }
    approveCandidate({
      name,
      ethAddress,
    }).then(rs => {
      if (rs) {
        toaster.success('This candidate has been added to user list.')
        setIsModalVisible(false);
        setCandidateInformation({ name: '', ethAddress: '' });
      }
    })
  };

  const handleCancel = () => {
    const { name, ethAddress } = candidateInformation;
    rejectCandidate({
      name,
      ethAddress,
    }).then(rs => {
      if (rs) {
        toaster.notify('This candidate has been rejected.')
        setIsModalVisible(false);
        setCandidateInformation({ name: '', ethAddress: '' });
      }
    })
  };

  const columns = [
    {
      title: 'Candidate name',
      dataIndex: 'name',
      key: 'name',
      render: (text: String) => <div>{text}</div>,
      width: 110,
      fixed: true,
    },
    {
      title: window.innerWidth <= 500 ? 'Eth. add.' : 'Ethereum address',
      dataIndex: 'ethAddress',
      key: 'ethAddress',
      render: (text: String) => <div>{text}</div>,
      width: window.innerWidth <= 500 ? 126 : 200,
    },
    {
      title: 'Status',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (text: String) => <div>{text}</div>,
      width: 66,
    },
    {
      title: 'Actions',
      dataIndex: 'isVerified',
      key: 'Actions',
      render: (text: string, record: any) => {
        const { ethAddress, name, isVerified } = record;
        return (<div>
          {isVerified === EnumCandidateVerifyStatus.PENDING
            ? <Text>
              No actions available
            </Text>
            : <div>
              <Tooltip content="Check for approval">
                <IconButton
                  onClick={() => {
                    showModal();
                    setCandidateInformation({ name, ethAddress });
                  }}
                  icon={ManuallyEnteredDataIcon} />
              </Tooltip>
            </div>
          }
        </div>)
      },
      width: 55,
    },
  ];

  return (
    <div className={styles.approvePageContainer}>
      <FirebaseDatabaseNode path={`${candidatePath}`}>
        {
          ({ value }) => {
            let tableData = [];
            if (value) {
              tableData = Object.keys(value).map(k => value[k]);
            }
            return (<div>
              <Table columns={columns} dataSource={tableData} scroll={{ x: 110 }} />
            </div>)
          }}
      </FirebaseDatabaseNode>
      <Modal
        wrapClassName={`modal-custom ${styles.modalApproveCandidate}`}
        title="Check for approval"
        keyboard={false}
        maskClosable={false}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Reject"
        okText="Admit"
      >
        <Pane>
          <p>
            <Strong>
              Please make sure provided text matches with information in picture
            </Strong>
            <br />
            Name: {candidateInformation?.name}
          </p>
          <div className='identify-image-wrapper'>
            <img
              src='https://i.imgur.com/NpGeq0m.png'
              alt='mock KYC' />
          </div>
        </Pane>
      </Modal>
    </div>
  );
}

export default ApprovePage;