import * as React from 'react'

import { RouteComponentProps } from '@reach/router';

import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "@reach/router";
import { Typography } from '@mui/material';
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'


const WelcomePage = (props: RouteComponentProps) => {

    const [loading, setLoading] = React.useState(true)
    const [campagnes, setCampagnes] = React.useState<string[]>([])


    React.useEffect(() => {
        let setData = true;

        setLoading(true)
        const fetData = async () => {
            const response = await fetch(`https://amathjourney.com/api/off-annotation/layout/`)
            if (!response.ok) {
                console.log(response)
                throw new Error('Network response was not ok')
            }
            const data = await response.json()

            if (setData) {
                setLoading(false)
                setCampagnes(data.result.map(({ campagne }) => campagne))
            }
        }
        fetData()
        return () => { setData = false }
    }, [])

    if (loading) {
        return <CircularProgress />
    }
    return <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <Typography>Available Campagnes</Typography>
        <List>
            {campagnes.map((campagne) =>
                <Link key={campagne} to={`/${campagne}/`}>
                    <ListItem >
                        <ListItemText primary={campagne} />
                    </ListItem></Link>)}
        </List>
    </Box >
}


export default WelcomePage