import { styled } from '@mui/material'
import { ChangeEvent, FC, memo } from 'react'
import { inputNumberExp } from 'utils/number'

export const Input = styled('input')`
  flex: 1;
  width: 100%;
  height: 100%;
  font-size: 16px;
  outline: none;
  border: none;
  appearance: none;
  background: none;
  text-align: right;
  color: ${(props) => props.theme.color.text90}!important;
  ::-webkit-input-placeholder {
    color: ${(props) => props.theme.color.text40};
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
`

const InputAmount: FC<{
  color?: string
  value: string
  disabled?: boolean
  onInput?(amount: string): void
  onFocus?(): void
  onBlur?(): void
  placeholder?: string
  as?: any
}> = memo(
  ({ color, value, disabled, onInput, onFocus, onBlur, placeholder, as }) => {
    let Wrapper = as || Input
    return (
      <Wrapper
        color={color}
        type={'text'}
        disabled={disabled}
        onInput={(event: ChangeEvent<HTMLInputElement>) => {
          const v = inputNumberExp(event.currentTarget.value)
          onInput && onInput(v)
        }}
        onFocus={() => {
          onFocus && onFocus()
        }}
        onBlur={() => {
          onBlur && onBlur()
        }}
        value={value}
        placeholder={placeholder}
      />
    )
  }
)

export default InputAmount
