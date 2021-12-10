import firebase from 'firebase/app';

export async function createExamRoomDocument(userAddress: string, {
    id,
    roomName,
    subject,
}: {
    id: number,
    roomName: string;
    subject: string;
}): Promise<void> {
    firebase.database().ref(`examRoom/${userAddress}/${id}`).set({
        id,
        name: roomName,
        subject,
        createdDate: (new Date()).toString(),
    });
}