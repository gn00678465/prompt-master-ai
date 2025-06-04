# PromptMaster AI 前端規格書（更新版）

## 1. 專案概述

### 1.1 專案目標
開發「PromptMaster AI」的前端介面，支援與後端的互動，實現 Prompt 的優化、改寫與增強功能。前端需提供直觀的使用者界面，讓使用者能夠輕鬆提交 Prompt、選擇模板、調整參數並查看優化結果。

### 1.2 前端主要功能
- 提供 Prompt 輸入與優化結果展示介面
- 實現可客製化的模板選擇與管理系統
- 提供模型與參數控制元件
- 實現用戶身份驗證和歷史記錄管理
- 支援自定義模板的完整 CRUD 操作

### 1.3 技術棧
- **框架**: TanStack Start (Full-Stack React)
- **路由**: TanStack Router
- **語言**: TypeScript
- **狀態管理**: TanStack Query + Zustand
- **樣式**: Tailwind CSS
- **表單處理**: React Hook Form + Zod
- **API 通訊**: TanStack Query

---

## 2. 前端功能規格

### 2.1 用戶介面

#### 2.1.1 核心頁面
1. **首頁** (`/`)
   - 應用介紹與功能概述
   - 註冊/登入入口
   - 產品特色展示

2. **認證頁面**
   - **登入頁面** (`/auth/login`)
   - **註冊頁面** (`/auth/register`)
   - 支援表單驗證和錯誤處理

3. **Prompt 優化頁面** (`/optimize`)
   - 原始 Prompt 輸入區域
   - 模板選擇功能（預設 + 自定義）
   - 模型和參數控制區域
   - 優化結果顯示區
   - 儲存到歷史記錄功能

4. **模板管理頁面** (`/templates`)
   - **模板列表頁** (`/templates`)
     - 預設模板展示（不可編輯）
     - 自定義模板列表
     - 創建新模板入口
   - **模板詳情/編輯頁** (`/templates/$templateId`)
     - 模板內容查看
     - 編輯功能（僅限自定義模板）
   - **創建模板頁** (`/templates/create`)
     - 模板創建表單

5. **歷史記錄頁面** (`/history`)
   - 歷史優化記錄列表
   - 篩選和搜索功能
   - 重用功能
   - 模板資訊顯示

6. **設置頁面** (`/settings`)
   - 用戶資料管理
   - 默認偏好設定
   - 主題切換功能
   - 登出功能

#### 2.1.2 核心元件
1. **PromptInput 元件**
   - 多行文本輸入框（支援 Markdown 語法高亮）
   - 字數統計功能
   - 清空和提交按鈕
   - 即時儲存草稿功能

2. **TemplateSelector 元件**
   - 分組顯示（預設模板 vs 自定義模板）
   - 模板預覽功能
   - 創建新模板入口
   - 編輯/刪除自定義模板按鈕

3. **TemplateCard 元件**
   - 模板基本資訊展示
   - 使用次數統計
   - 操作按鈕（編輯/刪除/使用）
   - 標籤和分類顯示

4. **ModelSelector 元件**
   - 模型選擇下拉框
   - 參數說明提示
   - 即時參數調整

5. **TemperatureSlider 元件**
   - 溫度參數調節滑塊
   - 視覺化參數顯示
   - 參數影響提示

6. **OptimizationResult 元件**
   - 原始與優化後對比顯示
   - 優化分析展示
   - 複製和保存功能
   - 重新優化按鈕

7. **TemplateForm 元件**
   - 模板創建/編輯表單
   - 即時預覽功能
   - 表單驗證
   - 儲存/取消操作

### 2.2 用戶體驗規格

#### 2.2.1 響應式設計
- 支援桌面、平板和移動設備
- 桌面版佈局採用左側導航 + 主內容區域
- 移動版佈局採用底部導航和可摺疊側邊欄

