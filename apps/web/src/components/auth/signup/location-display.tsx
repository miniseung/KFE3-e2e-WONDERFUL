'use client';

import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

const SignupKakaoMap = dynamic(
  () => import('@/components/auth/signup').then((mod) => ({ default: mod.SignupKakaoMap })),
  {
    loading: () => (
      <div
        className="flex w-full items-center justify-center rounded-[10px] bg-white"
        style={{ height: '130px' }}
      >
        <div className="text-center">
          <div className="border-primary-500 mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-sm text-neutral-600">지도를 불러오는 중...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);
import { Button } from '@/components/ui/button';

import { useGeolocation } from '@/hooks/common/useGeolocation';

import { convertCoordinatesToAddress } from '@/lib/api/kakao';

interface LocationDisplayProps {
  showAddressText?: boolean; // 주소 텍스트 표시 (기본 true)
  mapHeight?: string | number; // 지도 높이
  className?: string; // 추가 CSS 클래스
}

const LocationDisplay = ({
  showAddressText = true,
  mapHeight = '130px',
  className = '',
}: LocationDisplayProps) => {
  const { location, error, isLoading, retry } = useGeolocation();
  const [address, setAddress] = useState<string>('');
  const [addressLoading, setAddressLoading] = useState(false);

  // 카카오 REST API를 사용한 좌표 → 주소 변환
  useEffect(() => {
    if (!location || !showAddressText) return;

    const fetchAddress = async () => {
      setAddressLoading(true);
      console.log('🔍 주소 변환 시작:', {
        latitude: location.latitude,
        longitude: location.longitude,
      });

      try {
        const addressResult = await convertCoordinatesToAddress(
          location.longitude,
          location.latitude
        );

        console.log('주소 변환 성공:', addressResult);
        setAddress(addressResult);
      } catch (error) {
        console.error('주소 변환 실패:', error);
        setAddress('주소 변환 실패');
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddress();
  }, [location, showAddressText]);

  // 전체 로딩 상태 체크
  const isLocationLoading = isLoading || (showAddressText && addressLoading);

  return (
    <div className={`rounded-lg bg-neutral-100 ${className}`}>
      {location && !isLocationLoading && !error ? (
        <div className="relative p-2 pb-0">
          <SignupKakaoMap
            location={location}
            height={mapHeight}
            width="100%"
            level={3}
            showMarker={true}
            showInfoWindow={false}
            className="rounded-[10px] border-0"
          />
        </div>
      ) : (
        <div className="p-2 pb-0">
          <div
            className="flex w-full items-center justify-center rounded-[10px] bg-white"
            style={{ height: mapHeight }}
          >
            <div className="text-center">
              {isLocationLoading ? (
                <>
                  <div className="border-primary-500 mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <p className="text-sm text-neutral-600">
                    {isLoading ? '위치를 가져오는 중...' : '주소를 확인하는 중...'}
                  </p>
                </>
              ) : error ? (
                <span className="text-danger-600 text-sm">지도를 불러올 수 없습니다</span>
              ) : (
                <span className="text-sm text-neutral-500">지도를 불러올 수 없습니다</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-2">
        <div className="rounded-[10px] bg-white p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-black">Home</h3>
          </div>

          <div>
            {isLocationLoading && <p className="text-sm text-neutral-500">위치 확인 중...</p>}
            {error && <p className="text-danger-600 text-sm">위치 확인 실패</p>}
            {location && !isLocationLoading && !error && (
              <p className="text-sm text-neutral-700">{address || '주소 확인 중...'}</p>
            )}
          </div>

          {error && (
            <div className="mt-3">
              <Button onClick={retry} size="sm" color="primary" className="text-xs">
                다시 시도
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;
