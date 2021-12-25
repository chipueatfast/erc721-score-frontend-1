import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { Table } from 'evergreen-ui';
import { getOwnerBytokenId } from 'services/getOwnerBytokenId';

function ErrorRow(props: any) {
  const {
    eR,
  } = props;
  const [judgeName, setJudgeName] = useState('');

  useEffect(() => {
    getOwnerBytokenId({
      tokenId: Number(eR.tokenId),
    }).then((judgeAddress) => {
      firebase.database().ref(`judge/${judgeAddress}`).get().then((snapshot) => {
        if (snapshot.exists()) {
          setJudgeName(snapshot.val().name);
        } else {
          setJudgeName("NO DATA AVAILABLE");
        };
      }
      )
    });
  }, []);

  return (
    (<Table.Row intent='danger'>
      <Table.TextCell>
        {eR.tokenId}
      </Table.TextCell>
      <Table.TextCell>
        {eR.name}
      </Table.TextCell>
      <Table.TextCell>
        {eR.score}
      </Table.TextCell>
      <Table.TextCell>
        {judgeName}
      </Table.TextCell>
    </Table.Row>)
  );
}

export default ErrorRow;