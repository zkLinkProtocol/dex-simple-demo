import i18n from 'i18n'
import { memo, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useDepositModalOption } from 'store/deposit/hook'
import { DepositModalOption } from 'store/deposit/types'
import { MainWrap } from 'views/Main/styles'
import { useModal } from '../../store/app/hooks'
import { DepositSelectAssets } from './DepositContent'

export const Deposit = memo(() => {
  const dispatch = useDispatch()
  const [titleName, setTitleName] = useState<string>('Deposit')
  const modalOption = useDepositModalOption()
  const modal = useModal('deposit')

  useEffect(() => {
    if (modalOption === DepositModalOption.SelectOption) {
      setTitleName('Deposit')
    } else if (modalOption === DepositModalOption.SelectAssets) {
      setTitleName(
        i18n.t('deposit-option-1-tile', {
          defaultValue: 'Transfer crypto from personal wallet',
        })
      )
    } else if (modalOption === DepositModalOption.Qrcode) {
      setTitleName(
        i18n.t('deposit-option-2-tile', {
          defaultValue: 'Transfer crypto from mobile wallet',
        })
      )
    }
  }, [modalOption])

  return (
    <MainWrap>
      <DepositSelectAssets />
    </MainWrap>
  )
})
