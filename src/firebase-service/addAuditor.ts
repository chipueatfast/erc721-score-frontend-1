import firebase from "firebase/app";
import { auditorPath } from "./auditorPath";

export async function addAuditor(args: {
    name: string;
    ethAddress: string;
}) {
    await firebase.database().ref(`${auditorPath}/${args.ethAddress}`).set({
        name: args.name,
        ethAddress: args.ethAddress,
    });
    return true;
}