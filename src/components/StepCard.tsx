import * as React from 'react'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { Link } from "@reach/router";

interface StepCardProps {
    title: string;
    campagne: string;
    description: string;
    step: number;
    todo: number;
    flagged: number;
}

const StepCard = (props: StepCardProps) => {
    return <Card sx={{ width: 250, mr: 1, mb: 1 }} variant='outlined'>
        <CardHeader title={props.title} subheader={props.description} />
        <CardContent>
            <div>Restant: {props.todo}
                <br />
                A problem: {props.flagged}
            </div>
        </CardContent>
        <CardActions>
            <Link to={`/${props.campagne}/${props.step}`}>Go</Link>
        </CardActions>
    </Card >
}

export default StepCard