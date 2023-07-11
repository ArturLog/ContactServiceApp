import { Grid } from '@mui/material'
import { Card, CardContent } from '@mui/material'
import React from 'react'

// Wyśrodkowanie i dostosowanie reszty komponentów
export default function Center(props) {
    return (
        <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ float: 'left', width: '50%', minHeight: '100vh' }}>
            <Grid sx={{ minWidth: '80%' }} item xs={1}>
                <Card sx={{ width: '100%', height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        {props.children}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}