import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../Footer'
import { Nav } from '../Nav'

export const MainView = memo(() => {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
})
