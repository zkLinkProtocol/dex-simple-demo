import { Stack, Typography, styled } from '@mui/material'
import { UserActionGuideButton } from 'components/Buttons/UserActionGuide'
import Iconfont from 'components/Iconfont'
import i18n from 'i18n'
import { FC, memo } from 'react'
import { FlexCenter } from 'styles'
import { MobileWrap } from 'styles/Media'

const Wrap = styled(FlexCenter)`
  flex-direction: column;
  /* background: ${(props) => props.theme.color.bgLightGray}; */
  height: 100%;
  p {
    font-weight: 400;
    line-height: 1.6;
    color: ${(props) => props.theme.color.text60};
    margin: 16px auto 20px;
    text-align: center;
  }

  .iconfont {
    color: ${(props) => props.theme.palette.primary.main};
  }
  svg path {
    fill: ${(props) => props.theme.palette.primary.main};
  }
`

export const ConnectWalletGuide: FC<{
  title?: string
  fontSize?: number
  responsive?: boolean // Show connect button only on mobile
}> = memo(
  ({ title = i18n.t('balances-tip'), fontSize = 12, responsive = false }) => {
    return (
      <Wrap>
        <Iconfont name="icon-a-Connectyourwallet" size={68} />
        <Typography fontSize={fontSize}>{title}</Typography>
        {responsive ? (
          <MobileWrap sx={{ width: 240 }}>
            <UserActionGuideButton />
          </MobileWrap>
        ) : (
          <Stack sx={{ width: 240 }}>
            <UserActionGuideButton />
          </Stack>
        )}
      </Wrap>
    )
  }
)
