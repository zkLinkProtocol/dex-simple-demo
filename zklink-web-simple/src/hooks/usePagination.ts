import { useCallback, useEffect, useMemo, useState } from 'react'

export const usePagination = (list: any[], pageSize = 4, initPage = 1) => {
  const [data, setData] = useState<any[]>([])
  const [page, setPage] = useState(initPage)
  const pageCount = useMemo(() => {
    return Math.ceil(list.length / pageSize)
  }, [list, pageSize])

  const nextPage = useCallback(() => {
    if (page >= pageCount) {
      return
    }
    setPage(page + 1)
  }, [page, list, pageSize, pageCount])
  const prevPage = useCallback(() => {
    if (page <= 1) {
      return
    }
    setPage(page - 1)
  }, [page])

  useEffect(() => {
    const startIndex = (page - 1) * pageSize
    const d = list.slice(startIndex, startIndex + pageSize)
    setData(d)
  }, [list, page, pageSize])

  return {
    data,
    page,
    pageCount,
    nextPage,
    prevPage,
  }
}
