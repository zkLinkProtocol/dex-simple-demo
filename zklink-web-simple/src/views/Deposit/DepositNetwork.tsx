import { Button, Stack, styled, Tooltip } from '@mui/material'
import { memo } from 'react'
import {
  useCurrentNetwork,
  useSupportChains,
  useSwitchNetwork,
} from 'store/app/hooks'

const DepositNetworkWrap = styled(Stack)`
  flex-direction: row;
  flex-flow: wrap;
  gap: 8px;
  padding: 8px 14px;
  background-color: ${(props) => props.theme.color.bg};
  border-radius: 4px;
`
const NetworkItem = styled(Button)`
  flex-direction: row;
  align-items: center;
  min-width: 0;
  padding: 6px;
  transition: background-color 0.2s ease;
  border-radius: 6px;
  box-sizing: border-box;
  border: 2px solid transparent;

  img {
    vertical-align: top;
  }

  &.active,
  &:hover {
    background-color: ${(props) => props.theme.color.bgLightGray};
    cursor: pointer;
  }

  &.active {
    border: 2px solid rgba(3, 212, 152, 0.5);
  }
`
const NetworkIcon = styled('img')`
  width: 32px;
  height: 32px;
  border-radius: 6px;
`
export const DepositNetwork = memo(() => {
  const supportChains = useSupportChains()
  const currentNetwork = useCurrentNetwork()
  const switchNetwork = useSwitchNetwork()

  return (
    <DepositNetworkWrap>
      {supportChains.map((v) => {
        return (
          <Tooltip
            key={v.layerOneChainId}
            title={v.name}
            enterDelay={100}
            leaveDelay={0}
            TransitionProps={{ timeout: 0 }}>
            <NetworkItem
              className={
                Number(currentNetwork.layerOneChainId) ===
                Number(v.layerOneChainId)
                  ? 'active'
                  : undefined
              }
              onClick={() => {
                switchNetwork(v.layerOneChainId)
              }}>
              <NetworkIcon src={v.iconUrl} />
            </NetworkItem>
          </Tooltip>
        )
      })}
    </DepositNetworkWrap>
  )
})
