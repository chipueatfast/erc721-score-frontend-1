import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: String) => <div>{text}</div>,
    width: 180,
  },
  {
    title: 'Eth. Address',
    dataIndex: 'ethAddress',
    key: 'ethAddress',
    render: (text: String) => <div>{text}</div>,
    width: 180,
  },
];

function TableComponent(props: any) {
  const { tableData } = props;
  return (
    <Table columns={columns} dataSource={tableData}/>
  );
}

export default TableComponent;
