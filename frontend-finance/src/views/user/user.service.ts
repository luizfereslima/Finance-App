import { api } from '@/utils/api'

export interface UserProfile {
  name: string
  email: string
  initials: string
  memberSince: string
}

interface ApiUser {
  name: string
  email: string
  createdAt: string
  memberSince?: string
}

interface UserResponse {
  data: ApiUser
}

export const USER_PROFILE_QUERY_KEY = ['user', 'profile'] as const

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export async function getProfile(): Promise<UserProfile> {
  const response = await api.get<ApiUser | UserResponse>('users/me')
  const user = 'data' in response.data ? response.data.data : response.data

  return {
    name: user.name,
    email: user.email,
    initials: getInitials(user.name),
    memberSince: user.memberSince ?? user.createdAt.slice(0, 10),
  }
}

export async function logout(): Promise<void> {
  await api.post('auth/logout')
}

export function clearClientCookies(): void {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim()

    if (name) {
      document.cookie = `${name}=; Max-Age=0; path=/`
    }
  })
}
