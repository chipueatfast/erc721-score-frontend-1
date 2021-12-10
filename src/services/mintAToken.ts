import { getContract } from 'smart-contract/erc721-score';
import { parseEVMErrorMessage } from 'utils/parseEVMErrorMessage';

export async function mintAToken({
    fromAddress,
    toAddress,
    scoreHash,
}: {
    fromAddress: string;
    toAddress: string,
    scoreHash: string,
}): Promise<{
    reponse?: {
        tokenId: number;
    };
    errorMessage?: string;
}> {
    return new Promise(async (resolve) => {
        try {
            getContract().once('Transfer', (err, data) => {
                resolve({
                    reponse: {
                        tokenId: data.returnValues.tokenId,
                    },
                })
            })
            await getContract().methods.mint(toAddress, scoreHash).send({
                from: fromAddress,
            });
            

        } catch (error) {
            return resolve({
                errorMessage: parseEVMErrorMessage(error.message),
            });
        }
    })
}