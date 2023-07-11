import React from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import EmailIcon from '@mui/icons-material/Email'
import CategoryIcon from '@mui/icons-material/Category'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

// Tworzenie listy szczegolowej kontaktu
export default function ShowContact({ con, hide }) {
    return (
        <Collapse in={hide} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Email: ${con.email}`} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Category: ${con.category}`} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Phone number: ${con.phoneNumber}`} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Birth date: ${new Date(con.birthDate).toLocaleDateString('en-US')}`} />
                </ListItemButton>
            </List>
        </Collapse>
    )
}