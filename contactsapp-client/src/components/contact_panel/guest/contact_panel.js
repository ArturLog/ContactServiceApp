import React, { useEffect, useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../../../api'
import { Typography } from '@mui/material'
import Center from '../../center'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ShowContact from '../show_contact'

// Stworzenie panelu z kontaktami
export default function ContactPanel() {
    const [contact, setContact] = useState([])

    // pobranie kontaków
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.contact)
            .fetch()
            .then(res => {
                setContact(res.data)
            })
            .catch(err => { console.log(err) })
    }, [])

    // Obsluga pokazywania szegółów kontaktów
    const [openStates, setOpenStates] = useState(new Array(contact.length).fill(false))
    const handleClick = (index) => {
        const newOpenStates = [...openStates]
        newOpenStates[index] = !newOpenStates[index]
        setOpenStates(newOpenStates)
    }

    return (
        <Center>
            <Typography variant="h3" sx={{ my: 3 }}>
                Contacts
            </Typography>
            {contact.map((con, index) => (
                <List
                    key={con.id}
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader">
                    <ListItemButton onClick={() => handleClick(index)}>
                        <ListItemIcon>
                            <AccountBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary={`${con.name} ${con.surname}`} />
                        {openStates[index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <ShowContact con={con} hide={Boolean(openStates[index])} />
                </List>
            ))}
        </Center>
    )
}