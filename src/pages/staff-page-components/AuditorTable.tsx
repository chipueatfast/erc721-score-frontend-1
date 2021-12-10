import { FirebaseDatabaseNode } from '@react-firebase/database';
import { auditorPath } from 'firebase-service/auditorPath';
import TableComponent from './TableComponent';

function AuditorTable() {
  return (
    <FirebaseDatabaseNode path={`${auditorPath}`}>
      {
        ({
          value,
        }) => {
          let tableData = [];
          if (value) {
            tableData = Object.keys(value).map(k => value[k]);
          }
          return (
            <TableComponent tableData={tableData} />
          )
        }
      }
    </FirebaseDatabaseNode>
  );
}

export default AuditorTable;