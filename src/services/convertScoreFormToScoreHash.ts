import sha256 from 'crypto-js/sha256';
import { IScore } from 'models/IScore.model';
import { sortToGivenOrder } from './sortToGivenOrder';

export function convertScoreFormToScoreHash(scoreObj: IScore): string {
    const keys = [
        'score',
        'subject', 
        'candidateAddress'];
    const orderedScoreObj = sortToGivenOrder({
        object: scoreObj,
        keys,
    });
    return sha256(JSON.stringify(orderedScoreObj)).toString();
}