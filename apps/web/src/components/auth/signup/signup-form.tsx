import React from 'react';

import ErrorMessage from '@/components/auth/error-message';
import { SignupFields } from '@/components/auth/signup';
import { Button } from '@/components/ui';

interface SignupFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
  };
  agreeToTerms: boolean;
  onAgreeToTerms: (agree: boolean) => void;
  showPassword: boolean;
  isSubmitting: boolean;
  fieldErrors: Record<string, string>;
  onInputChange: (fieldId: string, value: string | boolean) => void;
  onTogglePassword: () => void;
  onNicknameValidationChange: (isValid: boolean, message?: string) => void; // 메시지 파라미터 추가
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isFormValid: () => boolean;
}

const SignupForm = ({
  formData,
  showPassword,
  isSubmitting,
  fieldErrors,
  agreeToTerms,
  onAgreeToTerms,
  onInputChange,
  onTogglePassword,
  onNicknameValidationChange,
  onSubmit,
  isFormValid,
}: SignupFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col items-center justify-center gap-4 p-6"
    >
      <SignupFields
        formData={formData}
        showPassword={showPassword}
        fieldErrors={fieldErrors}
        onInputChange={onInputChange}
        onTogglePassword={onTogglePassword}
        onNicknameValidationChange={onNicknameValidationChange}
      />
      <div className="mt-5 flex w-[327px] items-center justify-end pl-8">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAgreeToTerms(e.target.checked)}
            className="text-primary-500 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
          />
          <span className="text-sm text-neutral-600">서비스 약관에 동의합니다</span>
        </label>
      </div>

      <ErrorMessage errors={fieldErrors} />

      <Button
        type="submit"
        size="xl"
        color={isFormValid() ? 'primary' : 'disabled'}
        fullWidth={true}
        disabled={isSubmitting || !isFormValid}
      >
        회원가입
      </Button>
    </form>
  );
};

export default SignupForm;
