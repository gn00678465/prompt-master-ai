import { ChevronsUpDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/animate-ui/radix/collapsible'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAPIKeyStore } from '@/stores/useAPIKeyStore'

interface ApiKeyInputProps {
  value?: string
  onChange?: (value: string) => void
}

export function ApiKeyInput({ ref, value, onChange }: ApiKeyInputProps & { ref?: React.Ref<HTMLInputElement | null> }) {
  const [userInput, setUserInput] = useState<string | null>(null)
  const storedApiKey = useAPIKeyStore(state => state.apiKey)
  const setApiKey = useAPIKeyStore(state => state.set)
  const clearApiKey = useAPIKeyStore(state => state.clear)

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
        // await db.apiKeys.clear()
        clearApiKey()
        return
      }

      // 清除舊的 API 密鑰
      clearApiKey()

      // 新增新的加密 API 密鑰
      setApiKey(currentValue.trim())

      // 成功儲存，但不使用 console.log
    }
    catch (error) {
      console.error('加密或儲存 API 密鑰時發生錯誤：', error)
    }
  }

  return (
    <Collapsible defaultOpen={!storedApiKey}>
      <div className="space-y-2">
        <div className="flex items-center justify-between cursor-pointer">
          <Label className="font-medium">API 密鑰</Label>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0 cursor-pointer">
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="-m-1">
          <div className="space-y-2 p-1">
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

ApiKeyInput.displayName = 'ApiKeyInput'
