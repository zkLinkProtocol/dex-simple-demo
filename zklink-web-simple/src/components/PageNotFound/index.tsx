import { styled } from '@mui/material'
import Iconfont from 'components/Iconfont'
import SimpleHead from 'components/PageNotFound/SimpleHead'
import {
  DISCORD_LINK,
  MEDIUM_LINK,
  TELEGRAM_LINK,
  TWITTER_LINK,
} from 'config/community'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FlexBetween, FlexColumn } from 'styles'

const Wrap = styled(FlexColumn)`
  width: 100vw;
  height: 100vh;
`

const Head = styled(FlexBetween)`
  width: 100%;
  height: 64px;
  padding: 0 22px;
  align-items: center;
  > svg {
    width: 116px;
    height: 36px;
  }
`

const Body = styled(FlexColumn)`
  flex: 1;
  justify-content: center;
  align-items: center;
  p {
    margin: 0;
    padding: 0;
  }
  .title {
    font-weight: 400;
    font-size: 82px;
    //line-height: 20px;
    color: ${(props) => props.theme.color.text100};
  }
  .sub {
    font-weight: 700;
    font-size: 24px;
    //line-height: 20px;
    color: ${(props) => props.theme.color.text90};
    margin-bottom: 40px;
    margin-top: 45px;
  }
  .link {
    border: 1px solid #a0ee09;
    border-radius: 6px;
    font-weight: 400;
    font-size: 16px;
    //line-height: 24px;
    color: ${(props) => props.theme.color.primary30};
    padding: 6px 8px;
  }
  ul {
    display: flex;
    width: 190px;
    margin: 18px auto;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0;
    //margin: 0;
  }
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: ${(props) => props.theme.color.text10};
    border-radius: 4px;
    color: ${(props) => props.theme.color.text40};
    //cursor: pointer;
  }
`

const list = [
  {
    icon: 'icon-Twitter',
    link: TWITTER_LINK,
  },
  {
    icon: 'icon-Discord1',
    link: DISCORD_LINK,
  },
  {
    icon: 'icon-Telegram',
    link: TELEGRAM_LINK,
  },
  {
    icon: 'icon-Medium',
    link: MEDIUM_LINK,
  },
]
export const PageNotFound = memo(() => {
  return (
    <Wrap>
      <SimpleHead></SimpleHead>
      <Body>
        <p className={'title'}>OOPS!</p>
        <p className={'sub'}>Error 404: Page Not Found</p>
        <Link to="/" className={'link'}>
          GO TO HOMEPAGE
        </Link>
        <ul>
          {list.map((item, index: number) => {
            return (
              <a href={item.link} target={'_black'}>
                <li key={index}>
                  <Iconfont name={item.icon} size={20}></Iconfont>
                </li>
              </a>
            )
          })}
        </ul>
      </Body>
    </Wrap>
  )
})
