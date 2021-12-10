import { getContract } from 'smart-contract/erc721-score';
import { parseEVMErrorMessage } from 'utils/parseEVMErrorMessage';

export async function updateScoreToken({
    tokenId,
    scoreHash,
    fromAddress}: {
        tokenId: number;
        scoreHash: string;
        fromAddress: string;
    }): Promise<{
        reponse?: {
            tokenId: number;
        };
        errorMessage?: string;
    }> {
    return new Promise(async (resolve) => {
        try {
            getContract().once('Update', (err, data) => {
                resolve({
                    reponse: {
                        tokenId: data.returnValues.tokenId,
                    },
                })
            })
            await getContract().methods.updateScoreHashByTokenId(tokenId, scoreHash).send({
                from: fromAddress,
            });
        }
        catch (error) {
            return resolve({
                errorMessage: parseEVMErrorMessage(error.message),
            });
        }
    });
}