import React, { useContext, useEffect, useState } from 'react';
import { UserAddressContext } from 'context/userAddressContext';
import { TickCircleIcon, BanCircleIcon } from 'evergreen-ui';
import { getScoreResultOfAnAddress } from 'firebase-service/getScoreResultOfAnAddress';
import moment from 'moment';
import { convertScoreFormToScoreHash } from 'services/convertScoreFormToScoreHash';
import { getScoreHash } from 'services/getScoreHash';
import { getExamRoomNameByRoomId } from 'firebase-service/getExamRoomNameByRoomId';
import CandidateResultTable from './candidate-profile-components/CandidateResultTable';

import styles from '../public/css/candidateProfilePage.module.css';

type CandidateResultProps = {
  createdDate: string;
  id: string;
  name: string;
  score: string;
  tokenId: string;
  roomId: string;
  subject: string;
};

function CandidateProfilePage() {
  const userAddress = useContext(UserAddressContext);
  const [candidateResult,
    setCandidateResult] = useState<CandidateResultProps[]>([]);

  const [formatCandidateResult,
    setFormatCandidateResult] = useState<any[]>([]);

  useEffect(() => {
    if (userAddress) {
      getScoreResultOfAnAddress({ userAddress }).then(rs => {
        setCandidateResult(rs);
      })
    }
  }, [userAddress]);

  const compareScoreHash = async (record: any) => {
    let scoreHash = null;
    await getScoreHash({
      tokenId: Number(record.tokenId)
    }).then((result) => scoreHash = result);

    const calculatedScoreHash = convertScoreFormToScoreHash({
      subject: record.subject,
      candidateAddress: record.id,
      score: record
        .score
        .toString()
    });

    return scoreHash === calculatedScoreHash;
  }

  useEffect(() => {
    const formatData = candidateResult.map(async (record) => {
      let examName = '';
      await getExamRoomNameByRoomId({
        roomId: record.roomId,
      }).then((result) => examName = result);
      const verifiedOnBlockchain = await compareScoreHash(record);

      return {
        ...record,
        examName,
        verifiedOnBlockchain
      }
    });

    Promise.all(formatData).then((values: any[]) => {
      setFormatCandidateResult(values);
    });
  }, [candidateResult]);

  const columns = [
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (text: String) => <div>{text}</div>,
      fixed: true,
      width: 25,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: String) => <div>{text}</div>,
      fixed: true,
      width: 30,
    },
    {
      title: 'Exam name',
      dataIndex: 'examName',
      key: 'examName',
      render: (text: String) => <div>{text}</div>,
      fixed: true,
      width: 100,
    },
    {
      title: 'Verified on Blockchain',
      dataIndex: 'verifiedOnBlockchain',
      key: 'verifiedOnBlockchain',
      render: (flag: Boolean) => <div>{
        flag
          ? <TickCircleIcon color="success" />
          : <BanCircleIcon color="danger" />
      }</div>,
      fixed: true,
      width: 55,
    },
    {
      title: 'Created at',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (createdDate: any) => <div>{moment(createdDate).format("MMM Do YYYY")}</div>,
      fixed: true,
      width: 55,
    },
  ];

  return (
    <div className={styles.candidateProfileContainer} >
      <div className="heading-wrapper">
        <div className="heading">
          See your result in participated exams
        </div>
        <div className="description">
          Your result has been recorded and secured reliability.
          <br />
          Result that does not have green tick in 'Verified on blockchain' will not be accepted as valid result.
        </div>
      </div>

      <CandidateResultTable columns={columns} dataSource={formatCandidateResult} className='candidate-result-table' />
    </div>
  );
}

export default CandidateProfilePage;