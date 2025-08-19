'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import ErrorMessage from '@/components/auth/error-message';
import { GoogleLoginButton, SigninFields } from '@/components/auth/signin';
import { Button } from '@/components/ui';

import { signIn } from '@/lib/actions/auth';
import { validateEmail, validatePassword } from '@/lib/utils/validation';

const SigninForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const submitFormData = new FormData(event.currentTarget);

    const newFieldErrors: Record<string, string> = {};

    const email = submitFormData.get('email') as string;
    const password = submitFormData.get('password') as string;

    const emailError = validateEmail(email);
    if (emailError) newFieldErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newFieldErrors.password = passwordError;

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn(submitFormData);

      if (result.success) {
        router.push('/');
      } else {
        if (result.field === 'password') {
          setFieldErrors({ password: result.error || '로그인에 실패했습니다.' });
        } else {
          setFieldErrors({ email: result.error || '로그인에 실패했습니다.' });
        }
      }
    } catch (error) {
      setFieldErrors({ email: '로그인 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = (): boolean => {
    return !!(formData.email && formData.password);
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex w-full flex-col gap-4 p-6">
      <SigninFields
        formData={formData}
        showPassword={showPassword}
        fieldErrors={fieldErrors}
        onInputChange={handleInputChange}
        onTogglePassword={handleTogglePassword}
      />
      <ErrorMessage errors={fieldErrors} />
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <Button
          type="submit"
          size="xl"
          color={isFormValid() ? 'primary' : 'disabled'}
          fullWidth={true}
          disabled={isSubmitting || !isFormValid}
        >
          로그인
        </Button>
        <GoogleLoginButton />
      </div>
    </form>
  );
};

export default SigninForm;
