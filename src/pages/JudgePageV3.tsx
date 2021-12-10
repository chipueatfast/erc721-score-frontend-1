import React from 'react';
import {IconButton, Pane, Table, WidgetButtonIcon} from 'evergreen-ui';

function JudgePageV3() {
    const profiles = [
        {
            id: 0,
            realName: 'John Doe',
            ethAddress: '0x3a8b9BCCEfd159B897a3FE2191B71efc1dC31707'
        }
    ]
    return (
        <Table>
            <Table.Head>
                <Table.SearchHeaderCell/>
                <Table.TextHeaderCell>Last Activity</Table.TextHeaderCell>
                <Table.TextHeaderCell>ltv</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body height={240}>
                {profiles.map((profile) => (
                    <Table.Row key={profile.id} isSelectable onSelect={() => alert(profile.realName)}>
                        <Table.TextCell>{profile.realName}</Table.TextCell>
                        <Table.TextCell>{profile.ethAddress}</Table.TextCell>
                        <Table.TextCell>
                            <Pane>
                                <IconButton
                                    name='add'
                                />
                            </Pane>
                        </Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export default JudgePageV3;