#### 2.2.2 載入狀態與互動反饋
- 使用 TanStack Query 的載入狀態
- 樂觀更新機制
- 統一的錯誤處理和重試機制
- 即時儲存指示器

#### 2.2.3 路由與導航
- 使用 TanStack Router 的類型安全路由
- 受保護的路由（需要認證）
- 麵包屑導航
- 回上一頁功能

#### 2.2.4 無障礙設計
- 符合 WCAG 2.1 AA 標準
- 提供適當的顏色對比
- 支援鍵盤導航
- 添加恰當的 ARIA 屬性

---

## 3. 前端架構

### 3.1 TanStack Start 應用結構
```
frontend/
├── app/
│   ├── routes/                     # 路由定義
│   │   ├── __root.tsx             # 根路由
│   │   ├── index.tsx              # 首頁
│   │   ├── auth/
│   │   │   ├── login.tsx          # 登入頁
│   │   │   └── register.tsx       # 註冊頁
│   │   ├── optimize.tsx           # 優化頁面
│   │   ├── templates/
│   │   │   ├── index.tsx          # 模板列表頁
│   │   │   ├── create.tsx         # 創建模板頁
│   │   │   └── $templateId.tsx    # 模板詳情頁
│   │   ├── history.tsx            # 歷史記錄頁
│   │   └── settings.tsx           # 設置頁
│   ├── components/                # 元件目錄
│   │   ├── ui/                    # 基礎 UI 元件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # 主佈局
│   │   │   ├── AuthLayout.tsx     # 認證頁佈局
│   │   │   └── Navigation.tsx     # 導航元件
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── prompt/
│   │   │   ├── PromptInput.tsx
│   │   │   ├── OptimizationResult.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   └── TemperatureSlider.tsx
│   │   ├── template/
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── TemplateForm.tsx
│   │   │   └── TemplatePreview.tsx
│   │   └── history/
│   │       ├── HistoryList.tsx
│   │       ├── HistoryItem.tsx
│   │       └── HistoryFilters.tsx
│   ├── lib/                       # 工具函數和配置
│   │   ├── api/
│   │   │   ├── client.ts          # API 客戶端
│   │   │   ├── auth.ts            # 認證 API
│   │   │   ├── prompts.ts         # Prompt API
│   │   │   ├── templates.ts       # 模板 API
│   │   │   └── models.ts          # 模型 API
│   │   ├── stores/
│   │   │   ├── auth.ts            # 認證狀態
│   │   │   ├── ui.ts              # UI 狀態
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTemplates.ts
│   │   │   ├── usePromptHistory.ts
│   │   │   └── useModels.ts
│   │   ├── types/
│   │   │   ├── api.ts             # API 類型定義
│   │   │   ├── auth.ts
│   │   │   ├── template.ts
│   │   │   └── prompt.ts
│   │   ├── utils/
│   │   │   ├── validation.ts      # Zod 驗證 schema
│   │   │   ├── token.ts           # Token 處理
│   │   │   └── constants.ts
│   │   └── query-client.ts        # TanStack Query 配置
│   ├── styles/
│   │   └── globals.css            # 全域樣式
│   └── router.tsx                 # 路由配置
├── public/
├── package.json
└── app.config.ts                  # TanStack Start 配置
```

### 3.2 狀態管理

#### 3.2.1 認證狀態 (Zustand Store)
```typescript
interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  setUser: (user: User) => void
  clearAuth: () => void
}
```

#### 3.2.2 UI 狀態 (Zustand Store)
```typescript
interface UIStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  
  // Actions
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}
```

#### 3.2.3 Server State (TanStack Query)
使用 TanStack Query 管理所有服務器狀態：
- 認證狀態
- 模板資料
- Prompt 歷史記錄
- 模型列表

### 3.3 API 整合

#### 3.3.1 API 客戶端設置
```typescript
// lib/api/client.ts
import { QueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = getToken() // 從 localStorage 或狀態管理取得
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }
    
    return response.json()
  }
  
  // HTTP methods
  get<T>(endpoint: string) {
    return this.request<T>(endpoint)
  }
  
  post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
```

