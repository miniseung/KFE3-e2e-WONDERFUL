'use client';

import React from 'react';

import Link from 'next/link';

import { LocationSetup, SignupDone, SignupForm, SignupSuccess } from '@/components/auth/signup';

import { useSignupFlow, useSignupForm } from '@/hooks/auth';

const SignupFlow = () => {
  const signupForm = useSignupForm();
  const signupFlow = useSignupFlow();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const result = await signupForm.handleFormSubmit(event);
    if (result.success) {
      signupFlow.goToSuccess();
    }
  };

  if (signupFlow.currentStep === 'done') {
    return <SignupDone onStartActivity={signupFlow.handleStartActivity} />;
  }

  if (signupFlow.currentStep === 'location') {
    return <LocationSetup onSaveLocation={signupFlow.handleSaveLocation} />;
  }

  if (signupFlow.currentStep === 'success') {
    return <SignupSuccess handleLocationSetup={signupFlow.goToLocationSetup} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white p-4">
      <h1 className="text-h3 text-center font-bold text-neutral-900">회원 가입</h1>
      <div className="flex w-full flex-col items-center gap-4">
        <SignupForm
          formData={signupForm.formData}
          agreeToTerms={signupForm.agreeToTerms}
          onAgreeToTerms={signupForm.handleAgreeToTerms}
          showPassword={signupForm.showPassword}
          isSubmitting={signupForm.isSubmitting}
          fieldErrors={signupForm.fieldErrors}
          onInputChange={signupForm.handleInputChange}
          onTogglePassword={signupForm.handleTogglePassword}
          onNicknameValidationChange={signupForm.handleNicknameValidationChange} // 추가
          onSubmit={handleFormSubmit}
          isFormValid={signupForm.isFormValid}
        />
        <div className="text-center text-sm">
          <span className="text-neutral-600">이미 계정이 있으신가요? </span>
          <Link href="/auth/signin" className="text-primary-500 font-medium">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
