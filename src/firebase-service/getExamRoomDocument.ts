import firebase from "firebase/app";

export async function getExamRoomDocument(args: {
    roomId: string;
}) {
    return firebase.database().ref(`candidate-results/${args.roomId}`).get().then((rs) => {
        return rs.val();
    });
}