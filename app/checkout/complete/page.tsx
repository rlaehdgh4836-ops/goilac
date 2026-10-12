'use client';

import { Button, FlexBox, Typography } from '@montage-ui/core';
import { IconCircleCheckFill } from '@montage-ui/icon';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import InfoRows from '@/components/InfoRows';
import PageLayout from '@/components/PageLayout';
import Panel from '@/components/Panel';
import StatusHeader from '@/components/StatusHeader';
import { useCheckout } from '@/lib/checkout-store';
import { ORDER, formatWon, getPaymentMethod } from '@/lib/mock-data';

const NEXT_ROUTE = {
  idle: '/checkout',
  processing: '/checkout/processing',
  failed: '/checkout/failed',
} as const;

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function CompletePage() {
  const router = useRouter();
  const { hydrated, status, receipt, attempts } = useCheckout();

  useEffect(() => {
    if (!hydrated || status === 'success') return;
    router.replace(NEXT_ROUTE[status]);
  }, [hydrated, status, router]);

  if (!hydrated || status !== 'success' || !receipt) {
    return (
      <PageLayout title="주문 완료" step="complete" width="narrow">
        {null}
      </PageLayout>
    );
  }

  const method = getPaymentMethod(receipt.methodId);

  return (
    <PageLayout title="주문 완료" step="complete" width="narrow">
      <Panel sx={{ padding: '48px 48px 40px', gap: 28 }}>
        <StatusHeader
          icon={
            <IconCircleCheckFill
              aria-hidden
              sx={(theme) => ({ fontSize: 64, color: theme.semantic.foreground.positive.primary })}
            />
          }
          title="결제가 완료되었어요"
          description={
            attempts > 1 ? '결제수단 문제를 해결하고 결제를 마쳤어요.' : '주문이 정상적으로 접수되었어요.'
          }
        />

        <FlexBox flexDirection="column" gap="12px">
          <Typography variant="headline2" weight="bold">
            결제 정보
          </Typography>
          <InfoRows
            rows={[
              { label: '주문번호', value: receipt.orderNumber },
              { label: '상품', value: ORDER.productName },
              {
                label: '결제 금액',
                value: (
                  <Typography
                    as="span"
                    variant="body1"
                    weight="bold"
                    color="semantic.foreground.brand.primary"
                  >
                    {formatWon(ORDER.totalAmount)}
                  </Typography>
                ),
              },
              { label: '결제수단', value: method?.name ?? '-' },
              { label: '결제 일시', value: dateFormatter.format(new Date(receipt.paidAt)) },
            ]}
          />
        </FlexBox>

        {/* 상태 초기화는 결제 화면 진입 시 처리된다 */}
        <Button size="large" fullWidth onClick={() => router.replace('/checkout')}>
          확인
        </Button>
      </Panel>
    </PageLayout>
  );
}
