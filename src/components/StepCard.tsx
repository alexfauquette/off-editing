import * as React from 'react'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "@reach/router";

interface StepCardProps {
    title: string;
    campagne: string;
    step: number;
    todo: number;
    flagged: number;
    isLoading: boolean;
}

const StepCard = (props: StepCardProps) => {
    return <Card sx={{ width: 250, mr: 1, mb: 1 }} variant='outlined'>
        <CardHeader title={props.title} />
        <CardContent>{props.isLoading ? <CircularProgress /> : (<div>{props.todo} - {props.flagged}</div>)}</CardContent>
        <CardActions> <Link to={`/${props.campagne}/${props.step}`}>Go</Link></CardActions>
    </Card>
}

export default StepCard