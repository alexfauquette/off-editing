import * as React from 'react'
import { RouteComponentProps } from '@reach/router';
import {
    useQuery,
} from 'react-query'

interface CampagneAdminProps extends RouteComponentProps {
    campagne?: string
}

const CampagneAdmin = (props: CampagneAdminProps) => {

    return <p>campagne: {props.campagne}</p>
}


export default CampagneAdmin