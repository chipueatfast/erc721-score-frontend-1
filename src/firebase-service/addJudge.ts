import firebase from "firebase/app";
import { judgePath } from "./judgePath";

export async function addJudge(args: {
    name: string;
    ethAddress: string;
}) {
    await firebase.database().ref(`${judgePath}/${args.ethAddress}`).set({
        name: args.name,
        ethAddress: args.ethAddress,
    });
    return true;
}