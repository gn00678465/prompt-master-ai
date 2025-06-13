export interface AuthLoginPayload {
  "username": string
  "password": string
}

export interface AuthRegisterPayload extends AuthLoginPayload {
  email: string
}


export interface AuthResponse {
  "user_id": number
  "username": string,
  "email": string,
  "created_at": string,
  "last_login": string,
  "access_token": string
}
