import axios from 'axios'

// Adres REST API
export const BASE_URL = 'https://localhost:7292/'

// Możliwości do odwołania się
export const ENDPOINTS = {
    contact: 'contacts',
    category: 'categories'
}

// Zwraca poprawny URL do każdej z możliwości REST API
export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + 'api/' + endpoint + '/'
    return {
        fetch: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        postLogin: newRecord => axios.post(url + 'Login', newRecord),
        postAdd: newRecord => axios.post((url + 'Add'), newRecord),
        postLogout: () => axios.post(url + 'Logout'),
        postUser: () => axios.post(url + 'User'),
        put: (id, updatedRecord) => axios.put(url + id, updatedRecord),
        delete: id => axios.delete(url + id),
    }
}