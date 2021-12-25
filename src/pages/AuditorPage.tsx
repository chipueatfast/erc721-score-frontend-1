import React, { useEffect, useState } from 'react';
import { Spinner, Button, TableHeaderCell, TickCircleIcon } from 'evergreen-ui';
import { getAllScoreToken } from 'firebase-service/getAllScoreToken';
import { convertScoreFormToScoreHash } from 'services/convertScoreFormToScoreHash';
import { getScoreHash } from 'services/getScoreHash';
import CustomTableAntd from 'components/CustomTableAntd';

import styles from '../public/css/auditorPage.module.css';

function AuditorPage() {
  const [activateScan, setActivateScan] = useState(0);
  const [errorResult,
    setErrorResult] = useState<any>([]);
  const [totalTokenCount,
    setTotalTokenCount] = useState(0);



  useEffect(() => {
    async function scan() {
      const errorResultData: any[] = [];
      const allTokens = await getAllScoreToken();
      setTotalTokenCount(allTokens.length);
      allTokens.forEach(async (token) => {
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
          errorResultData.push(token);
        }
      });
      setErrorResult(errorResultData);

      return errorResultData;
    }
    scan();
  }, []);

  if (activateScan === 0) {
    return (<div className={styles.auditorPageContainer}>
      <div className='heading'>
        Auditor Section
      </div>
      <div className='description'>
        <p>
          Scan and monitor the whole system to detect invalidity in all minted result.
          <br />
          Please have your device plugged in powersource because this action may cost a lot of computation resource.
          <br />
          While the SCAN action is running, do not close this tab.
        </p>
      </div>
      <Button onClick={() => {
        setActivateScan(1);
        setTimeout(() => {
          setActivateScan(2);
        }, 2000);
      }} appearance='primary' className='btn-scan'>
        Scan
      </Button>
    </div>)
  }

  if (activateScan === 1) {
    return (<div className={styles.auditorPageContainer}>
      <div className='heading'>
        Auditor Section
      </div>
      <div className='spinner-wrapper'>
        <Spinner />
      </div>
    </div>)
  }

  const columns = [
    {
      title: window.innerWidth >= 500 ? 'TOKEN ID' : 'ID',
      dataIndex: 'tokenId',
      key: 'tokenId',
      render: (text: String) => <div>{text}</div>,
      fixed: true,
      width: 25,
    },
    {
      title: window.innerWidth >= 500 ? 'CANDIDATE NAME' : 'CANDIDATE',
      dataIndex: 'name',
      key: 'name',
      render: (text: String) => <div>{text}</div>,
      width: 130,
    },
    {
      title: 'SCORE',
      dataIndex: 'score',
      key: 'score',
      render: (text: String) => <div>{text}</div>,
      width: 56,
    },
    {
      title: window.innerWidth >= 500 ? 'JUDGE NAME' : 'JUDGE',
      dataIndex: 'judgeName',
      key: 'judgeName',
      render: (text: String) => <div>{text}</div>,
      width: 130,
    },
  ];

  return (
    <div className={styles.auditorPageContainer}>
      <div className='heading'>
        Auditor Section
      </div>
      <div className='content-wrapper'>
        <div className='row-wrapper'>
          <div>
            Total evaluation:&nbsp;
          </div>
          <div>
            {totalTokenCount}
          </div>
        </div>
        <div className='row-wrapper'>
          <div>
            Violation detected:&nbsp;
          </div>
          <div>
            {errorResult.length}
          </div>
        </div>
      </div>
      {
        errorResult.length === 0 ?
          <div className='no-error-wrapper'>
            <TickCircleIcon size={48} color='success' />
            <div className='informational-text'>
              No issues detected, the whole system is reliable
            </div>
          </div> :
          <CustomTableAntd columns={columns} dataSource={errorResult || []} className='Custom-table-antd' />
      }

    </div>
  );
}

export default AuditorPage;