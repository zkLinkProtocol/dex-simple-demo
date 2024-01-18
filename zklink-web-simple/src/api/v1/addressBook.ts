import { Address, Timestamp } from 'types'
import { ApiV1Response, http } from './http'

export type AddressBookChainType = 1 | 2
export interface AddressBookRow {
  id: number // 23, unique id
  chainType: AddressBookChainType // 1: EVM, 2: StarkNet
  address: Address
  tag: string // 'Wallet 1', favorite name
  type: number
  updateTime: Timestamp
}
export async function getAddressBook<T extends ApiV1Response<AddressBookRow[]>>(
  chainType: AddressBookChainType | 0 = 0
): Promise<T> {
  const r = await http.get<T>(`/user-contact/api/addressBook`, {
    params: {
      chainType,
    },
  })
  return r.data
}

export interface AddressBookBody {
  chainType: AddressBookChainType
  address: Address
  tag: string
}
export async function addAddressBook<T extends ApiV1Response<AddressBookRow>>(
  data: AddressBookBody
): Promise<T> {
  const r = await http.post<T>(`/user-contact/api/addressBook`, data)
  return r.data
}

export async function deleteAddressBook<
  T extends ApiV1Response<AddressBookRow>
>(id: number = 0): Promise<T> {
  const r = await http.delete<T>(`/user-contact/api/addressBook/${id}`)
  return r.data
}

export async function putAddressBook<T extends ApiV1Response<boolean>>(
  id: number = 0,
  tag: string
): Promise<T> {
  const r = await http.post<T>(`/user-contact/api/addressBook/${id}`, {
    params: {
      tag,
    },
  })
  return r.data
}
