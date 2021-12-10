import firebase from "firebase/app";
import { doesKeyExistInObject } from "utils/keyDoesExistInObject";
import { auditorPath } from "./auditorPath";
import { candidatePath } from './candidatePath';
import { judgePath } from './judgePath';

export const adminAddress = '0x521a848deaA882844a84442f5A0eb112De7D57c6';

export async function detectRole(args: {
    userAddress: string;
}): Promise<{
    titleName: string;
    role: 'JUDGE' | 'AUDITOR' | 'CANDIDATE' | 'ADMIN' | '';
}> {
    if (args.userAddress === adminAddress) {
        return {
            titleName: `Admin`,
            role: 'ADMIN', 
        };
    }
    const auditorList = (await firebase.database().ref(`${auditorPath}`).get()).val();
    if (doesKeyExistInObject(auditorList, args.userAddress)) {
        return {
            titleName: `Auditor ${auditorList[args.userAddress].name}`,
            role: 'AUDITOR', 
        };
    }
    const judgeList = (await firebase.database().ref(`${judgePath}`).get()).val();
    if (doesKeyExistInObject(judgeList, args.userAddress)) {
        return {
            titleName: `Judge ${judgeList[args.userAddress].name}`,
            role: 'JUDGE', 
        };
    }
    const candidateList = (await firebase.database().ref(`${candidatePath}`).get()).val();
    if (doesKeyExistInObject(candidateList, args.userAddress)) {
        return {
            titleName: `Candidate ${candidateList[args.userAddress].name}`,
            role: 'CANDIDATE' 
        };
    }
    return {
        titleName: '',
        role: '',
    };
}