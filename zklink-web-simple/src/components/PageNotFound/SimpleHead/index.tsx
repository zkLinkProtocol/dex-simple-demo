import { styled } from '@mui/material'
import { ReactComponent as DarkLogo } from 'assets/nav/dark-logo.svg'
import { ReactComponent as LightLogo } from 'assets/nav/light-logo.svg'
import { memo } from 'react'
import { FlexBetween, MuiThemeType } from 'styles'
import { useCurrentThemeType } from '../../../store/settings/hooks'
const Head = styled(FlexBetween)`
  width: 100%;
  height: 64px;
  padding: 0 22px;
  align-items: center;
  background: ${(props) => props.theme.color.bg};
  svg {
    width: 116px;
    height: 36px;
  }
`

const SimpleHead = memo(() => {
  const theme = useCurrentThemeType()

  return (
    <Head>
      <a href="/">
        {theme === MuiThemeType.dark ? (
          <>
            <DarkLogo />
          </>
        ) : (
          <>
            <LightLogo />
          </>
        )}
      </a>
    </Head>
  )
})
export default SimpleHead
