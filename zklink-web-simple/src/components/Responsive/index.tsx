import useResize from 'hooks/useResize'
import { FC, ReactNode, memo } from 'react'

export const Responsive: FC<{
  children: ReactNode
  mobile: ReactNode
}> = memo(({ children = null, mobile = null }) => {
  const { isMobile } = useResize()
  return <>{isMobile ? mobile : children}</>
})
