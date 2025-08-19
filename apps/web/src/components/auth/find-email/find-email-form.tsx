'use client';

import React, { useState } from 'react';

import { User } from 'lucide-react';

import ErrorMessage from '@/components/auth/error-message';
import { FindEmailSuccess } from '@/components/auth/find-email';
import InputIcon from '@/components/common/input/icon';

type Step = 1 | 2;

const FindEmailForm = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isSuccess = Math.random() > 0.5;

      if (isSuccess) {
        const result = {
          username: 'username',
          email: 'User***@test.com',
        };

        setUserInfo(result);
        setCurrentStep(2);
      } else {
        setFieldErrors({ name: '유저 정보가 없습니다.' });
      }
    } catch (error) {
      setFieldErrors({ name: '이메일 찾기 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = (): boolean => {
    return !!formData.name.trim();
  };

  const renderInputForm = () => (
    <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
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
          placeholder="회원정보 입력 (예. 01012345678)"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange('name', e.target.value)
          }
          className={fieldErrors.name ? 'text-danger-600 placeholder:text-danger-600/60' : ''}
        >
          <User className={fieldErrors.name ? 'text-danger-600' : 'text-neutral-900'} />
        </InputIcon>
      </div>

      <ErrorMessage errors={fieldErrors} />
    </form>
  );

  if (currentStep === 2) {
    return <FindEmailSuccess userInfo={userInfo} />;
  }

  return renderInputForm();
};

export default FindEmailForm;
