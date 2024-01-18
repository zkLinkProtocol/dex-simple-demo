import { CircularProgress, SxProps } from '@mui/material'
import { CircularProgressProps } from '@mui/material/CircularProgress/CircularProgress'
import { FC, memo } from 'react'

const Loading: FC<{
  sx?: SxProps
  size?: number
  thickness?: number
  color?: CircularProgressProps['color']
}> = memo(({ sx, size = 14, thickness = 4, color = 'inherit' }) => {
  return (
    <CircularProgress sx={sx} color={color} size={size} thickness={thickness} />
  )
})

export default Loading
