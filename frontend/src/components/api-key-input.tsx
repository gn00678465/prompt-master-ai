import { ChevronDown, ChevronUp } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ApiKeyInputProps {
  value?: string
  onChange?: (value: string) => void
}

export const ApiKeyInput = forwardRef<HTMLInputElement, ApiKeyInputProps>(({ value, onChange }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true)

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
            value={value || ''}
            onChange={e => onChange?.(e.target.value)}
          />
          <Button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700">儲存</Button>
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
})

ApiKeyInput.displayName = 'ApiKeyInput'
