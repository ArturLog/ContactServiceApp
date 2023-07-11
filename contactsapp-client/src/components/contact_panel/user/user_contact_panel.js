import React, { useEffect, useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../../../api'
import { Button, Typography } from '@mui/material'
import Center from '../../center'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import AddIcon from '@mui/icons-material/Add'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import useStateContext from '../../../hooks/useStateContext'
import ConfigureContactItem, { CONFIGURATIONS } from './configure_contact_item'
import ShowContact from '../show_contact'

// Tworzenie panelu z kontaktami i mozliwosciami usuwania/edytowania/dodawania
export default function UserContactPanel() {
    const [contact, setContact] = useState([])
    const { context } = useStateContext()
    const [isEditingContact, setIsEditingContact] = useState(false)

    // Obsluga pokazywania szegółów kontaktów
    const [openStates, setOpenStates] = useState(new Array(contact.length).fill(false))
    const handleClick = (index) => {
        const newOpenStates = [...openStates]
        newOpenStates[index] = !newOpenStates[index]
        setOpenStates(newOpenStates)
    }


    // Pobranie kontaktów
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.contact)
            .fetch()
            .then(res => {
                setContact(res.data)
            })
            .catch(err => { console.log(err) })
    }, [])


    // Usuwanie kontaktu po ID po stronie klienta
    const removeContactById = (id) => {
        const index = contact.findIndex((item) => item.id === id)
        if (index !== -1) {
            const updatedContacts = [...contact]
            updatedContacts.splice(index, 1)
            setContact(updatedContacts)
        }
    }

    // Usuwanie kontaktu po ID z bazy danych (wywolywanie poprzez kliknięcie)
    const deleteContactClick = (id) => {
        createAPIEndpoint(ENDPOINTS.contact)
            .delete(id)
            .then(() => {
                removeContactById(id)
            })
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
                        <Button onClick={(e) => {
                            e.stopPropagation()
                            setIsEditingContact(!isEditingContact)
                        }}>Edit</Button>
                        {con.id !== context.userId ? (
                            <Button
                                sx={{ color: 'red' }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deleteContactClick(con.id)
                                }}>X</Button>
                        ) : null}
                        {openStates[index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    {isEditingContact ?
                        <Collapse in={openStates[index]} timeout="auto" unmountOnExit>
                            <ConfigureContactItem modify={CONFIGURATIONS.modify} con={con} />
                        </Collapse> :
                        <ShowContact con={con} hide={Boolean(openStates[index])} />
                    }
                </List>
            ))}
            <List
                key={0}
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader">
                <ListItemButton onClick={() => handleClick(contact.length)}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary='New contact' />
                    {openStates[contact.length] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openStates[contact.length]} timeout="auto" unmountOnExit>
                    <ConfigureContactItem modify={CONFIGURATIONS.add} />
                </Collapse>
            </List >
        </Center >
    )
}