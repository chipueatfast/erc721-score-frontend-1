import firebase from "firebase/app";
import { EnumCandidateVerifyStatus } from "models/EnumCandidateVerifyStatus.model";
import { candidatePath } from './candidatePath';

export async function getCandidateAutocomplete() {
    const firebaseResponse = await firebase.database().ref(`${candidatePath}`).get();
    const objectFormat = firebaseResponse.val();
    return Object.keys(objectFormat).map(k => objectFormat[k]).filter(c => c.isVerified === EnumCandidateVerifyStatus.APPROVED);
}