import React from 'react';
import {
    Dialog,
    Text,
    IconButton,
    majorScale,
    ManuallyEnteredDataIcon,
    Pane,
    Table,
    Tooltip,
    Strong,
    Paragraph,
    toaster
} from 'evergreen-ui';
import { approveCandidate } from 'firebase-service/approveCandidate';
import { rejectCandidate } from 'firebase-service/rejectCandidate';
import { EnumCandidateVerifyStatus } from 'models/EnumCandidateVerifyStatus.model';
import { grantCandidateRole } from 'services/grantCandidateRole';
import { useContext } from 'react';
import { UserAddressContext } from 'context/userAddressContext';

function CandidateRow(props : any) {
    const userAddress = useContext(UserAddressContext);
    const [shownDialog,
        setShownDialog] = React.useState(false);
    const {ethAddress, name, isVerified} = props;
    return (
        <Pane>
            <Dialog
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEscapePress={false}
                isShown={shownDialog}
                title='Check for approval'
                cancelLabel='Reject'
                confirmLabel='Admit'
                onConfirm={async () => {
                    const rs = await grantCandidateRole({
                        candidateName: name,
                        candidateEthAddress: ethAddress,
                        fromAddress: userAddress,
                    });
                    if (!rs.status && rs.errorMessage) {
                        toaster.danger(rs.errorMessage);
                        return;
                    }
                    approveCandidate({
                        name,
                        ethAddress,
                    }).then(rs => {
                        if (rs) {
                            toaster.success('This candidate has been added to user list.')
                            setShownDialog(false);
                        }
                    })
                }}
                onCancel={() => {
                    rejectCandidate({
                        name,
                        ethAddress,
                    }).then(rs => {
                        if (rs) {
                            toaster.notify('This candidate has been rejected.')
                            setShownDialog(false);
                        }
                    })
                }}>
                <Pane>
                    <Pane marginBottom={majorScale(2)}>
                        <Paragraph marginBottom={majorScale(2)}>
                            <Strong>
                                Please make sure provided text matches with information in picture
                            </Strong>
                            <br/>
                            Name: {name}
                        </Paragraph>
                        <img
                            style={{
                            marginTop: majorScale(2)
                        }}
                            src='https://i.imgur.com/NpGeq0m.png'
                            alt='mock KYC'/>
                    </Pane>
                </Pane>
            </Dialog>
            <Table.Row>
                <Table.TextCell>
                    {name}
                </Table.TextCell>
                <Table.TextCell>
                    {ethAddress}
                </Table.TextCell>
                <Table.TextCell>
                    {isVerified}
                </Table.TextCell>
                <Table.Cell>
                    {isVerified !== EnumCandidateVerifyStatus.PENDING
                        ?   <Text>
                              -
                            </Text>
                        : <Pane>
                            <Tooltip content="Check for approval">
                                <IconButton
                                    onClick={() => setShownDialog(true)}
                                    icon={ManuallyEnteredDataIcon}/>
                            </Tooltip>
                        </Pane>
                    }
                </Table.Cell>

            </Table.Row>
        </Pane>
    );
}

export default CandidateRow;