'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { destroyCookie } from 'nookies'
import { authenticate } from '../services/user/authenticate'
import { User } from '../schemas/userSchema'
import { Feature } from '../schemas/featureSchema'
import { Plan } from '../schemas/planSchema'
import { loadCurrentUserProfile } from '../services/user/loadCurrentUserProfile'
import { differenceInDays } from 'date-fns'

interface UserContextData {
  currentUser: User | undefined
  activeFeatures: Feature[]
  isAuthenticated: boolean
  daysToExpire: number
  login(username: string, password: string, redirect?: boolean): Promise<void>
  logout(path?: string): void
  refreshProfile(): Promise<void>
  updateCurrentUser: (user: User) => void
}

export const UserContext = createContext<UserContextData>({} as UserContextData)

export function useUserProvider(): UserContextData {
  const context = useContext(UserContext)

  return context
}

export function UserProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)
  const isAuthenticated = !!currentUser
  const [currentPlan, setCurrentPlan] = useState<Plan>()
  const [planExpirationDate, setPlanExpirationDate] = useState<
    Date | undefined
  >(undefined)

  const daysToExpire = useMemo(() => {
    if (!planExpirationDate) return 0

    return differenceInDays(planExpirationDate, new Date())
  }, [planExpirationDate])

  const activeFeatures: Feature[] = useMemo(() => {
    if (!currentUser || !currentPlan) return []

    const userFeatures = currentPlan.features.map(
      plan => plan.feature as Feature,
    )

    return userFeatures
  }, [currentUser, currentPlan])

  useEffect(() => {
    refreshProfile()
  }, [])

  const refreshProfile = async () => {
    const userProfile = await loadCurrentUserProfile()

    setCurrentUser(userProfile?.user)
    setCurrentPlan(userProfile?.plan)
    setPlanExpirationDate(userProfile?.planExpirationDate)
  }

  const updateCurrentUser = (user: User) => {
    setCurrentUser(user)
  }

  const login = async (email: string, password: string, redirect?: boolean) => {
    const authResult = await authenticate(email, password)

    if (authResult.user) {
      setCurrentUser(authResult.user)
      setCurrentPlan(authResult.plan)
      setPlanExpirationDate(authResult.planExpirationDate)

      if (redirect) router.push('/dashboard')
    }
  }

  const delay = (ms: number | undefined) =>
    new Promise(res => setTimeout(res, ms))

  const logout = async () => {
    setCurrentUser(undefined)
    destroyCookie(undefined, 'valya-auth', { path: '/' })

    await delay(2000)
    router.push('/')
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        activeFeatures,
        daysToExpire,
        isAuthenticated,
        login,
        logout,
        refreshProfile,
        updateCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
