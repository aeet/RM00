export interface Page<T> {
  pageNumber: number
  pageSize: number
  pageParams?: T
}
