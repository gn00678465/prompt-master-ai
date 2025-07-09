/**
 * 瀏覽器原生 Web Crypto API 加解密工具
 */

// 用於儲存加密金鑰的常數
const STORAGE_KEY = 'prompt-master-crypto-key'
const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256

/**
 * 產生或取得加密金鑰
 */
async function getOrGenerateKey(): Promise<CryptoKey> {
  // 嘗試從 localStorage 取得已存在的金鑰
  const storedKey = localStorage.getItem(STORAGE_KEY)

  if (storedKey) {
    try {
      // 從 base64 還原金鑰
      const keyData = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0))

      // 匯入金鑰
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: ALGORITHM },
        false, // 不可匯出
        ['encrypt', 'decrypt'],
      )

      return key
    }
    catch (error) {
      console.warn('無法匯入儲存的金鑰，將產生新的金鑰：', error)
    }
  }

  // 產生新的加密金鑰
  const key = await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // 可匯出（僅用於儲存）
    ['encrypt', 'decrypt'],
  )

  // 匯出並儲存金鑰
  try {
    const keyData = await crypto.subtle.exportKey('raw', key)
    const keyArray = new Uint8Array(keyData)
    const keyBase64 = btoa(String.fromCharCode(...keyArray))
    localStorage.setItem(STORAGE_KEY, keyBase64)
  }
  catch (error) {
    console.warn('無法儲存加密金鑰：', error)
  }

  return key
}

/**
 * 加密文字
 */
export async function encryptText(text: string): Promise<string> {
  try {
    const key = await getOrGenerateKey()

    // 產生隨機 IV（初始化向量）
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // 將文字轉換為 Uint8Array
    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    // 加密資料
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      data,
    )

    // 將 IV 和加密資料合併
    const result = new Uint8Array(iv.length + encrypted.byteLength)
    result.set(iv)
    result.set(new Uint8Array(encrypted), iv.length)

    // 轉換為 base64
    return btoa(String.fromCharCode(...result))
  }
  catch (error) {
    console.error('加密失敗：', error)
    throw new Error('加密失敗')
  }
}

/**
 * 解密文字
 */
export async function decryptText(encryptedText: string): Promise<string> {
  try {
    const key = await getOrGenerateKey()

    // 從 base64 解碼
    const encryptedData = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0))

    // 分離 IV 和加密資料
    const iv = encryptedData.slice(0, 12)
    const data = encryptedData.slice(12)

    // 解密資料
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      data,
    )

    // 將解密資料轉換為文字
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  }
  catch (error) {
    console.error('解密失敗：', error)
    throw new Error('解密失敗')
  }
}

/**
 * 清除儲存的加密金鑰
 */
export function clearCryptoKey(): void {
  localStorage.removeItem(STORAGE_KEY)
}
