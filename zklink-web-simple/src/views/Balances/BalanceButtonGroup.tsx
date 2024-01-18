import { Button, Stack, styled } from '@mui/material'
import i18n from 'i18n'
import { memo } from 'react'
import { useNavigate } from 'react-router'

const StyledButton = styled(Button)`
  font-size: 14px;
  .iconfont {
    margin-right: 4px;
  }
`

const DepositButton = styled(StyledButton)`
  flex: 1;
  border-width: 2px !important;

  .iconfont {
    color: ${(props) => props.theme.palette.primary.main};
    transition: color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  &:active {
    .iconfont {
      color: ${(props) => props.theme.palette.primary.main};
    }
  }
  &:hover {
    .iconfont {
      // color: ${(props) => props.theme.color.text00};
      color: rgba(20, 26, 30, 1);
    }
  }
`

export const BalanceButtonGroup = memo(() => {
  const navigate = useNavigate()
  // const accountId = useAccountId()
  // const isInactivated = useIsInactivated()

  // const renderGuideButton = () => {
  //   if (!accountId) {
  //     return <OpenMyAccountButton />
  //   }
  //   if (isInactivated) {
  //     return <ActivateAccountButton />
  //   }
  //   return null
  // }

  return (
    <Stack sx={{ padding: '0 0 24px' }} spacing={1}>
      <Stack direction="row" spacing={3}>
        <DepositButton
          variant="outlined"
          onClick={() => {
            navigate('/deposit')
          }}>
          {i18n.t('balances-deposit', { defaultValue: 'Deposit' })}
        </DepositButton>
        <DepositButton
          variant="outlined"
          onClick={() => {
            navigate('/withdraw')
          }}>
          {i18n.t('balances-withdraw', { defaultValue: 'Withdraw' })}
        </DepositButton>
      </Stack>
      {/* {renderGuideButton()} */}
    </Stack>
  )
})
