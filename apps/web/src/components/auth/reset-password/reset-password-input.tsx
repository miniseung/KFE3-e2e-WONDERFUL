'use client';

import React from 'react';

import { Mail, User } from 'lucide-react';

import ErrorMessage from '@/components/auth/error-message';
import { InputIcon } from '@/components/common';

interface ResetPasswordInputProps {
  formData: {
    name: string;
    email: string;
  };
  fieldErrors: Record<string, string>;
  isSubmitting: boolean;
  onInputChange: (fieldId: string, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isFormValid: () => boolean;
}

const ResetPasswordInput = ({
  formData,
  fieldErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  isFormValid,
}: ResetPasswordInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center space-y-3">
      {/* 이름 입력 */}
      <div
        className={`h-[54px] w-[327px] ${
          fieldErrors.name
            ? '[&_.shadow-xs]:border-danger-600 [&_.shadow-xs]:bg-danger-50 [&_.shadow-xs]:focus-within:border-danger-600 [&_.shadow-xs]:focus-within:ring-danger-600/50'
            : ''
        }`}
      >
        <InputIcon
          id="name"
          name="name"
          type="text"
          iconStyle="left"
          placeholder="이름을 입력해주세요"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange('name', e.target.value)
          }
          className={fieldErrors.name ? 'text-danger-600 placeholder:text-danger-600/60' : ''}
        >
          <User className={fieldErrors.name ? 'text-danger-600' : 'text-neutral-900'} />
        </InputIcon>
      </div>

      <div
        className={`h-[54px] w-[327px] ${
          fieldErrors.email
            ? '[&_.shadow-xs]:border-danger-600 [&_.shadow-xs]:bg-danger-50 [&_.shadow-xs]:focus-within:border-danger-600 [&_.shadow-xs]:focus-within:ring-danger-600/50'
            : ''
        }`}
      >
        <InputIcon
          id="email"
          name="email"
          type="email"
          iconStyle="left"
          placeholder="이메일을 입력해주세요"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange('email', e.target.value)
          }
          className={fieldErrors.email ? 'text-danger-600 placeholder:text-danger-600/60' : ''}
        >
          <Mail className={fieldErrors.email ? 'text-danger-600' : 'text-neutral-900'} />
        </InputIcon>
      </div>

      <ErrorMessage errors={fieldErrors} />
    </form>
  );
};

export default ResetPasswordInput;
