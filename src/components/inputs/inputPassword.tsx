// import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import { Input } from '../ui/input'
import React, { useState } from 'react'

export const InputPassword = (
  props: React.InputHTMLAttributes<HTMLInputElement>,
): React.ReactNode => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex items-center">
      <Input type={showPassword ? 'text' : 'password'} {...props} />
      <div
        className="ml-[-30px] flex h-fit cursor-pointer p-1"
        onClick={() => {
          setShowPassword(!showPassword)
        }}
      >
        {showPassword && <EyeIcon />}
        {!showPassword && <EyeClosedIcon />}
      </div>
    </div>
  )
}
