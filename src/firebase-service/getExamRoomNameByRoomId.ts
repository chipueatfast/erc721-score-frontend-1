import firebase from "firebase/app";
import { examRoomPath } from './examRoomPath';

export async function getExamRoomNameByRoomId(args: {
    roomId: string;
}): Promise<string> {
    const rs = await firebase.database().ref(`${examRoomPath}`).get();
    const examRoomRaw = rs.val();
    let examName = '';
    Object.keys(examRoomRaw).forEach(judgeId => {
        Object.keys(examRoomRaw[judgeId]).forEach(roomId => {
            if (roomId === args.roomId) {
                examName = examRoomRaw[judgeId][roomId].name;
            }
        })
    })
    return examName;
}