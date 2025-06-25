import { useLiveQuery } from 'dexie-react-hooks'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { decryptText, encryptText } from '@/utils/crypto'
import { db } from '@/utils/db'

interface ApiKeyInputProps {
  value?: string
  onChange?: (value: string) => void
}

export function ApiKeyInput({ ref, value, onChange }: ApiKeyInputProps & { ref?: React.Ref<HTMLInputElement | null> }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [userInput, setUserInput] = useState<string | null>(null)

  // 使用 useLiveQuery 來監聽資料庫變化並解密
  const storedApiKey = useLiveQuery(async () => {
    try {
      const keys = await db.apiKeys.toArray()
      if (keys.length > 0) {
        // 解密儲存的密鑰
        const decrypted = await decryptText(keys[0].key)
        return decrypted
      }
      return ''
    }
    catch (error) {
      console.error('讀取或解密 API 密鑰時發生錯誤：', error)
      return ''
    }
  })

  // 計算當前顯示的值
  const currentValue = useMemo(() => {
    // 如果使用者有輸入，優先使用使用者輸入
    if (userInput !== null) {
      return userInput
    }
    // 否則使用 prop 值或儲存的值
    return value ?? storedApiKey ?? ''
  }, [userInput, value, storedApiKey])

  // 通知父元件值的變化
  useEffect(() => {
    if (storedApiKey && !value && onChange && userInput === null) {
      onChange(storedApiKey)
    }
  }, [storedApiKey, value, onChange, userInput])

  // 處理輸入變化
  const handleInputChange = (newValue: string) => {
    setUserInput(newValue)
    onChange?.(newValue)
  }

  // 儲存 API 密鑰到 IndexedDB（加密後儲存）
  const handleSaveApiKey = async () => {
    try {
      // 如果是空字串，清空資料庫
      if (!currentValue.trim()) {
        await db.apiKeys.clear()
        return
      }

      // 加密 API 密鑰
      const encryptedKey = await encryptText(currentValue.trim())

      // 清除舊的 API 密鑰
      await db.apiKeys.clear()

      // 新增新的加密 API 密鑰
      await db.apiKeys.add({
        id: 1,
        key: encryptedKey,
      })

      // 成功儲存，但不使用 console.log
    }
    catch (error) {
      console.error('加密或儲存 API 密鑰時發生錯誤：', error)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="font-medium">API 密鑰</h3>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          <Input
            ref={ref}
            placeholder="您的 Gemini API 密鑰"
            type="password"
            value={currentValue}
            onChange={e => handleInputChange(e.target.value)}
          />
          <Button
            type="button"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSaveApiKey}
          >
            儲存
          </Button>
          <p className="text-xs text-muted-foreground">
            沒有您的 Gemini API 密鑰，
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              獲取 API 密鑰 →
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

ApiKeyInput.displayName = 'ApiKeyInput'
