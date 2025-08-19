'use client';

import { useState } from 'react';

import { useNicknameCheck } from '@/hooks/auth/useNicknameCheck';

interface NicknameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidationChange?: (isValid: boolean) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  initialValue?: string | null; // 프로필 수정 시 기존 닉네임
  name?: string;
}

const NicknameInput = ({
  value,
  onChange,
  onValidationChange,
  error,
  placeholder = '닉네임을 입력하세요',
  className = '',
  initialValue, // 기존 닉네임 (변경 여부 확인용)
  name,
}: NicknameInputProps) => {
  const { isChecking, checkResult, checkNicknameAvailability, clearCheckResult } =
    useNicknameCheck();
  const [hasChecked, setHasChecked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);

    // 입력이 변경되면 검증 결과와 상태 초기화
    clearCheckResult();
    setHasChecked(false);
    onValidationChange?.(false);
  };

  const handleCheckClick = async () => {
    if (!value.trim()) {
      return;
    }

    // 기존 닉네임과 동일한 경우 검증하지 않고 유효한 것으로 처리
    if (initialValue && value.trim() === initialValue.trim()) {
      onValidationChange?.(true);
      setHasChecked(true);
      return;
    }

    setHasChecked(true);
    const isValid = await checkNicknameAvailability(value);
    onValidationChange?.(isValid);
  };

  // 메시지 색상 결정
  const getMessageColor = () => {
    if (error) return 'text-danger-500';
    if (checkResult) {
      return checkResult.available ? 'text-success-500' : 'text-danger-500';
    }
    return 'text-primary-500';
  };

  // 기존 닉네임과 동일한지 확인
  const isSameAsInitial = initialValue && value.trim() === initialValue.trim();

  // 중복확인 버튼 비활성화 조건
  const isCheckButtonDisabled = !value.trim() || isChecking;

  return (
    <div className={className}>
      <div className="flex">
        <div className="relative flex-1">
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            maxLength={12}
            className={`h-12 w-full rounded-l-md border px-4 pr-10 transition-colors ${
              error
                ? 'border-danger-500 focus:ring-danger-500/20'
                : checkResult?.available
                  ? 'border-success-500 focus:ring-success-500/20'
                  : checkResult && !checkResult.available
                    ? 'border-danger-500 focus:ring-danger-500/20'
                    : 'focus:border-primary-500 focus:ring-primary-500/20 border-neutral-300'
            } text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-50`}
          />
        </div>

        <button
          type="button"
          onClick={handleCheckClick}
          disabled={isCheckButtonDisabled}
          className={`text-m rounded-r-md px-4 py-2 font-medium transition-colors ${
            isCheckButtonDisabled
              ? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
              : 'focus:ring-primary-500/20 bg-neutral-800 text-white focus:ring-2 active:bg-neutral-800'
          } focus:outline-none`}
        >
          {isChecking ? '확인중...' : '중복확인'}
        </button>
      </div>
      <p className={`m-2 min-h-[1.25rem] text-sm ${getMessageColor()}`}>
        {error ||
          (hasChecked && checkResult?.message) ||
          (hasChecked && isSameAsInitial ? '현재 닉네임과 동일합니다.' : '') ||
          ''}
      </p>
    </div>
  );
};

export default NicknameInput;
