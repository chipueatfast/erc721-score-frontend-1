import firebase from "firebase/app";

export async function getAllScoreToken(): Promise<{
    createdDate: string;
    id: string;
    name: string;
    score: string;
    tokenId: string;
    roomId: string;
    subject: string;
}[]> {
    return firebase.database().ref(`candidate-results`).get().then(rs => {
        const value: {
            [roomId: string]: any,
        } = rs.val();
        if (!!value) {
            const tokenList: any = [];
            Object.keys(value).forEach(roomKey => {
                Object.keys(value[roomKey]).forEach(resultKey => {
                    tokenList.push({
                        roomId: roomKey,
                        ...value[roomKey][resultKey],
                    });
                })
            });
            return tokenList;
        }
        return [];
    });
}