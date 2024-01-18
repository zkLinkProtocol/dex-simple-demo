import { styled } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import Loading from 'components/Loading'
import { ActivationStatus, useActivationState } from 'connection/activate'
import { Connection } from 'connection/types'

const WalletItem = styled('button')`
  display: flex;
  align-items: center;
  width: 360px;
  height: 60px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  gap: 8px;
  padding: 0 20px;
  background: ${(props) => props.theme.color.bgLightGray};
  color: ${(props) => props.theme.color.text80};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  border: 1px solid transparent;
  transition: border 0.1s ease;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => props.theme.color.primary30};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`
const Icon = styled('img')`
  width: 32px;
  height: 32px;
  background: ${(props) => props.theme.color.text00};
  border-radius: 50%;
  margin-left: 8px;
  overflow: hidden;
`
const WalletName = styled('div')`
  flex: 1;
  text-align: left;
`
const Dot = styled('span')`
  display: inline-block;
  width: 6px;
  height: 6px;
  background: ${(props) => props.theme.color.notificationGreen02};
  border-radius: 50%;
`

export default function Option({ connection }: { connection: Connection }) {
  const { activationState, tryActivation } = useActivationState()
  const { chainId } = useWeb3React()
  const activate = () =>
    tryActivation(
      connection,
      () => {
        console.info('Wallet connect success.')
      },
      chainId
    )

  const isSomeOptionPending =
    activationState.status === ActivationStatus.PENDING
  const isCurrentOptionPending =
    isSomeOptionPending && activationState.connection.type === connection.type

  return (
    <WalletItem onClick={activate}>
      <WalletName>{connection.getName()}</WalletName>
      <Icon src={connection.getIcon?.(false)} alt={connection.getName()} />
      {isCurrentOptionPending && <Loading />}
    </WalletItem>
  )
}
