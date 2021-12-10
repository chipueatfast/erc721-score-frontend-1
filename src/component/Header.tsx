import React, { useState, useEffect } from 'react';
import { Code, Text, Pane, Position, Tooltip } from 'evergreen-ui';
import HeaderItem from './HeaderItem';
import Image from './Image';
import { detectRole } from 'firebase-service/detectRole';
import { reduceAddressForDisplay } from 'utils/reduceAddressForDisplay';

import styles from '../public/css/header.module.css';


interface IProps {
    userAddress: string;
}

export function Header(props: IProps) {
    const [role, setRole] = useState('');
    const [displayName, setDisplayName] = useState('');
    useEffect(() => {
        if (props.userAddress) {
            detectRole({
                userAddress: props.userAddress
            }).then(rs => {
                setRole(rs.role);
                setDisplayName(rs.titleName);
            })
        }
    }, [props.userAddress])
    return (
        <div className={styles.headerContainer}>
            <div className='col-left'>
                <div className='logo-wrapper'>
                    <a href='/'>
                        <Image className="logo" alt='Logo' src='https://image.flaticon.com/icons/png/512/326/326909.png' />
                    </a>
                </div>
                {
                    role === 'ADMIN' &&
                    <>
                        <HeaderItem
                            headerHref='/dashboard'
                            headerName='Dashboard'
                        />
                        <HeaderItem
                            headerHref='/staff'
                            headerName='Staff'
                        />
                    </>
                }
                {
                    role === 'AUDITOR' &&
                    <>
                        <HeaderItem
                            headerHref='/auditor'
                            headerName='Auditor'
                        />
                        <HeaderItem
                            headerHref='/search'
                            headerName='Search'
                        />
                    </>
                }
                {
                    role === 'JUDGE' &&
                    <HeaderItem
                        headerName='Judge'
                        headerHref='/exam-room'
                        activatedList={['/:subject/:roomId/result-exam-room']}
                    />
                }
                {
                    role === 'CANDIDATE' &&
                    <HeaderItem
                        headerName='Candidate'
                        headerHref='/candidate-profile'
                    />
                }
            </div>
            <Pane>
                <Tooltip
                    content={<Pane overflow='hidden'>
                        <Text textOverflow='ellipsis' color='white'>
                            User address: {reduceAddressForDisplay(props.userAddress)}
                        </Text>
                    </Pane>}
                    position={Position.LEFT}
                >
                    <Code>
                        {displayName}
                    </Code>
                </Tooltip>
            </Pane>
        </div>
    );
}