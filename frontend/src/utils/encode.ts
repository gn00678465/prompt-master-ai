/**
 * 編碼資料為 Base64 字串 (使用現代 API)
 * @param data 要編碼的資料
 * @returns 編碼後的字串
 */
export function encode<T>(data: T): string {
  const jsonString = JSON.stringify(data)
  // 使用 TextEncoder 和 btoa 處理
  const bytes = new TextEncoder().encode(jsonString)
  // 轉換為 Base64
  return btoa(
    Array.from(bytes)
      .map(byte => String.fromCharCode(byte))
      .join(''),
  )
}
