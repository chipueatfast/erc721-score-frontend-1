import { FirebaseDatabaseNode } from '@react-firebase/database';
import { judgePath } from 'firebase-service/judgePath';
import TableComponent from './TableComponent';

function JudgeTable() {
  return (
    <FirebaseDatabaseNode path={`${judgePath}`}>
      {
        ({
          value,
        }) => {
          console.log(value);
          let tableData = [];
          if (value) {
            tableData = Object.keys(value).map(k => value[k]);
          }
          return (<TableComponent tableData={tableData} />)
        }
      }
    </FirebaseDatabaseNode>
  );
}

export default JudgeTable;