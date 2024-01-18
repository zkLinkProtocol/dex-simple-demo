import styled from '@emotion/styled'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { FC, ReactNode, memo } from 'react'

export const FormItemHeight = '32px'
const FilterSelectItem = styled(FormControl)`
  height: ${FormItemHeight};
  flex: 1;
  .MuiInputBase-root {
    height: ${FormItemHeight};
    width: 160px;
    ${(props: any) => props.theme?.breakpoints?.down('md')} {
      width: 100%;
    }
    .MuiSelect-select {
      padding-top: 0;
      padding-bottom: 0;
      font-size: 12px;
    }
  }
  .MuiFormLabel-root {
    line-height: ${FormItemHeight};
    font-size: 12px;
    transform: translate(14px, 0px) scale(1);
    pointer-events: none;
    &.Mui-focused,
    &.MuiFormLabel-filled {
      transform: translate(14px, -12px) scale(1);
    }
  }
  em {
    display: none;
  }
`

export const FilterSelect: FC<{
  id?: string
  label?: string
  value?: any
  onChange?: (arg0: any) => void
  children?: ReactNode
  clear?: boolean
}> = memo(
  ({
    id = `id-${Date.now()}`,
    value,
    children,
    label,
    onChange,
    clear = false,
  }) => {
    const handleChange = (event: SelectChangeEvent) => {
      onChange && onChange(event.target.value)
    }
    return (
      <FilterSelectItem>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          label={label}
          value={value ?? ''}
          displayEmpty={true}
          labelId={id}
          onChange={handleChange}
        >
          {clear && (
            <MenuItem sx={{ fontSize: 14 }} value="">
              <em>None</em>
            </MenuItem>
          )}
          {children}
        </Select>
      </FilterSelectItem>
    )
  }
)
