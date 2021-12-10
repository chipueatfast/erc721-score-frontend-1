import { Dispatch } from "react";
import { SET_USER_ADDRESS } from "./constants";

export const setUserAddressAction = (dispatch: Dispatch<any>, payload: {
    userAddress: string,
}): {
    type: string;
    payload: {
        userAddress: string,
    }} => {
        return {
            type: SET_USER_ADDRESS,
            payload,
        }
}