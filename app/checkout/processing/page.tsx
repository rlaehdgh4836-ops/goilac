'use client';

import { FlexBox, Loading, Typography } from '@montage-ui/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import PageLayout from '@/components/PageLayout';
import Panel from '@/components/Panel';
import { useCheckout } from '@/lib/checkout-store';
import { ORDER, formatWon, getPaymentMethod } from '@/lib/mock-data';
import { PROCESSING_DELAY_MS, resolvePayment } from '@/lib/mock-pay';

const NEXT_ROUTE = {
  idle: '/checkout',
  failed: '/checkout/failed',
  success: '/checkout/complete',
} as const;

export default function ProcessingPage() {
  const router = useRouter();
  const { hydrated, status, scenario, selectedMethodId, lastFailure, finishPayment } = useCheckout();
  const method = getPaymentMethod(selectedMethodId);

  // 결과가 나오면 처리 중 화면이 히스토리에 남지 않도록 replace로 이동한다.
  useEffect(() => {
    if (!hydrated || status === 'processing') return;
    router.replace(NEXT_ROUTE[status]);
  }, [hydrated, status, router]);

  useEffect(() => {
    if (!hydrated || status !== 'processing') return;
    const timer = setTimeout(() => {
      finishPayment(resolvePayment({ scenario, methodId: selectedMethodId, lastFailure }));
    }, PROCESSING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hydrated, status, scenario, selectedMethodId, lastFailure, finishPayment]);

  // 처리 중 새로고침·창 닫기를 한 번 더 확인한다.
  useEffect(() => {
    if (status !== 'processing') return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [status]);

  return (
    <PageLayout title="결제하기" width="narrow">
      <Panel sx={{ minHeight: 440, justifyContent: 'center' }}>
        <FlexBox
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex={1}
          gap="24px"
          role="status"
          aria-live="polite"
          sx={{ textAlign: 'center' }}
        >
          <Loading variant="circular" size="48px" />
          <FlexBox flexDirection="column" gap="8px" alignItems="center">
            <Typography variant="title3" weight="bold">
              결제를 처리하고 있어요
            </Typography>
            <Typography variant="body1-reading" color="semantic.foreground.neutral.secondary">
              잠시만 기다려 주세요.
              <br />
              창을 닫거나 새로고침하면 결제가 중단될 수 있어요.
            </Typography>
          </FlexBox>
          {method && (
            <Typography variant="label1" color="semantic.foreground.neutral.tertiary">
              {method.name} · {formatWon(ORDER.totalAmount)}
            </Typography>
          )}
        </FlexBox>
      </Panel>
    </PageLayout>
  );
}
