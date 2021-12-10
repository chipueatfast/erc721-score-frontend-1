import React, { useState } from 'react';
import { Formik } from 'formik';
import { FormContainer } from 'components/FormContainer';
import { getScoreHash } from 'services/getScoreHash';
import { ResultScoreSheet } from './candidate-page-components/ResultScoreSheet';

export function CandidatePage() {
    const [tokenId, setTokenId] = useState<number>(0);
    const [scoreHash, setScoreHash] = useState<string>('');
    return (
        <div>
            <Formik
                initialValues={{
                    tokenId: '',
                }}
                onSubmit={(values) => {
                    getScoreHash({
                        tokenId: Number(values.tokenId),
                    }).then(setScoreHash);
                    setTokenId(Number(values.tokenId));
                }}
            >
                {({
                    handleChange,
                    handleSubmit,
                }) => {
                    return (<FormContainer>            
                            <div>
                                <input 
                                    placeholder='find by token id'
                                    name='tokenId'
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                onClick={() => handleSubmit()}
                            >
                                Search for result
                            </button>       
                        </FormContainer>)
                }}
            </Formik>
            {!!tokenId && !!scoreHash && <ResultScoreSheet givenScoreHash={scoreHash} tokenId={tokenId} />}
        </div>
    );
}