import { Stack } from '@mui/material'
import Loading from 'components/Loading'
import { memo } from 'react'

export const SuspenseFallback = memo(() => {
  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      <Loading />
    </Stack>
  )
})
