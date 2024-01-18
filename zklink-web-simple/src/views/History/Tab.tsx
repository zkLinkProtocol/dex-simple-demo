import { MobileTab } from 'components/MobileTab'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { updateHistoryTabAction } from 'store/history/actions'
import { HistoryTitle, MobileHistoryTitle, TitleItem } from './style'
import { useNavigate, useParams } from 'react-router-dom'

export enum HistoryTabType {
  DashBoard,
  Deposit,
  Withdraw,
  Transfer,
  Orders,
  Trades,
  Convert
}

export const HistoryTabKeys = Object.keys(HistoryTabType).filter((v) =>
  isNaN(Number(v))
)
export const HistoryTab = memo(() => {
  const dispatch = useDispatch()
  const { type: tabType } = useParams<{ type: string }>()
  const currentTab =
    HistoryTabType[tabType as unknown as HistoryTabType] ??
    HistoryTabType.DashBoard

  const navigate = useNavigate()

  return (
    <>
      <HistoryTitle direction="row" spacing={0.5}>
        {HistoryTabKeys.map((item, index) => {
          return (
            <TitleItem
              className={+currentTab === index ? 'active' : ''}
              onClick={() => {
                dispatch(updateHistoryTabAction({ tab: index }))
                navigate(`/history/${item}`)
              }}
              key={item}
            >
              {item}
            </TitleItem>
          )
        })}
      </HistoryTitle>
      <MobileHistoryTitle direction="row">
        <MobileTab
          tabIndex={+currentTab}
          setTabIndex={(num, name) => {
            dispatch(updateHistoryTabAction({ tab: num }))
            navigate(`/history/${name}`)
          }}
          tabList={HistoryTabKeys}
        />
      </MobileHistoryTitle>
    </>
  )
})
