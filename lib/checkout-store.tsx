'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_METHOD_ID } from './mock-data';
import { createOrderNumber } from './mock-pay';

import type { FailureCode, Scenario } from './failure-reasons';
import type { PayResult } from './mock-pay';
import type { PropsWithChildren } from 'react';

export type CheckoutStatus = 'idle' | 'processing' | 'failed' | 'success';

export type CheckoutState = {
  status: CheckoutStatus;
  selectedMethodId: string;
  scenario: Scenario;
  attempts: number;
  lastFailure: { code: FailureCode; methodId: string } | null;
  receipt: { orderNumber: string; paidAt: string; methodId: string } | null;
};

const INITIAL_STATE: CheckoutState = {
  status: 'idle',
  selectedMethodId: DEFAULT_METHOD_ID,
  scenario: 'insufficient_balance',
  attempts: 0,
  lastFailure: null,
  receipt: null,
};

const STORAGE_KEY = 'checkout-state';

type CheckoutContextValue = CheckoutState & {
  hydrated: boolean;
  selectMethod: (methodId: string) => void;
  setScenario: (scenario: Scenario) => void;
  startPayment: (methodId: string) => void;
  finishPayment: (result: PayResult) => void;
  reset: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<CheckoutState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  // 새로고침해도 진행 중인 흐름을 이어갈 수 있도록 sessionStorage에 보관한다.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 브라우저 저장소는 마운트 후에만 읽을 수 있다
      if (saved) setState({ ...INITIAL_STATE, ...JSON.parse(saved) });
    } catch {
      // 저장소를 쓸 수 없으면 초기 상태로 진행한다.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 무시
    }
  }, [state, hydrated]);

  const selectMethod = useCallback((selectedMethodId: string) => {
    setState((prev) => ({ ...prev, selectedMethodId }));
  }, []);

  const setScenario = useCallback((scenario: Scenario) => {
    setState((prev) => ({ ...prev, scenario }));
  }, []);

  const startPayment = useCallback((methodId: string) => {
    setState((prev) => ({
      ...prev,
      status: 'processing',
      selectedMethodId: methodId,
      attempts: prev.attempts + 1,
    }));
  }, []);

  const finishPayment = useCallback((result: PayResult) => {
    setState((prev) => {
      if (prev.status !== 'processing') return prev;
      if (result.ok) {
        return {
          ...prev,
          status: 'success',
          receipt: {
            orderNumber: createOrderNumber(),
            paidAt: new Date().toISOString(),
            methodId: prev.selectedMethodId,
          },
        };
      }
      return {
        ...prev,
        status: 'failed',
        lastFailure: { code: result.code, methodId: prev.selectedMethodId },
      };
    });
  }, []);

  const reset = useCallback(() => {
    // 데모 설정과 마지막으로 고른 결제수단은 유지한다.
    setState((prev) => ({
      ...INITIAL_STATE,
      scenario: prev.scenario,
      selectedMethodId: prev.selectedMethodId,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      selectMethod,
      setScenario,
      startPayment,
      finishPayment,
      reset,
    }),
    [state, hydrated, selectMethod, setScenario, startPayment, finishPayment, reset],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within CheckoutProvider');
  return context;
}
