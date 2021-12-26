import React, { useState } from 'react';
import { Button, Heading, majorScale, Pane, Paragraph, SearchInput, Text } from 'evergreen-ui';
import { Formik } from 'formik';
import { getScoreHash } from 'services/getScoreHash';
import { ResultScoreSheetV2 } from './candidate-page-components/ResultScoreSheetV2';
import { getOwnerBytokenId } from 'services/getOwnerBytokenId';
import { getAllScoreToken } from 'firebase-service/getAllScoreToken';

import styles from '../public/css/searchPage.module.css';

export function SearchPage() {
  const [tokenInfo, setTokenInfo] = useState<{
    tokenId: number;
    roomId: string;
    candidateAddress: string;
  } | null>(null);
  const [scoreHash, setScoreHash] = useState<string>('');
  const [judgeAddress, setJudgeAddress] = useState<string>('');

  return (
    <div className={styles.searchContainer}>
      <Formik
        initialValues={{
          tokenId: '',
        }}
        onSubmit={(values) => {
          console.log('onSubmit: ', values);
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
          console.log('scoreHash: ', scoreHash);
          console.log('judgeAddress: ', judgeAddress);
          console.log('tokenInfo: ', tokenInfo);
        }}
      >
        {
          ({
            handleChange,
            handleSubmit,
          }) => {
            return (
              <div className='formik-wrapper'>
                <div className='heading'>
                  Search a specific result by token ID
                </div>
                <div className='description'>
                  In case you need to look deeper into one single case to scrutinize, this function provide more insight on the published result.
                </div>
                <div className='search-wrapper'>
                  <SearchInput
                    name='tokenId'
                    onChange={handleChange}
                    placeholder='Token ID'
                    className='search-input-wrapper'
                  />
                  <Button
                    className='btn-submit'
                    type="button"
                    onClick={(e: any) => handleSubmit()}
                  >
                    Find score token
                  </Button>
                </div>
              </div>
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
    </div>
  );
}