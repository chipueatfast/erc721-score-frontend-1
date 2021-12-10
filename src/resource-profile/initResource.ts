import Web3 from 'web3';
import { devProfile } from './profile.dev';

export function initResource(): {
    web3: any,
} {
    const web3 = new Web3(devProfile.blockchainProvider);
    return ({
        web3,
    })
}