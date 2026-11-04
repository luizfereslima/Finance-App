import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { clearOfflineApiCache } from '@/utils/offline-cache'
import {
  getProfile,
  clearClientCookies,
  logout as logoutUser,
  USER_PROFILE_QUERY_KEY,
  type UserProfile,
} from './user.service'

const emptyProfile: UserProfile = {
  name: '',
  email: '',
  initials: '',
  memberSince: '',
}

function formatMemberSince(value: string): string {
  if (!value) {
    return ''
  }

  const [year, month, day] = value.split('-')

  return `${day}/${month}/${year}`
}

export function useUserController() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const profileQuery = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
  const profile = computed(() => profileQuery.data.value ?? emptyProfile)

  const details = computed(() => [
    { label: 'Nome', value: profile.value.name },
    { label: 'E-mail', value: profile.value.email },
    { label: 'Membro desde', value: formatMemberSince(profile.value.memberSince) },
  ])

  async function logout(): Promise<void> {
    try {
      await logoutUser()
    } catch {
      // O redirecionamento e a limpeza local devem ocorrer mesmo sem resposta da API.
    } finally {
      clearClientCookies()
      await clearOfflineApiCache()
      queryClient.clear()

      toast.success('Sessão encerrada', {
        description: 'Você saiu da sua conta.',
      })

      await router.replace({ name: 'login' })
    }
  }

  return {
    profile,
    details,
    isProfileLoading: profileQuery.isPending,
    profileError: profileQuery.error,
    logout,
  }
}
