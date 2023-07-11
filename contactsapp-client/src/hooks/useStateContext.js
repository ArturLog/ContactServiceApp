import React, { createContext, useContext, useState, useEffect } from 'react'

// Tworzenie kontekstu
export const stateContext = createContext()

// Funkcja pomocnicza do pobrania świeżego kontekstu z localStorage
const getFreshContext = () => {
    if (localStorage.getItem('context') === null)
        localStorage.setItem('context', JSON.stringify({
            userId: 0,
            userName: 'user',
        }))
    return JSON.parse(localStorage.getItem('context'))
}

// Hook dostępu do lokalnego kontekstu
export default function useStateContext() {
    const { context, setContext } = useContext(stateContext)
    return {
        context,
        setContext: obj => {
            setContext({ ...context, ...obj })
        },
        resetContext: () => {
            localStorage.removeItem('context')
            setContext(getFreshContext())
        }
    }
}

// Komponent dostarczający lokalny kontekst
export function ContextProvider({ children }) {
    const [context, setContext] = useState(getFreshContext())

    useEffect(() => {
        localStorage.setItem('context', JSON.stringify(context))
    }, [context])

    return (
        <stateContext.Provider value={{ context, setContext }}>
            {children}
        </stateContext.Provider>
    )
}