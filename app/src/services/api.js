import axios from 'axios'

import {HTTP_API_URL} from '../constants'

export async function getUsers () {
  const res = await axios.get(`${HTTP_API_URL}/users`)
  return res.data.users
}

export async function login ({ userId, password }) {
  try {
    await axios.post(`${HTTP_API_URL}/login`, { userId, password }, { withCredentials: true })
    return true
  } catch (err) {
    if (err.response) return false
    else throw err
  }
}

export async function isLoggedIn () {
  const res = await axios.get(`${HTTP_API_URL}/logged-in`, { withCredentials: true })
  return res.data
}

export async function logout () {
  try {
    await axios.post(`${HTTP_API_URL}/logout`, null, { withCredentials: true })
    return true
  } catch (err) {
    if (err.response) return false
    else throw err
  }
}
