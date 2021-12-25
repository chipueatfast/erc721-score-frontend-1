import React, { useEffect, useState } from 'react';
import { Table, TableProps } from 'antd';
import { getOwnerBytokenId } from 'services/getOwnerBytokenId';
import firebase from 'firebase';

type Props = {
  columns: any,
  dataSource: any,
  className?: any,
}

function CustomTableAntd({ columns, dataSource, className }: Props) {
  const [formatDataSource, setDataSource] = useState<any[]>([]);
  async function judgeNameByRecord(tokenId: number): Promise<string> {
    let judgeName = '';
    await getOwnerBytokenId({
      tokenId: tokenId,
    }).then(async (judgeAddress) => {
      await firebase.database().ref(`judge/${judgeAddress}`).get().then((snapshot) => {
        if (snapshot.exists()) {
          judgeName = snapshot.val().name;
        } else {
          judgeName = "NO DATA AVAILABLE";
        }
      });
    });
    return judgeName;
  }

  useEffect(() => {
    if (dataSource) {
      const formatDataErrorResult = dataSource.map(async (item: any) => {
        const judgeName = await judgeNameByRecord(Number(item.tokenId));
        return { ...item, judgeName: judgeName };
      });

      Promise.all(formatDataErrorResult).then((values: any[]) => {
        setDataSource(values);
      });
    }
  }, [])

  return <Table columns={columns} dataSource={formatDataSource || []} className={className} />;
}

export default CustomTableAntd;