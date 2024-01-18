import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { updateIsDepositMobilePage } from 'store/deposit/actions'
import { useEffectOnce } from 'usehooks-ts'
import { MainWrap } from 'views/Main/styles'
import { DepositSelectAssets } from './DepositContent'

export const DepositMobile = memo(() => {
  const dispatch = useDispatch()

  // useEffectOnce(() => {
  //   setRecentConnectionMeta(undefined)
  // })

  useEffectOnce(() => {
    dispatch(updateIsDepositMobilePage(true))

    return () => {
      dispatch(updateIsDepositMobilePage(false))
    }
  })

  return (
    <MainWrap>
      <DepositSelectAssets />
    </MainWrap>
  )
})
