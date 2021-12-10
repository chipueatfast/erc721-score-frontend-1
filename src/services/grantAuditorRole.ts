import { getContract } from 'smart-contract/erc721-score';
import { parseEVMErrorMessage } from 'utils/parseEVMErrorMessage';

export async function grantAuditorRole({
    auditorEthAddress,
    fromAddress}: {
        auditorEthAddress: string,
        fromAddress: string;
    }): Promise<{
        status: boolean;
        errorMessage?: string;
    }> {
    return new Promise(async (resolve) => {
        try {
            await getContract().methods.grantAuditorRole(auditorEthAddress).send({
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