import { Button, Stack, styled, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Iconfont from 'components/Iconfont'
import { Dayjs } from 'dayjs'
import useResize from 'hooks/useResize'
import { FC, memo, useEffect, useState } from 'react'
import { Flex } from 'styles/Common'
import { darkColor } from '../../styles/constants/dark'

export interface FilterValues {
  startTime: null | Dayjs
  endTime: null | Dayjs
}

const ExportButton = styled(Button)`
  color: ${(props) => props.theme.color?.primary30};
  border: 1px solid ${(props) => props.theme.color?.primary30};
  font-weight: 600;
  height: 28px;
  border-radius: 6px;
  &:hover {
    background: ${(props) => props.theme.color?.primary30};
    color: ${(props) => props.theme.color?.text00};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    flex: 0 0 100px;
    padding: 0;
  }
`
const DatePickerIconWrap = styled(Flex)`
  color: ${(props) => props.theme.color?.primary30};
`

const DesktopDatePickerWrap = styled(DesktopDatePicker)`
  width: 130px;
  height: 28px;
`
const MobileDatePickerWrap = styled(MobileDatePicker)``

const DatePickerIcon: FC = memo(() => {
  return (
    <DatePickerIconWrap>
      <Iconfont name="icon-date" size={20}></Iconfont>
    </DatePickerIconWrap>
  )
})
const pickerStyle = {
  '& .MuiOutlinedInput-root.MuiInputBase-formControl:hover .MuiOutlinedInput-notchedOutline':
    {
      borderColor: (props: any) => props.color.primary20,
      // background: (props: any) => props.color.primary20,
    },
  '& .MuiDayPicker-monthContainer .MuiButtonBase-root.Mui-selected': {
    background: (props: any) => props.color.primary20,
    color: darkColor.text00,
  },
  '& .MuiDayPicker-monthContainer .MuiButtonBase-root.Mui-selected:hover': {
    background: (props: any) => props.color.primary30,
  },
  '& .MuiButtonBase-root.MuiPickersDay-dayWithMargin': {
    background: 'unset',
  },
  '& button.MuiButtonBase-root.MuiPickersDay-today': {
    borderColor: (props: any) => props.color.primary30,
  },
  '& .MuiTextField-root .MuiOutlinedInput-root.MuiInputBase-formControl .MuiOutlinedInput-notchedOutline':
    {
      borderColor: (props: any) => props.color.DatePickerInput,
    },
  '& .MuiTextField-root .MuiOutlinedInput-root.MuiInputBase-formControl:hover .MuiOutlinedInput-notchedOutline':
    {
      borderColor: (props: any) => props.color.primary30,
    },
  '& .MuiFormControl-root  .MuiFormLabel-root.Mui-focused': {
    color: (props: any) => props.color.primary30,
  },
}
export const HistoryFilter: FC<{
  onChange?(values: FilterValues): void
  onExport?(values: FilterValues): void
}> = memo(({ onChange, onExport }) => {
  const { isMobile } = useResize()

  const [values, setValues] = useState<FilterValues>({
    startTime: null,
    endTime: null,
  })

  const handleChange = (key: string, newValue: any) => {
    setValues((vs) => ({ ...vs, [key]: newValue }))
  }

  useEffect(() => {
    onChange && handleDateValue(onChange)
  }, [values])

  const handleDateValue = (cb: (values: FilterValues) => void) => {
    let endTime = values.endTime
    if (values.endTime) {
      endTime = values.endTime.add(86399, 'second')
    }
    cb({ ...values, endTime })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        direction="row"
        spacing={1}
        padding={isMobile ? '0 20px' : '0'}
        marginBottom={isMobile ? '8px' : '0'}>
        {isMobile ? (
          <MobileDatePickerWrap
            sx={pickerStyle}
            label="Begin"
            inputFormat="MM/DD/YYYY"
            maxDate={values.endTime || undefined}
            value={values.startTime}
            onChange={(newValue) => handleChange('startTime', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  '.MuiInputLabel-root': {
                    lineHeight: '28px',
                    fontSize: '12px',
                    transform: `translate(14px, 0px) scale(1)`,
                    '&.Mui-focused': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                    '&.MuiFormLabel-filled': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                  },
                  '.MuiInputBase-input': {
                    height: '28px',
                    paddingTop: 0,
                    paddingBottom: 0,
                    lineHeight: '28px',
                    fontSize: '12px',
                  },
                }}
                size="small"
              />
            )}
          />
        ) : (
          <DesktopDatePickerWrap
            sx={pickerStyle}
            label="Begin"
            inputFormat="MM/DD/YYYY"
            maxDate={values.endTime || undefined}
            value={values.startTime}
            onChange={(newValue) => handleChange('startTime', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  '.MuiInputLabel-root': {
                    lineHeight: '28px',
                    fontSize: '12px',
                    transform: `translate(14px, 0px) scale(1)`,
                    '&.Mui-focused': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                    '&.MuiFormLabel-filled': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                  },
                  '.MuiInputBase-input': {
                    height: '28px',
                    paddingTop: 0,
                    paddingBottom: 0,
                    lineHeight: '28px',
                    fontSize: '12px',
                  },
                }}
                size="small"
              />
            )}
            components={{
              OpenPickerIcon: DatePickerIcon,
            }}
          />
        )}
        {isMobile ? (
          <MobileDatePickerWrap
            sx={pickerStyle}
            label="End"
            inputFormat="MM/DD/YYYY"
            minDate={values.startTime || undefined}
            value={values.endTime}
            onChange={(newValue) => handleChange('endTime', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  '.MuiInputLabel-root': {
                    lineHeight: '28px',
                    fontSize: '12px',
                    transform: `translate(14px, 0px) scale(1)`,
                    '&.Mui-focused': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                    '&.MuiFormLabel-filled': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                  },
                  '.MuiInputBase-input': {
                    height: '28px',
                    paddingTop: 0,
                    paddingBottom: 0,
                    lineHeight: '28px',
                    fontSize: '12px',
                  },
                }}
                size="small"
              />
            )}
          />
        ) : (
          <DesktopDatePickerWrap
            sx={pickerStyle}
            label="End"
            inputFormat="MM/DD/YYYY"
            minDate={values.startTime || undefined}
            value={values.endTime}
            onChange={(newValue) => handleChange('endTime', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  '.MuiInputLabel-root': {
                    lineHeight: '28px',
                    fontSize: '12px',
                    transform: `translate(14px, 0px) scale(1)`,
                    '&.Mui-focused': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                    '&.MuiFormLabel-filled': {
                      transform: `translate(14px, -12px) scale(1)`,
                    },
                  },
                  '.MuiInputBase-input': {
                    height: '28px',
                    paddingTop: 0,
                    paddingBottom: 0,
                    lineHeight: '28px',
                    fontSize: '12px',
                  },
                }}
                size="small"
              />
            )}
            components={{
              OpenPickerIcon: DatePickerIcon,
            }}
          />
        )}

        <ExportButton
          variant="outlined"
          onClick={() => {
            onExport && handleDateValue(onExport)
          }}>
          Export CSV
        </ExportButton>
      </Stack>
    </LocalizationProvider>
  )
})
