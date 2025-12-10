/**
 * 공통 HTTP 헤더
 */
const BASE_HEADERS = {
  "Content-Type": "application/json",
}

/**
 * HTTP 요청 유틸리티
 */
export const http = {
  /**
   * GET 요청
   */
  async get<TResponse>(url: string, errorMessage: string): Promise<TResponse> {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(errorMessage)
    }

    return response.json()
  },

  /**
   * POST 요청
   */
  async post<TRequest, TResponse>(url: string, data: TRequest, errorMessage: string): Promise<TResponse> {
    const response = await fetch(url, {
      method: "POST",
      headers: BASE_HEADERS,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(errorMessage)
    }

    return response.json()
  },

  /**
   * PUT 요청
   */
  async put<TRequest, TResponse>(url: string, data: TRequest, errorMessage: string): Promise<TResponse> {
    const response = await fetch(url, {
      method: "PUT",
      headers: BASE_HEADERS,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(errorMessage)
    }

    return response.json()
  },

  /**
   * PATCH 요청
   */
  async patch<TRequest, TResponse>(url: string, data: TRequest, errorMessage: string): Promise<TResponse> {
    const response = await fetch(url, {
      method: "PATCH",
      headers: BASE_HEADERS,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(errorMessage)
    }

    return response.json()
  },

  /**
   * DELETE 요청
   */
  async delete(url: string, errorMessage: string): Promise<void> {
    const response = await fetch(url, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(errorMessage)
    }
  },
}
