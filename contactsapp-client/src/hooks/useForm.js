import { useState } from 'react'

// Funkcja do stworzenia zmiennych do podstawowej obslugi formularza
// getFreshModelObject - model obiektu typu
// nazwa_zmiennej: wartość
export default function useForm(getFreshModelObject) {

    const [values, setValues] = useState(getFreshModelObject())
    const [errors, setErrors] = useState({})

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    }
}