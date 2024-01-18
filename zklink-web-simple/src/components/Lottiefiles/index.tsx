import { FC, memo } from 'react'
import Lottie from 'react-lottie'

interface LottieFilesType {
  animationData: any
  width: number
  height: number
}
export const LottieFiles: FC<LottieFilesType> = memo(
  ({ animationData, width, height }) => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
    }
    return <Lottie options={defaultOptions} height={height} width={width} />
  }
)
