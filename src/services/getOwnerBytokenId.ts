import { getContract } from 'smart-contract/erc721-score';

export async function getOwnerBytokenId({
    tokenId,
}: {
    tokenId: number;
}): Promise<string> {
    try {
        const ownerAddress = await getContract().methods.getOwnerAddressByTokenId(tokenId).call();
        return ownerAddress;
    }
    catch (error) {
        return '';
    }
}