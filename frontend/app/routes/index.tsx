import type React from "react"
import type { SubmitHandler } from "react-hook-form"

import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff, Lightbulb } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute('/')({
  component: AuthPage,
})

// 定義表單型別
interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // 登入表單狀態
  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    }
  })

  // 註冊表單狀態
  const {
    register: registerRegister,
    handleSubmit: registerHandleSubmit,
    watch: registerWatch,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  // 處理登入
  const handleLogin: SubmitHandler<LoginFormData> = async (_data) => {
    setIsLoading(true)
    setError("")

    try {
      // 這裡應該調用實際的 API
      // console.log("Login attempt:", data)

      // 模擬 API 調用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模擬成功登入
      setSuccess("登入成功！正在跳轉...")
      setTimeout(() => {
        // router.push("/")
      }, 1000)
    } catch {
      setError("登入失敗，請檢查您的用戶名和密碼")
    } finally {
      setIsLoading(false)
    }
  }

  // 處理註冊
  const handleRegister: SubmitHandler<RegisterFormData> = async (_data) => {
    setIsLoading(true)
    setError("")

    try {
      // 這裡應該調用實際的 API
      // console.log("Register attempt:", data)

      // 模擬 API 調用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模擬成功註冊
      setSuccess("註冊成功！正在跳轉...")
      setTimeout(() => {
        // router.push("/")
      }, 1000)
    } catch {
      setError("註冊失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
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
            <Tabs defaultValue="login" className="w-full">
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
                      {...loginRegister("username", {
                        required: "請輸入用戶名",
                        minLength: { value: 3, message: "用戶名至少需要 3 個字元" }
                      })}
                      placeholder="輸入您的用戶名"
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
                        type={showPassword ? "text" : "password"}
                        {...loginRegister("password", {
                          required: "請輸入密碼",
                          minLength: { value: 6, message: "密碼至少需要 6 個字元" }
                        })}
                        placeholder="輸入您的密碼"
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

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                    {isLoading ? "登入中..." : "登入"}
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
                      {...registerRegister("username", {
                        required: "請輸入用戶名",
                        minLength: { value: 3, message: "用戶名至少需要 3 個字元" }
                      })}
                      placeholder="選擇一個用戶名"
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
                      {...registerRegister("email", {
                        required: "請輸入電子郵件",
                        pattern: {
                          value: /^[\w.%+-]+@[\w.-]+\.[A-Z]{2,}$/i,
                          message: "請輸入有效的電子郵件地址"
                        }
                      })}
                      placeholder="輸入您的電子郵件"
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
                        type={showPassword ? "text" : "password"}
                        {...registerRegister("password", {
                          required: "請輸入密碼",
                          minLength: { value: 8, message: "密碼至少需要 8 個字元" }
                        })}
                        placeholder="至少 8 個字元"
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
                        type={showConfirmPassword ? "text" : "password"}
                        {...registerRegister("confirmPassword", {
                          required: "請確認密碼",
                          validate: (value) => {
                            const password = registerWatch("password")
                            return value === password || "密碼確認不匹配"
                          }
                        })}
                        placeholder="再次輸入密碼"
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

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                    {isLoading ? "註冊中..." : "註冊"}
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
