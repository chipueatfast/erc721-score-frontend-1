import { getContract } from 'smart-contract/erc721-score';
import { parseEVMErrorMessage } from 'utils/parseEVMErrorMessage';

export async function grantJudgeRole({
    judgeEthAddress,
    fromAddress}: {
        judgeEthAddress: string,
        fromAddress: string;
    }): Promise<{
        status: boolean;
        errorMessage?: string;
    }> {
    return new Promise(async (resolve) => {
        try {
            await getContract().methods.granMinterRole(judgeEthAddress).send({
                from: fromAddress,
            });
            
            resolve({
                status: true,
            })
        }
        catch (error) {
            return resolve({
                status: false,
                errorMessage: parseEVMErrorMessage(error.message),
            });
        }
    });
}