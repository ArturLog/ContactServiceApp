import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material'
import CategoryIcon from '@mui/icons-material/Category'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BadgeIcon from '@mui/icons-material/Badge'
import KeyIcon from '@mui/icons-material/Key'

// Stworznie wiersza formularza do dodania nowego kontaktu
const AddContactField = ({ label, name, value, onChange, error, helperText, icon, type = 'text' }) => {
    // Tworzenie mapowania nazwa ikony -> komponent ikony
    const iconMap = {
        category: <CategoryIcon />,
        phone: <PhoneIcon />,
        name: <BadgeIcon />,
        surname: <BadgeIcon />,
        email: <EmailIcon />,
        birthDate: <CalendarMonthIcon />,
        password: <KeyIcon />
        // Dodaj inne nazwy ikon i odpowiadające im komponenty ikon
    }

    // Sprawdzanie, czy nazwa ikony znajduje się w mapowaniu
    const selectedIcon = iconMap[icon] || <CategoryIcon />

    return (
        <ListItemButton sx={{ pl: 4, minWidth: '45%' }}>
            <ListItemIcon>{selectedIcon}</ListItemIcon>
            <ListItemText primary={`${label}`} />
            <TextField
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                variant="outlined"
                type={type}
                {...(helperText && { error: error, helperText: helperText })}
            />
        </ListItemButton>
    )
}

export default AddContactField
