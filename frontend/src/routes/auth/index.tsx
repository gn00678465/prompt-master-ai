import type { SubmitHandler } from 'react-hook-form'
import type { AuthLoginPayload, AuthRegisterPayload, AuthResponse } from '@/types/auth'
import type { FetchError } from '@/utils/error'
import { zodResolver } from '@hookform/resolvers/zod'

import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Lightbulb } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/stores/useAuthStore'

export const Route = createFileRoute('/auth/')({
  component: AuthPage,
})

// 定義 Zod 驗證 schema
const loginSchema = z.object({
  username: z.string()
    .min(1, '用戶名不能為空')
    .max(20, '用戶名不能超過 20 個字元'),
  password: z.string()
    .min(6, '密碼至少需要 6 個字元')
    .max(100, '密碼不能超過 100 個字元'),
})

const registerSchema = z.object({
  username: z.string()
    .min(1, '用戶名不能為空')
    .max(20, '用戶名不能超過 20 個字元')
    .regex(/^\w+$/, '用戶名只能包含字母、數字和下劃線'),
  email: z.string()
    .email('請輸入有效的電子郵件地址')
    .max(255, '電子郵件地址過長'),
  password: z.string()
    .min(8, '密碼至少需要 8 個字元')
    .max(100, '密碼不能超過 100 個字元')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密碼必須包含大小寫字母和數字'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: '密碼確認不匹配',
  path: ['confirmPassword'],
})

// 定義表單型別
type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { $fetch } = useFetch()
  const updateAuthData = useAuthStore(state => state.updateAuthData)
  const navigate = useNavigate()

  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (data: AuthLoginPayload) => {
      return $fetch<AuthResponse>('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      })
    },
    onSuccess(res) {
      updateAuthData(res)
      navigate({ to: '/' })
    },
    onError(error: FetchError<{ detail: string }>) {
      toast.error(error.data.detail, {
        richColors: true,
      })
    },
  })

  // 登入表單狀態
  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
    reset: loginReset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: async (data: AuthRegisterPayload) => {
      return $fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    },
    onSuccess(res) {
      updateAuthData(res)
      navigate({ to: '/' })
    },
    onError(error: FetchError<{ detail: string }>) {
      toast.error(error.data.detail, {
        richColors: true,
      })
    },
  })

  // 註冊表單狀態
  const {
    register: registerRegister,
    handleSubmit: registerHandleSubmit,
    formState: { errors: registerErrors },
    reset: registerReset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // 處理登入
  const handleLogin: SubmitHandler<LoginFormData> = (_data) => {
    mutateLogin(_data)
  }

  // 處理註冊
  const handleRegister: SubmitHandler<RegisterFormData> = async (_data) => {
    mutateRegister(_data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-2">
            <Lightbulb className="h-6 w-6" />
            PromptMaster AI
          </h1>
          <p className="text-muted-foreground mt-2">登入或註冊以開始優化您的提示詞</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">歡迎使用</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="login"
              className="w-full"
              onValueChange={(value) => {
                // 重置表單和狀態
                setError('')
                setSuccess('')
                setShowPassword(false)
                setShowConfirmPassword(false)

                if (value === 'login') {
                  loginReset()
                }
                else if (value === 'register') {
                  registerReset()
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登入</TabsTrigger>
                <TabsTrigger value="register">註冊</TabsTrigger>
              </TabsList>

              {/* 錯誤和成功訊息 */}
              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* 登入表單 */}
              <TabsContent value="login" className="mt-4">
                <form onSubmit={loginHandleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">用戶名</Label>
                    <Input
                      id="login-username"
                      type="text"
                      {...loginRegister('username')}
                      placeholder="輸入您的用戶名"
                      aria-invalid={!!loginErrors.username}
                    />
                    {loginErrors.username && (
                      <p className="text-sm text-red-600">{loginErrors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">密碼</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        {...loginRegister('password')}
                        placeholder="輸入您的密碼"
                        aria-invalid={!!loginErrors.password}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-sm text-red-600">{loginErrors.password.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoginPending}>
                    {isLoginPending ? '登入中...' : '登入'}
                  </Button>
                </form>
              </TabsContent>

              {/* 註冊表單 */}
              <TabsContent value="register" className="mt-4">
                <form onSubmit={registerHandleSubmit(handleRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">用戶名</Label>
                    <Input
                      id="register-username"
                      type="text"
                      {...registerRegister('username')}
                      placeholder="選擇一個用戶名"
                      aria-invalid={!!registerErrors.username}
                    />
                    {registerErrors.username && (
                      <p className="text-sm text-red-600">{registerErrors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">電子郵件</Label>
                    <Input
                      id="register-email"
                      type="email"
                      {...registerRegister('email')}
                      placeholder="輸入您的電子郵件"
                      aria-invalid={!!registerErrors.email}
                    />
                    {registerErrors.email && (
                      <p className="text-sm text-red-600">{registerErrors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">密碼</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        {...registerRegister('password')}
                        placeholder="至少 8 個字元"
                        aria-invalid={!!registerErrors.password}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {registerErrors.password && (
                      <p className="text-sm text-red-600">{registerErrors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">確認密碼</Label>
                    <div className="relative">
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...registerRegister('confirmPassword')}
                        placeholder="再次輸入密碼"
                        aria-invalid={!!registerErrors.confirmPassword}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {registerErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{registerErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isRegisterPending}>
                    {isRegisterPending ? '註冊中...' : '註冊'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>使用本服務即表示您同意我們的服務條款和隱私政策</p>
        </div>
      </div>
    </div>
  )
}
