'use client';

import { useState, useEffect } from 'react';

import { SEARCH_HISTORY_STORAGE_KEY, SEARCH_HISTORY_MAX_SIZE } from '@/lib/constants/search';
import { SearchHistoryItem } from '@/lib/types/search';

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // 초기 로드
  useEffect(() => {
    loadHistory();
  }, []);

  // 로컬스토리지에서 검색 기록 불러오기
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SearchHistoryItem[];
        // 최신순으로 정렬
        const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(sorted);
      }
    } catch (error) {
      console.error('검색 기록 로드 실패:', error);
      setHistory([]);
    }
  };

  // 로컬스토리지에 검색 기록 저장
  const saveHistory = (newHistory: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('검색 기록 저장 실패:', error);
    }
  };

  // 새 검색어 추가
  const addSearchQuery = (query: string) => {
    if (!query.trim()) return;

    const trimmedQuery = query.trim();
    const now = Date.now();

    // localStorage에서 최신 데이터 가져오기
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
      const currentHistory = stored ? (JSON.parse(stored) as SearchHistoryItem[]) : [];

      // 기존 기록에서 중복 제거
      const filteredHistory = currentHistory.filter(
        (item) => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
      );

      // 새 항목 추가
      const newItem: SearchHistoryItem = {
        id: `search_${now}_${Math.random().toString(36).substr(2, 9)}`,
        query: trimmedQuery,
        timestamp: now,
      };

      // 최대 개수 제한하여 새 배열 생성
      const newHistory = [newItem, ...filteredHistory].slice(0, SEARCH_HISTORY_MAX_SIZE);

      saveHistory(newHistory);
    } catch (error) {
      console.error('검색 기록 추가 실패:', error);
    }
  };

  // 특정 검색어 삭제
  const removeSearchQuery = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    saveHistory(newHistory);
  };

  // 모든 검색 기록 삭제
  const clearAllHistory = () => {
    try {
      localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('검색 기록 전체 삭제 실패:', error);
    }
  };

  return {
    history,
    addSearchQuery,
    removeSearchQuery,
    clearAllHistory,
    loadHistory,
  };
};
