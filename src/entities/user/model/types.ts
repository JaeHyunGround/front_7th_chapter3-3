/**
 * 사용자 주소 정보
 */
export interface UserAddress {
  address: string
  city: string
  state: string
  postalCode?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

/**
 * 사용자 회사 정보
 */
export interface UserCompany {
  name: string
  title: string
  department?: string
  address?: UserAddress
}

/**
 * 사용자 엔티티
 */
export interface User {
  id: number
  username: string
  image: string
  firstName?: string
  lastName?: string
  age?: number
  email?: string
  phone?: string
  address?: UserAddress
  company?: UserCompany
}

/**
 * 사용자 목록 조회 응답
 */
export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}
