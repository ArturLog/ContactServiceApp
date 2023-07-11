import React from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Center from '../../center'
import useForm from '../../../hooks/useForm'
import { createAPIEndpoint } from '../../../api'
import { ENDPOINTS } from '../../../api'
import useStateContext from '../../../hooks/useStateContext'
import { useState } from 'react'
import bcrypt from 'bcryptjs'

//  Do stworzenia modelu logowania
const getLoginModel = () => ({
    email: '',
    password: ''
})

// Tworzenie formularza logowania
export default function Login() {
    const [serverError, setServerError] = useState()
    const { context, setContext, resetContext } = useStateContext()

    // Stworzenie zmiennych do obslugi formularza logowania
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    } = useForm(getLoginModel)

    // Obsługa po naciśnięciu przycisku logowania
    const loginClick = e => {
        e.preventDefault()
        if (validate()) {
            const hashPassword = bcrypt.hashSync(values.password, 10)
            values.password = hashPassword
            createAPIEndpoint(ENDPOINTS.contact)
                .postLogin(values)
                .then(res => {
                    if (res.status === 200) {
                        if (bcrypt.compareSync(values.password, res.data.password)) {
                            values.password = ''
                            setServerError('Błąd w danych logowania')
                        }
                        else {
                            setServerError('Pomyślnie zalogowano')
                            setContext({
                                userId: res.data.id,
                                userName: res.data.name
                            })
                        }
                    } else {
                        throw new Error(res.statusText)
                    }

                })
                .catch(error => {
                    values.password = ''
                    setServerError('Niepoprawnie wypełniony formularz')
                    console.error(error)
                })
        }
    }

    // Sprawdzam poprawność wypełnionego formularza logowania
    const validate = () => {
        const passwordRules = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/
        let temp = {}
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Email is not valid."
        temp.password = passwordRules.test(values.password) ? "" : "8-20, minimal 1: special, capital and number"
        setErrors(temp)
        return Object.values(temp).every(x => x === "")
    }

    return (
        <Center>
            <Typography variant="h3" sx={{ my: 3 }}>
                Login/Register
            </Typography>
            <Box sx={{
                '& .MuiTextField-root': {
                    m: 1,
                    width: '80%'
                }
            }}>
                <form noValidate autoComplete="off" onSubmit={loginClick}>
                    <TextField
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        {...(errors.email && { error: true, helperText: errors.email })}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        value={values.password}
                        onChange={handleInputChange}
                        variant="outlined"
                        type="password"
                        {...(errors.password && { error: true, helperText: errors.password })}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ width: '80%' }}>Login</Button>
                </form>
                <h5>{serverError}</h5>
            </Box>
        </Center>
    )
}