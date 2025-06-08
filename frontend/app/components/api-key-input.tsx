import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ApiKeyInput() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [apiKey, setApiKey] = useState('')

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="font-medium">API 密鑰</h3>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          <Input
            placeholder="您的 Gemini API 密鑰"
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">儲存</Button>
          <p className="text-xs text-muted-foreground">
            沒有您的 Gemini API 密鑰，
            <a href="#" className="text-emerald-600 hover:underline">
              獲取 API 密鑰 →
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
