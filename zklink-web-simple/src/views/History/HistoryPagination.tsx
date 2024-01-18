import { Pagination, Stack } from '@mui/material'
import { breakpoints } from 'config/theme'
import useResize from 'hooks/useResize'
import i18n from 'i18n'
import React, { FC, memo } from 'react'
import { PaginationWrap, TotalRes } from './style'

const { md } = breakpoints.values!

export const HistoryPagination: FC<{
  page: number
  count: number
  onChange?(event: React.ChangeEvent<unknown>, page: number): void
}> = memo(({ page, count, onChange }) => {
  const { innerWidth } = useResize()
  return (
    <PaginationWrap>
      <TotalRes>
        {i18n.t('balance-history-showing', { defaultValue: 'Showing' })} {page}{' '}
        {i18n.t('balance-history-of', { defaultValue: 'of' })} {count}{' '}
        {i18n.t('balance-history-pages', { defaultValue: 'pages' })}
      </TotalRes>
      <Stack spacing={2}>
        <Pagination
          count={count}
          variant="outlined"
          shape="rounded"
          color="primary"
          siblingCount={0}
          boundaryCount={1}
          size={innerWidth > md ? 'medium' : 'small'}
          page={page}
          onChange={onChange}
        />
      </Stack>
    </PaginationWrap>
  )
})
