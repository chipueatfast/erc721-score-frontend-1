import { getContract } from 'smart-contract/erc721-score';

export async function getScoreHash({
    tokenId,
}: {
    tokenId: number;
}): Promise<string> {
    try {
        const scoreHash = await getContract().methods.getScoreHashByTokenId(tokenId).call();
        return scoreHash;
    }
    catch (error) {
        return '';
    }
}