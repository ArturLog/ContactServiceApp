import React from 'react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Center from '../../center'
import { createAPIEndpoint } from '../../../api'
import { ENDPOINTS } from '../../../api'
import useStateContext from '../../../hooks/useStateContext'
import { useState } from 'react'
import { useEffect } from 'react'

// Tworzenie okna zalogowanego użytkownika
export default function Account() {
    const { context, setContext, resetContext } = useStateContext()
    const [userName, setUserName] = useState()

    // Obsluga wylogowania
    const logout = () => {
        resetContext(context)
        //createAPIEndpoint(ENDPOINTS.contact)
        //.postLogout()
    }

    /*
    // Próba pobrania danych użytkownika 
    useEffect(() => {
        resetContext(context)
        createAPIEndpoint(ENDPOINTS.contact)
            .postUser()
            .then(res => {
                setUserName(res.data.name)
            })
            .catch(err => {
                setUserName("Błąd połączenia")
            })
    })
    */

    return (
        <Center>
            <Typography variant="h3" sx={{ my: 3 }}>
                Witaj {context.userName} !
            </Typography>
            <Box sx={{
                '& .MuiTextField-root': {
                    m: 1,
                    width: '80%'
                }
            }}>
                <Button
                    onClick={logout}
                    variant="contained"
                    size="large"
                    sx={{ width: '80%' }}>Logout</Button>
            </Box>
        </Center >
    )
}