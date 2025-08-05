'use client';

import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

const KakaoMap = dynamic(() => import('@/components/location/kakao-map'), {
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-gray-100">
      <div className="text-center">
        <div className="border-primary-500 mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <p className="text-gray-600">지도를 불러오는 중...</p>
      </div>
    </div>
  ),
  ssr: false,
});
import SearchInput from '@/components/location/search-input';
import { Button } from '@/components/ui/button';

import { searchAddressByKeyword, convertCoordinatesToAddress } from '@/lib/api/kakao';
import type { UserLocation } from '@/lib/types/location';

interface MapLocationPickerProps {
  currentLocation: UserLocation | null;
  onLocationSelect: (location: UserLocation, address: string) => void;
  onClose: () => void;
}

const MapLocationPicker = ({
  currentLocation,
  onLocationSelect,
  onClose,
}: MapLocationPickerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(currentLocation);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [mapSearchTerm, setMapSearchTerm] = useState('');
  const [isMapSearching, setIsMapSearching] = useState(false);

  const handleLocationSelect = async (location: UserLocation) => {
    setSelectedLocation(location);

    try {
      const address = await convertCoordinatesToAddress(location.longitude, location.latitude);
      setSelectedAddress(address);
    } catch (error) {
      console.error('주소 변환 실패:', error);
      setSelectedAddress('주소 확인 실패');
    }
  };

  const handleMapSearch = async () => {
    if (!mapSearchTerm.trim()) return;

    setIsMapSearching(true);
    try {
      const results = await searchAddressByKeyword(mapSearchTerm);

      if (results.length > 0 && results[0]) {
        const firstResult = results[0];
        const newLocation = {
          latitude: firstResult.latitude,
          longitude: firstResult.longitude,
        };

        setSelectedLocation(newLocation);
        setSelectedAddress(firstResult.display_name);
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('지도 검색 실패:', error);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsMapSearching(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && selectedAddress) {
      onLocationSelect(selectedLocation, selectedAddress);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      handleLocationSelect(currentLocation);
    }
  }, [currentLocation]);

  if (!currentLocation) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">지도에서 위치 선택</h2>
          <div className="w-8"></div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-600">현재 위치를 확인할 수 없습니다.</p>
            <Button onClick={onClose} size="medium" color="secondary" className="mt-4">
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">지도에서 위치 선택</h2>
        <div className="w-8"></div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1">
        <KakaoMap
          location={selectedLocation || currentLocation}
          onLocationSelect={handleLocationSelect}
          height="100%"
          level={3}
        />
      </div>

      {/* 검색 및 확인 영역 */}
      <div className="border-t border-neutral-200 bg-neutral-50 p-4">
        <SearchInput
          value={mapSearchTerm}
          onChange={setMapSearchTerm}
          onSearch={handleMapSearch}
          placeholder="동명으로 검색 (ex. 서초동, 역삼동)"
          isSearching={isMapSearching}
          className="mb-3"
        />

        <Button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          size="medium"
          color={selectedLocation ? 'primary' : 'disabled'}
          fullWidth={true}
        >
          선택된 위치로 저장하기
        </Button>
      </div>
    </div>
  );
};

export default MapLocationPicker;
