import firebase from "firebase/app";

export async function addCandidateToFirebaseService(args: {
    tokenId: number;
    roomId: string;
    subject: string;
    ethAddress: string;
    candidateName: string;
    score: string;
}): Promise<void> {
    firebase.database().ref(`candidate-results/${args.roomId}/${args.ethAddress}`).set({
        id: args.ethAddress,
        name: args.candidateName,
        subject: args.subject,
        score: args.score,
        createdDate: (new Date()).toString(),
        tokenId: args.tokenId,
    });
}