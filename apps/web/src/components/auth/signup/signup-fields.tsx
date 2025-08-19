import React from 'react';

import { Lock, Mail, User } from 'lucide-react';

import PasswordToggle from '@/components/auth/password-toggle';
import { InputIcon } from '@/components/common';

import { checkNickname } from '@/lib/api/nickname';

interface SignupFieldsProps {
  formData: {
    name: string;
    email: string;
    password: string;
  };
  showPassword: boolean;
  fieldErrors: Record<string, string>;
  onInputChange: (fieldId: string, value: string | boolean) => void;
  onTogglePassword: () => void;
  onNicknameValidationChange?: (isValid: boolean, message?: string) => void;
}

const SignupFields = ({
  formData,
  showPassword,
  fieldErrors,
  onInputChange,
  onTogglePassword,
  onNicknameValidationChange,
}: SignupFieldsProps) => {
  const hasNameError = !!fieldErrors.name;
  const hasEmailError = !!fieldErrors.email;
  const hasPasswordError = !!fieldErrors.password;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('name', e.target.value);
    onNicknameValidationChange?.(true);
  };

  const handleBlur = async () => {
    if (!formData.name.trim()) {
      onNicknameValidationChange?.(false, '닉네임을 입력해주세요.');
      return;
    }

    if (formData.name.trim().length < 2) {
      onNicknameValidationChange?.(false, '닉네임은 2자 이상이어야 합니다.');
      return;
    }

    try {
      const result = await checkNickname(formData.name);
      onNicknameValidationChange?.(result.available, result.message);
    } catch (error) {
      onNicknameValidationChange?.(false, '닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={`${
          hasNameError
            ? '[&_.shadow-xs]:border-danger-600 [&_.shadow-xs]:bg-danger-50 [&_.shadow-xs]:focus-within:border-danger-600 [&_.shadow-xs]:focus-within:ring-danger-600/50 [&_svg]:text-danger-600 [&_input]:placeholder:text-danger-600/60'
            : ''
        }`}
      >
        <InputIcon
          id="name"
          name="name"
          type="text"
          iconStyle="left"
          value={formData.name}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="닉네임"
        >
          <User className="text-neutral-900" />
        </InputIcon>
      </div>
      <div
        className={`${
          hasEmailError
            ? '[&_.shadow-xs]:border-danger-600 [&_.shadow-xs]:bg-danger-50 [&_.shadow-xs]:focus-within:border-danger-600 [&_.shadow-xs]:focus-within:ring-danger-600/50'
            : ''
        }`}
      >
        <InputIcon
          id="email"
          name="email"
          type="email"
          iconStyle="left"
          placeholder="이메일"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange('email', e.target.value)
          }
          className={hasEmailError ? 'text-danger-600 placeholder:text-danger-600/60' : ''}
        >
          <Mail className={hasEmailError ? 'text-danger-600' : 'text-neutral-900'} />
        </InputIcon>
      </div>
      <div
        className={`${
          hasPasswordError
            ? '[&_.shadow-xs]:border-danger-600 [&_.shadow-xs]:bg-danger-50 [&_.shadow-xs]:focus-within:border-danger-600 [&_.shadow-xs]:focus-within:ring-danger-600/50'
            : ''
        }`}
      >
        <InputIcon
          id="password"
          name="password"
          iconStyle="both"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange('password', e.target.value)
          }
          className={hasPasswordError ? 'text-danger-600 placeholder:text-danger-600/60' : ''}
        >
          <Lock className={hasPasswordError ? 'text-danger-600' : 'text-neutral-900'} />
          <PasswordToggle
            showPassword={showPassword}
            onToggle={onTogglePassword}
            hasError={hasPasswordError}
          />
        </InputIcon>
      </div>
    </div>
  );
};

export default SignupFields;
