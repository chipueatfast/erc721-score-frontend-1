import React from 'react';
import { Link, majorScale } from 'evergreen-ui';
import { matchPath } from 'react-router-dom';
interface IProps {
    headerName: string;
    headerHref: string;
    activatedList?: string[];
}

function HeaderItem(props: IProps) {


    const isActive = [props.headerHref, ...props.activatedList || []].reduce((acc, val) => {
        return acc || !!matchPath(window.location.pathname, {path: val});
    }, false);

    return (
        <Link
            fontWeight={isActive ? 'bold' : 'normal'} 
            href={props.headerHref}
            marginRight={majorScale(2)}
        >
            {props.headerName}
        </Link>
    );
}

export default HeaderItem;