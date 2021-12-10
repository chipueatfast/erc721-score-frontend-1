import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Heading, Text } from 'evergreen-ui';
import { detectRole } from 'firebase-service/detectRole';
import Image from '../component/Image';

import styles from '../public/css/homePage.module.css';

function HomePage(props: {
    userAddress: string;
}) {
    const history = useHistory();
    const [displayName, setDisplayName] = useState('');
    useEffect(() => {
        if (props.userAddress) {
            detectRole({
                userAddress: props.userAddress
            }).then(rs => {
                setDisplayName(rs.titleName);
            })
        }
    }, [props.userAddress])
    return (
        <div className={styles.homePageContainer}>
            <div className='welcome-text'>
                {
                    !!displayName ? <Heading>
                        Welcome {displayName} to
                    </Heading> :
                        <>
                            <Text>
                                If you are a candidate, please register your Ethereum address by clicking&nbsp;
                            </Text>
                            <Button
                                onClick={() => {
                                    history.push('/candidate/register');
                                }}
                            >
                                Register as a candidate
                            </Button>
                        </>
                }
            </div>
            <div className='heading'>
                Apply blockchain technology to
                <br />
                managing exam score
            </div>
            <Image
                className='logo'
                alt='logo'
                src='https://image.flaticon.com/icons/png/512/326/326909.png'
            />
            <div className='author-wrapper'>
                <Text className='text'>
                    Author: Nguyen Tan Toan, Pham Huy Phat
                </Text>
            </div>
        </div>
    );
}

export default HomePage;