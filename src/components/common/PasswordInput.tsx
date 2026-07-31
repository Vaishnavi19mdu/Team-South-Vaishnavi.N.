import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input, { InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showLockIcon?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showLockIcon = true,
  leftIcon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      leftIcon={leftIcon || (showLockIcon ? <Lock className="w-5 h-5 text-[#8E8E93]" /> : undefined)}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="p-1 text-[#8E8E93] hover:text-[#1A1A1A] transition-colors focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      }
      {...props}
    />
  );
};

export default PasswordInput;
