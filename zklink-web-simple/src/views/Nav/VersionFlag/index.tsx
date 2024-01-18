import { Fade, styled } from '@mui/material'
import { memo, useRef, useState } from 'react'
import { FlexBetween, FlexCenter } from 'styles'
import { useOnClickOutside } from 'usehooks-ts'
import { Popup } from 'views/Withdraw/style'
import { ReactComponent as SvgCurrentChainFlag } from './currentVersion.svg'

const Wrap = styled('div')`
  position: relative;
  margin-left: -6px;
  margin-top: -16px;
`

const CommonPopup = styled(Popup)`
  width: 148px;
  padding: 2px 0;
  margin-top: 6px;
  border: 1px solid ${(props) => props.theme.color.text20};
  background: ${(props) => props.theme.color.bgGray};
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.06))
    drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
`

const Flag = styled(FlexCenter)`
  height: 18px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 1;
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  border-radius: 2px;
  white-space: nowrap;
  cursor: pointer;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`

const PopupList = styled('div')``

const VersionItem = styled(FlexBetween)`
  width: 146px;
  height: 36px;
  padding: 0 12px;
  cursor: pointer;
  &.active,
  &:hover {
    background: ${(props) => props.theme.color.networkSelectionBgColor};
  }
`

export enum NEXUS_VERSION {
  Mainnet = 'Mainnet',
  Testnet = 'Testnet',
}

export const VersionFlag = memo(() => {
  const [isIn, setIsIn] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useOnClickOutside(wrap, () => setIsIn(false))

  const goMainnet = () => {
    location.href = ''
  }

  return (
    <Wrap ref={wrap}>
      {/* <Flag onClick={() => setIsIn(!isIn)}> */}
      <Fade in={isIn} timeout={200}>
        <CommonPopup>
          <PopupList>
            <VersionItem onClick={() => goMainnet()}>
              <div>Mainnet</div>
            </VersionItem>
            <VersionItem className="active">
              <div>Testnet 3.0</div>
              <SvgCurrentChainFlag />
            </VersionItem>
          </PopupList>
        </CommonPopup>
      </Fade>
    </Wrap>
  )
})
