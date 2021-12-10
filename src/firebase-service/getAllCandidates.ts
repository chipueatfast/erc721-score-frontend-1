import firebase from "firebase/app";
import { candidatePath } from './candidatePath';

export async function getAllCandidates() {
    const firebaseResponse = await firebase.database().ref(`${candidatePath}`).get();
    const objectFormat = firebaseResponse.val();
    return Object.keys(objectFormat).map(k => objectFormat[k]);
}