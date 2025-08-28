/**
 * 解碼 Base64 字串 (使用現代 API)
 * @param str 要解碼的字串
 * @returns 解碼後的資料
 */
export function decode<T>(str: string): T {
  const binaryString = atob(str)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const jsonString = new TextDecoder().decode(bytes)
  return JSON.parse(jsonString) as T
}
