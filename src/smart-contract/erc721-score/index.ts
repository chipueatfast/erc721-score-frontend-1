import { getWeb3 } from 'GlobalContext';
import * as Web3EthContract from 'web3-eth-contract';

const NETWORK_ID = 97;

const erc721ScoreJson = require('./ERC721PresetMinterPauserAutoId.json');

let contract: Web3EthContract.Contract;

export function getContract(): Web3EthContract.Contract {
    if (!contract && !!getWeb3()) {
        (Web3EthContract as any).setProvider(getWeb3().eth.currentProvider);

        contract = new (Web3EthContract as any)(erc721ScoreJson.abi, erc721ScoreJson.networks[NETWORK_ID].address);
    }
    return contract;
}