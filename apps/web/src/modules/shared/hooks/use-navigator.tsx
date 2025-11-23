import { useEffect, useState } from 'react'

export function useNavigator() {
  const [OS, setOS] = useState<'windows' | 'mac' | 'linux'>('windows')

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.includes('mac')) {
      return setOS('mac')
    }

    if (userAgent.includes('linux')) {
      return setOS('linux')
    }

    setOS('windows')
  }, [])

  return { OS }
}