#### 3.3.2 Query Hooks 設計
```typescript
// lib/hooks/useTemplates.ts
export const useTemplates = (category?: string) => {
  return useQuery({
    queryKey: ['templates', { category }],
    queryFn: () => templatesApi.getTemplates({ category }),
  })
}

export const useCreateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: templatesApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemplateData }) =>
      templatesApi.updateTemplate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      queryClient.invalidateQueries({ queryKey: ['template', id] })
    },
  })
}

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: templatesApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}
```

#### 3.3.3 認證處理
```typescript
// lib/hooks/useAuth.ts
export const useAuth = () => {
  const authStore = useAuthStore()
  
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      authStore.login(data.access_token, {
        user_id: data.user_id,
        username: data.username,
      })
      // 重定向到之前的頁面或首頁
    },
    onError: (error) => {
      // 處理登入錯誤
    },
  })
  
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      authStore.clearAuth()
      // 重定向到登入頁
    },
  })
  
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      authStore.login(data.access_token, {
        user_id: data.user_id,
        username: data.username,
      })
      // 重定向到優化頁面
    },
  })
  
  return {
    ...authStore,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  }
}
```

### 3.4 路由配置

#### 3.4.1 路由結構
```typescript
// app/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // 將在根元件中提供
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

#### 3.4.2 受保護的路由
```typescript
// app/routes/__root.tsx
export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ context, location }) => {
    // 檢查認證狀態
    if (!context.auth.isAuthenticated && location.pathname !== '/auth/login') {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
```

---

## 4. 元件設計

### 4.1 模板管理元件

#### 4.1.1 TemplateSelector 元件
```typescript
interface TemplateSelectorProps {
  selectedTemplateId?: number
  onTemplateSelect: (templateId: number) => void
  showCreateButton?: boolean
}

export const TemplateSelector = ({ 
  selectedTemplateId, 
  onTemplateSelect,
  showCreateButton = true 
}: TemplateSelectorProps) => {
  const { data: templates, isLoading } = useTemplates()
  
  const defaultTemplates = templates?.filter(t => t.is_default) || []
  const customTemplates = templates?.filter(t => !t.is_default) || []
  
  return (
    <div className="space-y-4">
      {/* 預設模板區塊 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">預設模板</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {defaultTemplates.map((template) => (
            <TemplateCard
              key={template.template_id}
              template={template}
              isSelected={selectedTemplateId === template.template_id}
              onSelect={() => onTemplateSelect(template.template_id)}
              showActions={false}
            />
          ))}
        </div>
      </div>
      
      {/* 自定義模板區塊 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">自定義模板</h3>
          {showCreateButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/templates/create' })}
            >
              <Plus className="w-4 h-4 mr-2" />
              新增模板
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {customTemplates.map((template) => (
            <TemplateCard
              key={template.template_id}
              template={template}
              isSelected={selectedTemplateId === template.template_id}
              onSelect={() => onTemplateSelect(template.template_id)}
              showActions={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### 4.1.2 TemplateForm 元件
```typescript
interface TemplateFormProps {
  template?: Template
  mode: 'create' | 'edit'
  onSubmit: (data: CreateTemplateData) => void
  onCancel: () => void
}

const templateSchema = z.object({
  name: z.string().min(1, '模板名稱為必填'),
  description: z.string().optional(),
  content: z.string().min(10, '模板內容至少需要 10 個字元'),
  category: z.string().optional(),
})

export const TemplateForm = ({ 
  template, 
  mode, 
  onSubmit, 
  onCancel 
}: TemplateFormProps) => {
  const form = useForm<CreateTemplateData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || '',
      description: template?.description || '',
      content: template?.content || '',
      category: template?.category || '',
    },
  })
  
  const [preview, setPreview] = useState(false)
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? '創建新模板' : '編輯模板'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 基本資訊 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>模板名稱</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="輸入模板名稱" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分類</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇分類" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="content">內容創作</SelectItem>
                          <SelectItem value="code">程式碼生成</SelectItem>
                          <SelectItem value="problem-solving">問題解決</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="描述模板的用途..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    模板內容
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreview(!preview)}
                    >
                      {preview ? '編輯' : '預覽'}
                    </Button>
                  </FormLabel>
                  <FormControl>
                    {preview ? (
                      <div className="min-h-[200px] p-4 border rounded-md bg-gray-50">
                        <ReactMarkdown>{field.value}</ReactMarkdown>
                      </div>
                    ) : (
                      <Textarea
                        {...field}
                        className="min-h-[200px] font-mono"
                        placeholder="輸入模板內容，支援 Markdown 語法..."
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                取消
              </Button>
              <Button type="submit">
                {mode === 'create' ? '創建模板' : '更新模板'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

### 4.2 Prompt 優化元件

#### 4.2.1 優化頁面整合
```typescript
// app/routes/optimize.tsx
export const Route = createFileRoute('/optimize')({
  component: OptimizePage,
})

function OptimizePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>()
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [model, setModel] = useState('gemini-pro')
  const [temperature, setTemperature] = useState(0.7)
  
  const optimizeMutation = useOptimizePrompt()
  
  const handleOptimize = () => {
    if (!selectedTemplateId || !originalPrompt.trim()) return
    
    optimizeMutation.mutate({
      original_prompt: originalPrompt,
      template_id: selectedTemplateId,
      model,
      temperature,
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側：輸入區域 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>選擇優化模板</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                selectedTemplateId={selectedTemplateId}
                onTemplateSelect={setSelectedTemplateId}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>輸入 Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <PromptInput
                value={originalPrompt}
                onChange={setOriginalPrompt}
                placeholder="輸入您想要優化的 Prompt..."
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>優化設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ModelSelector value={model} onChange={setModel} />
              <TemperatureSlider value={temperature} onChange={setTemperature} />
              
              <Button
                onClick={handleOptimize}
                disabled={!selectedTemplateId || !originalPrompt.trim() || optimizeMutation.isPending}
                className="w-full"
              >
                {optimizeMutation.isPending ? '優化中...' : '開始優化'}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* 右側：結果區域 */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>優化結果</CardTitle>
            </CardHeader>
            <CardContent>
              {optimizeMutation.data ? (
                <OptimizationResult result={optimizeMutation.data} />
              ) : optimizeMutation.isError ? (
                <div className="text-red-500">
                  優化失敗：{optimizeMutation.error.message}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  選擇模板並輸入 Prompt 後開始優化
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

---

## 5. 前端測試規格

### 5.1 單元測試
- 使用 Vitest 測試框架
- 測試各個 React 元件的渲染和行為
- 測試自定義 hook 的功能
- 測試工具函數和驗證邏輯

### 5.2 整合測試
- 測試頁面級元件
- 測試與 API 的整合（使用 MSW）
- 測試表單提交和數據流程
- 測試路由導航

### 5.3 端到端測試
- 使用 Playwright 進行 E2E 測試
- 測試完整用戶流程
- 測試不同平台和瀏覽器的兼容性
- 測試響應式設計在不同設備上的表現

---

## 6. 前端安全考量

### 6.1 認證與授權
- 安全處理和存儲認證令牌（使用 httpOnly cookies 或安全的 localStorage）
- 實現自動登出過期會話
- 保護受限頁面不被未授權訪問
- 實現登出時的 Token 清理

### 6.2 資料安全
- 避免在客戶端存儲敏感資訊
- 實施 XSS 防護措施
- 針對表單實施適當的資料驗證（使用 Zod）
- 敏感操作需要確認

### 6.3 API 安全
- 保護 API 請求
- 實施請求頻率限制提示
- 實施恰當的錯誤處理
- 避免敏感資訊洩露

---

## 7. 前端部署規格

### 7.1 構建流程
- 設置不同環境的構建配置
- 優化構建產出的大小和性能
- 實施代碼分割和懶加載
- 支援 SSR/SSG 功能

### 7.2 部署流程
- 支援 Vercel、Netlify 等平台部署
- 配置持續集成/持續部署 (CI/CD)
- 設置適當的緩存策略
- 環境變數管理

### 7.3 性能優化
- 實施圖片和資源優化
- 添加適當的預加載和預取策略
- 監控和改進頁面速度指標
- 使用 TanStack Query 的緩存機制
- 實施虛擬滾動（大型列表）
- 代碼分割和懶加載路由
- 圖片懶加載和響應式圖片

---

## 8. 開發工作流程

### 8.1 開發環境設置
```bash
# 1. 克隆項目並安裝依賴
npm create @tanstack/start@latest
cd frontend
npm install

# 2. 安裝額外依賴
npm install @tanstack/react-query @tanstack/react-router
npm install zustand react-hook-form @hookform/resolvers zod
npm install tailwindcss @headlessui/react lucide-react
npm install -D @types/node @vitejs/plugin-react vitest @testing-library/react

# 3. 設置環境變數
cp .env.example .env.local
```

### 8.2 目錄結構初始化
```typescript
// app.config.ts
import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    preset: 'vercel'
  },
  vite: {
    plugins: [],
  },
})
```

### 8.3 開發規範
- 使用 TypeScript 嚴格模式
- 遵循 ESLint 和 Prettier 規範
- 組件命名使用 PascalCase
- 檔案命名使用 kebab-case
- Hook 命名以 `use` 開頭

---

## 9. 狀態管理詳細設計

### 9.1 Zustand Store 實現

#### 9.1.1 Auth Store
```typescript
// lib/stores/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api/auth'

interface User {
  user_id: number
  username: string
  email: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  setUser: (user: User) => void
  clearAuth: () => void
  refreshToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (token: string, user: User) => {
        set({ 
          token, 
          user, 
          isAuthenticated: true 
        })
      },
      
      logout: async () => {
        const { token } = get()
        if (token) {
          try {
            await authApi.logout()
          } catch (error) {
            console.error('Logout error:', error)
          }
        }
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        })
      },
      
      setUser: (user: User) => {
        set({ user })
      },
      
      clearAuth: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        })
      },
      
      refreshToken: async () => {
        // 實施 token 刷新邏輯（如果後端支援）
        return false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
```

#### 9.1.2 UI Store
```typescript
// lib/stores/ui.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarOpen: true,
      
      setTheme: (theme) => {
        set({ theme })
        // 應用主題到 document
        applyTheme(theme)
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
      
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },
      
      toggleSidebar: () => {
        const { sidebarOpen } = get()
        set({ sidebarOpen: !sidebarOpen })
      },
    }),
    {
      name: 'ui-storage',
    }
  )
)

function applyTheme(theme: 'light' | 'dark' | 'system') {
  if (typeof window === 'undefined') return
  
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}
```

### 9.2 TanStack Query 設置

#### 9.2.1 Query Client 配置
```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from './stores/auth'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分鐘
      retry: (failureCount, error: any) => {
        // 認證錯誤不重試
        if (error?.status === 401) {
          useAuthStore.getState().clearAuth()
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
})
```

#### 9.2.2 API Hooks 實現
```typescript
// lib/hooks/usePrompts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { promptsApi } from '../api/prompts'
import type { OptimizePromptRequest, OptimizePromptResponse } from '../types/api'

export const useOptimizePrompt = () => {
  const queryClient = useQueryClient()
  
  return useMutation<OptimizePromptResponse, Error, OptimizePromptRequest>({
    mutationFn: promptsApi.optimize,
    onSuccess: () => {
      // 優化成功後刷新歷史記錄
      queryClient.invalidateQueries({ queryKey: ['prompt-history'] })
    },
    onError: (error) => {
      console.error('Optimize prompt error:', error)
    },
  })
}

export const usePromptHistory = () => {
  return useQuery({
    queryKey: ['prompt-history'],
    queryFn: promptsApi.getHistory,
  })
}

// lib/hooks/useTemplates.ts
export const useTemplates = (options?: { category?: string }) => {
  return useQuery({
    queryKey: ['templates', options],
    queryFn: () => templatesApi.getTemplates(options),
  })
}

export const useTemplate = (templateId: number) => {
  return useQuery({
    queryKey: ['template', templateId],
    queryFn: () => templatesApi.getTemplate(templateId),
    enabled: !!templateId,
  })
}

export const useCreateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: templatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemplateData }) =>
      templatesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      queryClient.invalidateQueries({ queryKey: ['template', id] })
    },
  })
}

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: templatesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
    onError: (error: any) => {
      if (error?.status === 403) {
        throw new Error('您沒有權限刪除此模板')
      }
    },
  })
}
```

---

## 10. 類型定義

### 10.1 API 類型
```typescript
// lib/types/api.ts
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: 'bearer'
  user_id: number
  username: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse extends LoginResponse {
  email: string
  created_at: string
}

export interface OptimizePromptRequest {
  original_prompt: string
  template_id: number
  model?: string
  temperature?: number
}

export interface OptimizePromptResponse {
  optimized_prompt: string
  improvement_analysis: string
  original_prompt: string
  template_used: {
    template_id: number
    name: string
  }
}
```

### 10.2 模板類型
```typescript
// lib/types/template.ts
export interface Template {
  template_id: number
  name: string
  description: string
  content: string
  is_default: boolean
  category: string
  created_at: string
  updated_at?: string
  can_edit: boolean
  can_delete: boolean
}

export interface CreateTemplateData {
  name: string
  description?: string
  content: string
  category?: string
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {}

export interface TemplateFilters {
  category?: string
  is_default?: boolean
  search?: string
}
```

### 10.3 表單驗證 Schema
```typescript
// lib/utils/validation.ts
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, '請輸入用戶名'),
  password: z.string().min(1, '請輸入密碼'),
})

export const registerSchema = z.object({
  username: z.string()
    .min(3, '用戶名至少需要 3 個字元')
    .max(20, '用戶名不能超過 20 個字元')
    .regex(/^[a-zA-Z0-9_]+$/, '用戶名只能包含字母、數字和下劃線'),
  email: z.string()
    .email('請輸入有效的電子郵件地址'),
  password: z.string()
    .min(8, '密碼至少需要 8 個字元')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密碼必須包含大小寫字母和數字'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '密碼確認不匹配',
  path: ['confirmPassword'],
})

export const templateSchema = z.object({
  name: z.string()
    .min(1, '模板名稱為必填')
    .max(100, '模板名稱不能超過 100 個字元'),
  description: z.string()
    .max(500, '描述不能超過 500 個字元')
    .optional(),
  content: z.string()
    .min(10, '模板內容至少需要 10 個字元')
    .max(5000, '模板內容不能超過 5000 個字元'),
  category: z.string().optional(),
})

export const promptOptimizeSchema = z.object({
  original_prompt: z.string()
    .min(5, 'Prompt 至少需要 5 個字元')
    .max(2000, 'Prompt 不能超過 2000 個字元'),
  template_id: z.number().positive('請選擇一個模板'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type TemplateFormData = z.infer<typeof templateSchema>
export type PromptOptimizeFormData = z.infer<typeof promptOptimizeSchema>
```

---

## 11. 路由保護與導航

### 11.1 受保護路由實現
```typescript
// app/routes/__root.tsx
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../lib/stores/auth'
import { AppLayout } from '../components/layout/AppLayout'

interface RouterContext {
  auth: ReturnType<typeof useAuthStore>
}

export const Route = createRootRoute<RouterContext>({
  component: RootComponent,
  beforeLoad: ({ context, location }) => {
    // 檢查是否為公開路由
    const publicRoutes = ['/', '/auth/login', '/auth/register']
    const isPublicRoute = publicRoutes.includes(location.pathname)
    
    if (!context.auth.isAuthenticated && !isPublicRoute) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
    
    // 已登入用戶訪問認證頁面，重定向到優化頁面
    if (context.auth.isAuthenticated && location.pathname.startsWith('/auth')) {
      throw redirect({
        to: '/optimize',
      })
    }
  },
})

function RootComponent() {
  const auth = useAuthStore()
  
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
```

### 11.2 導航元件
```typescript
// app/components/layout/Navigation.tsx
import { Link, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '../../lib/stores/auth'
import { 
  Home, 
  Zap, 
  BookTemplate, 
  History, 
  Settings,
  LogOut 
} from 'lucide-react'

const navItems = [
  { to: '/', label: '首頁', icon: Home, requireAuth: false },
  { to: '/optimize', label: '優化 Prompt', icon: Zap, requireAuth: true },
  { to: '/templates', label: '模板管理', icon: BookTemplate, requireAuth: true },
  { to: '/history', label: '歷史記錄', icon: History, requireAuth: true },
  { to: '/settings', label: '設置', icon: Settings, requireAuth: true },
]

export const Navigation = () => {
  const { isAuthenticated, logout } = useAuthStore()
  const location = useLocation()
  
  const visibleItems = navItems.filter(item => 
    !item.requireAuth || isAuthenticated
  )
  
  return (
    <nav className="flex flex-col space-y-2">
      {visibleItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.to
        
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
      
      {isAuthenticated && (
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>登出</span>
        </button>
      )}
    </nav>
  )
}
```

---

## 12. 錯誤處理與用戶體驗

### 12.1 全局錯誤邊界
```typescript
// app/components/ErrorBoundary.tsx
import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/Button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              糟糕！出現了錯誤
            </h1>
            <p className="text-gray-600 mb-6">
              應用程式遇到了未預期的錯誤。請重新載入頁面或聯繫客服。
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重新載入頁面
            </Button>
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### 12.2 API 錯誤處理
```typescript
// lib/api/client.ts (更新版)
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  // ... 其他方法
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = getToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // 處理認證錯誤
        if (response.status === 401) {
          useAuthStore.getState().clearAuth()
          window.location.href = '/auth/login'
        }
        
        throw new ApiError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          errorData
        )
      }
      
      return response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // 網絡錯誤
      throw new ApiError(0, '網絡連接錯誤，請檢查您的網絡連接')
    }
  }
}
```

### 12.3 載入狀態元件
```typescript
// app/components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const LoadingSpinner = ({ 
  size = 'md', 
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}

// app/components/ui/PageLoader.tsx
export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="載入中..." />
    </div>
  )
}
```

---

## 13. 部署與環境配置

### 13.1 環境變數設置
```typescript
// .env.example
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="PromptMaster AI"
VITE_APP_VERSION=1.0.0

# 生產環境
# VITE_API_URL=https://api.promptmaster.ai
```

### 13.2 Vercel 部署配置
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": "dist"
}
```

### 13.3 CI/CD 配置
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          
      - name: Deploy to Vercel
        uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 14. 參考資源

- [TanStack Start 官方文檔](https://tanstack.com/start)
- [TanStack Router 文檔](https://tanstack.com/router)
- [TanStack Query 文檔](https://tanstack.com/query)
- [Zustand 文檔](https://zustand-demo.pmnd.rs/)
- [React Hook Form 文檔](https://react-hook-form.com/)
- [Zod 文檔](https://zod.dev/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)

這個更新版的前端規格書現在完全適配了新的技術棧（TanStack Start + TanStack Router），並且包含了與後端 API 更新相對應的功能，包括完整的模板管理、認證流程和 Token 處理機制。
