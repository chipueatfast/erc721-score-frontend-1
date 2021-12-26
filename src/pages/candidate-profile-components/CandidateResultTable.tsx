import React from 'react';
import { Table } from 'antd';


type Props = {
  columns: any,
  dataSource: any,
  className?: any,
}

const CandidateResultTable = (props: Props) => {
  const { columns, dataSource, className } = props;
  return <Table columns={columns} dataSource={dataSource || []} className={className} rowClassName={(record) => record.verifiedOnBlockchain ? '' : 'warning'} />
}

export default CandidateResultTable;