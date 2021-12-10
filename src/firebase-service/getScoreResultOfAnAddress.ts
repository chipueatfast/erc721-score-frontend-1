import { getAllScoreToken } from "./getAllScoreToken";

export async function getScoreResultOfAnAddress(args: {
    userAddress: string;
}): Promise<{
    createdDate: string;
    id: string;
    name: string;
    score: string;
    tokenId: string;
    roomId: string;
    subject: string;
}[]> {
    const allTokens = await getAllScoreToken();
    const candidateResultTokens = allTokens.filter(t => t.id === args.userAddress);
    return candidateResultTokens;
}