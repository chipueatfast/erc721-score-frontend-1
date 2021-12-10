import React, { useEffect, useState } from 'react';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { scoreSheetPath } from 'firebase-service/scoreSheetPath';
import { convertScoreFormToScoreHash } from 'services/convertScoreFormToScoreHash';

interface IProps {
    tokenId: number;
    givenScoreHash: string;
}

export function ResultScoreSheet(props: IProps) {
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 0);
    }, [props.tokenId]);
    if (refresh) {
        return null;
    }

    return (
        <FirebaseDatabaseNode path={`${scoreSheetPath}/${props.tokenId}`}>
            {
                scoreSheet => {
                    const calculatedScoreHash = scoreSheet.value ? convertScoreFormToScoreHash(scoreSheet.value) : '';
                    return (
                    <div>
                        <p>
                            {JSON.stringify(scoreSheet.value, null, 2)}
                        </p>
                        {
                            !!scoreSheet.value && 
                            <p>
                                {convertScoreFormToScoreHash(scoreSheet.value)}
                            </p>
       
                        }
                        {
                            props.givenScoreHash === calculatedScoreHash ?
                            <span>
                                ✅ 
                            </span>
                            : 
                            <span>
                                ❌
                            </span>
                        }
                        
                    </div>)
            }}
        </FirebaseDatabaseNode>
    );
}
