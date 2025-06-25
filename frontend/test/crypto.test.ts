/**
 * 測試 Web Crypto API 加密功能
 */

import { decryptText, encryptText } from '../src/utils/crypto'

async function testCrypto() {
  // eslint-disable-next-line no-console
  console.log('開始測試 Web Crypto API 加密功能...')

  const testApiKey = 'test-gemini-api-key-12345'

  try {
    // 測試加密
    // eslint-disable-next-line no-console
    console.log('原始 API 密鑰:', testApiKey)
    const encrypted = await encryptText(testApiKey)
    // eslint-disable-next-line no-console
    console.log('加密後:', encrypted)

    // 測試解密
    const decrypted = await decryptText(encrypted)
    // eslint-disable-next-line no-console
    console.log('解密後:', decrypted)

    // 驗證結果
    if (testApiKey === decrypted) {
      // eslint-disable-next-line no-console
      console.log('✅ 加密解密測試通過！')
    }
    else {
      // eslint-disable-next-line no-console
      console.log('❌ 加密解密測試失敗！')
    }

    // 測試空字串
    const emptyEncrypted = await encryptText('')
    const emptyDecrypted = await decryptText(emptyEncrypted)

    if (emptyDecrypted === '') {
      // eslint-disable-next-line no-console
      console.log('✅ 空字串加密解密測試通過！')
    }
    else {
      // eslint-disable-next-line no-console
      console.log('❌ 空字串加密解密測試失敗！')
    }
  }
  catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error)
  }
}

// 僅在瀏覽器環境執行測試
if (typeof window !== 'undefined') {
  testCrypto()
}

export { testCrypto }
