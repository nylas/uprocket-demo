import { NextApiRequest } from 'next'
import { NextRequest } from 'next/server'

export type CustomApiRequest = NextApiRequest & {
  accessToken?: string
}

export type CustomNextRequest = NextRequest & {
  accessToken?: string
}

export type UserData = {
  uid: string
  name: string
  email: string
  title: string
  picture: string
  website: string
  location: string
  timezone: string
  looking_for_work: boolean
  skills: string[]
  success_rate: number
  about: string
  config_id: string // default 30 min
  config_id_60: string
  grant_id: string
}

export type Contractor = Omit<UserData, 'grant_id' | 'config_id' | 'config_id_60'>

// Implement UserData but with 'skills' as a string instead of an array.-
export type TransformedUserData = Omit<UserData, 'skills'> & { skills: string }

export type Calendar = {
  description?: string
  grant_id?: string
  hex_color?: string
  hex_foreground_color?: string
  id?: string
  is_owned_by_user?: boolean
  /** @description If the calendar is primary. If unknown returns null. */
  is_primary?: boolean | null
  location?: string
  metadata?: {
    [key: string]: string
  }
  name?: string
  /** @example calendar */
  object?: string
  read_only?: boolean
  timezone?: string
}
