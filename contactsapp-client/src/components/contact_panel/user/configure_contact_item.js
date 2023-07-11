import React, { useEffect, useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../../../api'
import { Button, TextField } from '@mui/material'
import useForm from '../../../hooks/useForm'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CategoryIcon from '@mui/icons-material/Category'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddContactField from './add_contact_field'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import bcrypt from 'bcryptjs'

// Do stworzenia modelu kontaktu
const getContactModel = () => ({
    name: '',
    surname: '',
    email: '',
    password: '',
    category: '',
    birthDate: '',
    phoneNumber: ''
})

// Do stworzenia modelu kategorii
const getCategoryModel = () => ({
    category: '',
    subcategory: ''
})

// Parametry do wywołania
export const CONFIGURATIONS = {
    add: false,
    modify: true
}

// Tworzenie panelu z kontaktami i mozliwosciami usuwania/edytowania/dodawania
export default function ConfigureContactItem({ modify, con }) {
    const [category, setCategory] = useState([])
    const [serverError, setServerError] = useState()
    const [refresh, setRefresh] = useState(false)
    const [reloadValues, setReloadValues] = useState(true)

    // Pobranie kategorii
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.category)
            .fetch()
            .then(res => {
                setCategory(res.data)
            })
            .catch(err => { console.log(err) })
    }, [])

    // Zmienne do obsługi i pobierania wartości formularza dodawania nowej kategorii
    const [catValues, catSetValues] = useState(getCategoryModel())
    const catHandleInputChange = e => {
        const { name, value } = e.target
        catSetValues({
            ...catValues,
            [name]: value
        })
    }

    // Przypisanie poczatkowych wartosci zmiennych values i catValues
    const setEmptyValuesContactsCategory = () => {
        if (modify) {
            values.name = con.name === null ? '' : con.name
            values.surname = con.surname === null ? '' : con.surname
            values.email = con.email === null ? '' : con.email
            values.password = ''
            values.category = con.category === null ? '' : con.category
            values.birthDate = con.birthDate === null ? '' : con.birthDate
            values.phoneNumber = con.phoneNumber === null ? '' : con.phoneNumber
            const foundCategory = category.find(category => category.name === con.category)
            if (foundCategory) {
                catValues.category = foundCategory
            } else if (con.category !== null) {
                catValues.category = con.category === null ? '' : con.category
                catValues.subcategory = con.category === null ? '' : con.category
            }
        } else {
            values.name = ''
            values.surname = ''
            values.email = ''
            values.password = ''
            values.category = ''
            values.birthDate = ''
            values.phoneNumber = ''
            catValues.category = ''
            catValues.subcategory = ''
        }

    }
    // Stworzenie zmiennych do obslugi formularza dodawania nowego kontaktu
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    } = useForm(getContactModel)


    useEffect(() => {
        if (reloadValues) {
            setEmptyValuesContactsCategory()
            setReloadValues(!reloadValues)
        }
    })

    // Sprawdzam poprawność wypełnionego formularza dodania nowego kontaktu
    const validateForm = (values) => {
        const passwordRules = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/
        let temp = {}
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Email is not valid."
        temp.name = values.name !== "" ? "" : "Name is required."
        temp.surname = values.surname !== "" ? "" : "Surname is required."
        temp.phoneNumber = values.phoneNumber === "" || (/^\d+$/).test(values.phoneNumber) ? "" : "Phone number is not valid."
        if (con === null || values.password !== '')
            temp.password = passwordRules.test(values.password) ? "" : "8-20, minimal 1: special, capital and number"
        setErrors(temp)
        return Object.values(temp).every(x => x === "")
    }

    // Dodawanie wybranej kategorii
    const addCategory = (values) => {
        if (catValues.category.name === 'Inny' ||
            (Array.isArray(catValues.category.subCategories)
                && catValues.category.subCategories.length !== 0)) {
            values.category = catValues.subcategory
        } else {
            values.category = catValues.category
        }
    }

    // Obsluga danych do wysłania
    const sendContactClick = (values) => {
        // Dodanie kategorii
        addCategory(values)
        if (validateForm(values)) {
            if (values.birthDate === '')
                values.birthDate = (new Date(0, 0, 0)).toISOString().split('T')[0]
            if (modify) {
                modifyContactClick(values)
            } else {
                addContactClick(values)
            }
        }
    }
    // Wysłanie danych do modyfikacji
    const modifyContactClick = (values) => {
        if (values.password !== '') {
            const hashPassword = bcrypt.hashSync(values.password, 10)
            values.password = hashPassword
        }
        createAPIEndpoint(ENDPOINTS.contact)
            .put(con.id, values)
            .then(res => {
                if (res.status === 200) {
                    setEmptyValuesContactsCategory()
                    setRefresh(!refresh)
                    setServerError('Pomyślnie zmodyfikowano')
                    setReloadValues(!reloadValues)
                }
                else {
                    throw new Error(res.statusText)
                }
            })
            .catch(error => {
                values.password = ''
                setRefresh(!refresh)
                setServerError('Niepoprawnie wypełniony formularz')
                console.error(error)
            })
    }

    // Dodanie kontaktu (wywolanie przez kliknięcie)
    const addContactClick = (values) => {
        // Szyfrowanie hasla
        const hashPassword = bcrypt.hashSync(values.password, 10)
        values.password = hashPassword
        createAPIEndpoint(ENDPOINTS.contact)
            .postAdd(values)
            .then(res => {
                if (res.status === 200) {
                    setEmptyValuesContactsCategory()
                    setRefresh(!refresh)
                    setServerError('Pomyślnie dodano nowy kontakt')
                    setReloadValues(!reloadValues)
                }
                else {
                    throw new Error(res.statusText)
                }
            })
            .catch(error => {
                values.password = ''
                setRefresh(!refresh)
                setServerError('Niepoprawnie wypełniony formularz')
                console.error(error)
            })
    }

    return (
        < List component="div" disablePadding >
            <form noValidate autoComplete="off" onSubmit={(event) => {
                event.preventDefault()
                sendContactClick(values)
            }}>
                <AddContactField
                    name='name'
                    label='Name'
                    value={values.name}
                    onChange={handleInputChange}
                    error={true}
                    helperText={errors.name}
                    icon='name' />
                <AddContactField
                    name='surname'
                    label='Surname'
                    value={values.surname}
                    onChange={handleInputChange}
                    error={true}
                    helperText={errors.surname}
                    icon='surname' />
                <AddContactField
                    name='email'
                    label='Email'
                    value={values.email}
                    onChange={handleInputChange}
                    error={true}
                    helperText={errors.email}
                    icon='email' />
                <ListItemButton sx={{ pl: 4 }}>
                    {// Ustawiam podkategorie na '', zeby po zmianie z kategorii Inny na jakąkowliek inną nie wyjść poza tablicę
                        (Array.isArray(catValues.category.subCategories)
                            && catValues.category.subCategories.length !== 0) || catValues.category.name === 'Inny' ?
                            null : catValues.subcategory = ''}
                    <ListItemIcon><CategoryIcon /></ListItemIcon>
                    <ListItemText primary={`Category: `} />
                    <FormControl name='categorySelect' sx={{
                        minWidth: (Array.isArray(catValues.category.subCategories)
                            && catValues.category.subCategories.length !== 0) || catValues.category.name === 'Inny' ?
                            '20%' : '40%'
                    }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={catValues.category}
                            label="Category"
                            onChange={catHandleInputChange}
                            variant="outlined"
                        >
                            {category.map((cat, i) => (
                                cat.isMainCategory === 1 ?
                                    <MenuItem key={i} value={cat}>{cat.name}</MenuItem> : null
                            ))}
                        </Select>
                    </FormControl>
                    {
                        Array.isArray(catValues.category.subCategories)
                            && catValues.category.subCategories.length !== 0 ?
                            <FormControl sx={{ minWidth: '20%' }}>
                                <InputLabel>Subcategory</InputLabel>
                                <Select
                                    name="subcategory"
                                    value={catValues.subcategory}
                                    label="Subcategory"
                                    onChange={catHandleInputChange}
                                    variant="outlined"
                                >
                                    {catValues.category.subCategories.map((cat, i) => (
                                        <MenuItem key={i} value={cat.name}>{cat.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            : null
                    }
                    {
                        catValues.category.name === 'Inny' ?
                            <TextField
                                sx={{ width: '20%' }}
                                label='Other'
                                name='subcategory'
                                value={catValues.subcategory}
                                onChange={catHandleInputChange}
                                variant="outlined"
                            />
                            : null
                    }
                </ListItemButton>
                <AddContactField
                    name='phoneNumber'
                    label='Phone'
                    value={values.phoneNumber}
                    onChange={handleInputChange}
                    error={true}
                    helperText={errors.phoneNumber}
                    icon='phone'
                    type='tel' />
                <AddContactField
                    name='birthDate'
                    label='Birth date'
                    value={values.birthDate}
                    onChange={handleInputChange}
                    error={false}
                    helperText={errors.birthDate}
                    icon='birthDate'
                    type='date' />
                <AddContactField name='password'
                    label='Password'
                    value={values.password}
                    onChange={handleInputChange}
                    error={true}
                    helperText={errors.password}
                    icon='password'
                    type='password' />
                <Button type='submit' sx=
                    {{
                        pl: 4,
                        color: 'green',
                        width: '100%',
                        textAlign: 'left',
                        bgcolor: 'background.paper'
                    }}>
                    <ListItemIcon>
                        <AddCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={!modify ? 'Add' : 'Edit'} />
                </Button>
                <ListItem>
                    <ListItemText sx={{ color: 'red' }} primary={serverError} />
                </ListItem>
            </form>
        </List >
    )
}