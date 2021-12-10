import firebase from "firebase/app";
import { candidatePath } from "./candidatePath";

export async function checkIfExistingCandidate(args: {
    ethAddress: string;
}) {
    const existingCandidate = await firebase.database().ref(`${candidatePath}/${args.ethAddress}`).get();
    if (existingCandidate.val()) {
        return existingCandidate.val().isVerified;
    }
    return false;
}