import { GetIdTokenClaimsOptions, IdToken } from '@auth0/auth0-react'
import axios from 'axios'

export async function getIdBearerToken(
  getIdTokenClaims: (options?: GetIdTokenClaimsOptions | undefined) => Promise<IdToken | undefined>
): Promise<string> {
  const claims = await getIdTokenClaims()
  const token = claims?.__raw
  return `Bearer ${token}`
}

export async function get(
  url: string,
  getIdTokenClaims?: (options?: GetIdTokenClaimsOptions | undefined) => Promise<IdToken | undefined>,
  params?: { [k: string]: string }
): Promise<void> {
  getData(url, getIdTokenClaims, params)
}

export async function getData<T>(
  url: string,
  getIdTokenClaims?: (options?: GetIdTokenClaimsOptions | undefined) => Promise<IdToken | undefined>,
  params?: { [k: string]: string }
): Promise<T | null> {
  try {
    let headers
    if (getIdTokenClaims != undefined) {
      headers = { authorization: await getIdBearerToken(getIdTokenClaims) }
    }
    const result = await axios.get(url, { headers, params })
    return result.data as T
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function post<T, R>(
  url: string,
  data: T,
  getIdTokenClaims?: (options?: GetIdTokenClaimsOptions | undefined) => Promise<IdToken | undefined>,
  params?: { [k: string]: string }
): Promise<R | null> {
  try {
    let headers
    if (getIdTokenClaims != undefined) {
      headers = { authorization: await getIdBearerToken(getIdTokenClaims) }
    }
    const result = await axios.post<R>(url, data, { headers, params })
    return result.data
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function httpDelete(
  url: string,
  getIdTokenClaims?: (options?: GetIdTokenClaimsOptions | undefined) => Promise<IdToken | undefined>,
  params?: { [k: string]: string }
): Promise<boolean> {
  try {
    let headers
    if (getIdTokenClaims != undefined) {
      headers = { authorization: await getIdBearerToken(getIdTokenClaims) }
    }
    await axios.delete(url, { headers, params })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
