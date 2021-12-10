import React from 'react';
import { Pane, Text, Table, TableHeaderCell, majorScale, minorScale } from 'evergreen-ui';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { mapSubjectValueToLabel } from 'utils/mapSubjectValueToLabel';

export function ExamRoomTable({ userAddress }: {
  userAddress: string;
}) {
  const history = useHistory();
  if (!userAddress) {
    return null;
  }

  return (
    <FirebaseDatabaseNode path={`examRoom/${userAddress}`}>
      {(examRooms) => {
        return (
          <div style={{ marginTop: 24 }}>
            <Table>
              <Table.Head>
                <TableHeaderCell>
                  Room name
                </TableHeaderCell>
                <TableHeaderCell>
                  Exam subject
                </TableHeaderCell>
                <TableHeaderCell>
                  Date created
                </TableHeaderCell>
              </Table.Head>
              <Table.Body>
                {
                  (!examRooms.value) ? (<Table.Row>
                    <Pane display='flex' alignItems='center' marginX={minorScale(3)}>
                      <Text>
                        No data yet
                      </Text>
                    </Pane>
                  </Table.Row>) :
                    (Object.keys(examRooms.value).map((k: string, index: number) => {
                      const r: {
                        id: string;
                        name: string;
                        subject: string;
                        createdDate: string;
                      } = examRooms.value[k];
                      return (<Table.Row
                        intent={index % 2 === 0 ? 'warning' : 'none'}
                        key={r.id}
                        isSelectable
                        onSelect={() => {
                          history.push(`/${r.subject}/${r.id}/result-exam-room`)
                        }}
                      >
                        <Table.TextCell>
                          {r.name}
                        </Table.TextCell>
                        <Table.TextCell>
                          {mapSubjectValueToLabel(r.subject)}
                        </Table.TextCell>
                        <Table.TextCell>
                          {moment(r.createdDate).format("MMM Do YYYY")}
                        </Table.TextCell>
                      </Table.Row>)
                    })
                    )}
              </Table.Body>
            </Table>
          </div>
        )
      }
      }
    </FirebaseDatabaseNode>
  );
}