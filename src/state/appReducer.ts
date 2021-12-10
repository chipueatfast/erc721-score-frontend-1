import { SET_USER_ADDRESS } from "./constants";

interface IAppState {
    userAddress: string;
}

export const appReducer = (state: IAppState, action: any): IAppState => {
    switch (action) {
        case SET_USER_ADDRESS: {
            return {
                ...state,
                userAddress: action.payload.userAddress,
            }
        }
    }
    return state;
}
