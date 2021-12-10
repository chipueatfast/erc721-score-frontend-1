import React from 'react';
import { FirebaseDatabaseTransaction } from '@react-firebase/database';
import { FormContainer } from 'components/FormContainer';
import { mintAToken } from 'services/mintAToken';
import {Formik} from 'formik';
import { convertScoreFormToScoreHash } from 'services/convertScoreFormToScoreHash';
import { IScore } from 'models/IScore.model';
import { scoreSheetPath } from 'firebase-service/scoreSheetPath';


interface IProps {
    userAddress: string;
}

export function JudgePage(props: IProps) {
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    if (!props.userAddress) {
        return null;
    }
    return (
        <div
            style={{
                display: 'block',
            }}
        >
            <FirebaseDatabaseTransaction path={scoreSheetPath}>
                {
                    ({ runTransaction }) => {                        
                        return (
                <Formik
                    initialValues={{
                        score: '',
                        subject: '',
                        candidateAddress: '',
                    }}
                    onSubmit={(values) => {
                        mintAToken({
                            scoreHash: convertScoreFormToScoreHash({
                                ...values,
                            } as IScore),
                            toAddress: values.candidateAddress,
                            fromAddress: props.userAddress,
                        }).then(result => {
                            if (result.reponse && result.reponse.tokenId) {
                                const tokenId = result.reponse.tokenId;
                            runTransaction({
                                reducer: (state) => {
                                    console.log(state);
                                    if (!state) {
                                        state={};
                                    }
                                    state[tokenId]=values;
                                    return {...state};
                                }
                            }).then(() => {});
                            setSuccessMessage(`The new minted token ID is: ${tokenId}`)
                        }
                        if ("errorMessage" in result && typeof result.errorMessage === 'string') {
                            setErrorMessage(result.errorMessage);
                        }                        
                    })
                }}
            >
                {
                    ({
                        values,
                        handleSubmit,
                        handleChange,
                    }) => {
                        return (<FormContainer>
                            <div>
                                Create a score token here:
                            </div>
                            <select 
                                value={values.subject}
                                onChange={handleChange}
                                placeholder='<Choose a subject>'
                                name="subject"
                            >
                                <option value="" disabled>Subject</option>
                                <option value="math">Math</option>
                                <option value="literature">Literature</option>
                                <option value="english">English</option>
                            </select>
                            <div>
                                <input
                                    name="score"
                                    placeholder='score'
                                    onChange={handleChange}
                                />
                            </div> 
                            <div>
                                <input
                                    name="candidateAddress"
                                    placeholder='candidate address'
                                    onChange={handleChange}
                                />
                            </div> 
                            {
                                !!successMessage ?
                                <button
                                    onClick={() => window.location.reload()}
                                >
                                    Reset
                                </button> :
                            <button
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Mint a score token
                            </button>
                            }
                        </FormContainer>)
                    }
                }
            </Formik>)
                    }
                }

            </FirebaseDatabaseTransaction>
            {
                !!errorMessage &&
                <div style={{color: 'red'}}>
                    {errorMessage}
                </div>
            }
            {
                !!successMessage && 
                <div style={{color: 'green'}}>
                    {successMessage}
                </div>
            }
        </div>
    );
}
