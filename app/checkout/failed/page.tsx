'use client';

import { ActionArea, ActionAreaButton, FlexBox, SectionMessage, Typography } from '@montage-ui/core';
import { IconCircleExclamationFill } from '@montage-ui/icon';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import InfoRows from '@/components/InfoRows';
import PageLayout from '@/components/PageLayout';
import StatusHeader from '@/components/StatusHeader';
import { useCheckout } from '@/lib/checkout-store';
import { FAILURE_REASONS } from '@/lib/failure-reasons';
import { ORDER, formatWon, getPaymentMethod } from '@/lib/mock-data';

import type { RecoveryAction } from '@/lib/failure-reasons';

const NEXT_ROUTE = {
  idle: '/checkout',
  processing: '/checkout/processing',
  success: '/checkout/complete',
} as const;

export default function FailedPage() {
  const router = useRouter();
  const { hydrated, status, lastFailure, attempts, startPayment } = useCheckout();

  useEffect(() => {
    if (!hydrated || status === 'failed') return;
    router.replace(NEXT_ROUTE[status]);
  }, [hydrated, status, router]);

  if (!hydrated || status !== 'failed' || !lastFailure) return <PageLayout>{null}</PageLayout>;

  const reason = FAILURE_REASONS[lastFailure.code];
  const failedMethod = getPaymentMethod(lastFailure.methodId);

  const actions: Record<RecoveryAction, { label: string; onClick: () => void }> = {
    retry: {
      label: failedMethod ? `${failedMethod.name}(으)로 다시 결제하기` : '다시 결제하기',
      onClick: () => startPayment(lastFailure.methodId),
    },
    change_method: {
      label: '다른 결제수단 선택',
      onClick: () => router.push('/checkout/change-method'),
    },
  };
  const primary = reason.primaryAction;
  const secondary: RecoveryAction = primary === 'retry' ? 'change_method' : 'retry';

  return (
    <PageLayout
      title="결제 실패"
      onBack={() => router.replace('/checkout')}
      bottom={
        <ActionArea background>
          <ActionAreaButton variant="main" onClick={actions[primary].onClick}>
            {actions[primary].label}
          </ActionAreaButton>
          <ActionAreaButton variant="alternative" onClick={actions[secondary].onClick}>
            {actions[secondary].label}
          </ActionAreaButton>
        </ActionArea>
      }
    >
      <FlexBox flexDirection="column" gap="24px">
        <StatusHeader
          icon={
            <IconCircleExclamationFill
              aria-hidden
              sx={(theme) => ({ fontSize: 56, color: theme.semantic.foreground.negative.primary })}
            />
          }
          eyebrow="결제에 실패했어요"
          title={reason.title}
          description={reason.description}
        />

        {reason.notCharged && (
          <SectionMessage variant="positive" description="결제 금액은 청구되지 않았어요. 안심하고 다시 시도해 주세요.">
            실제로 결제되지 않았어요
          </SectionMessage>
        )}

        <SectionMessage variant="info" description={reason.guide}>
          이렇게 해결할 수 있어요
        </SectionMessage>

        <FlexBox flexDirection="column" gap="12px">
          <Typography variant="headline2" weight="bold">
            결제 시도 정보
          </Typography>
          <InfoRows
            rows={[
              { label: '결제수단', value: failedMethod?.name ?? '-' },
              { label: '결제 금액', value: formatWon(ORDER.totalAmount) },
              { label: '실패 사유', value: reason.label },
              ...(attempts > 1 ? [{ label: '시도 횟수', value: `${attempts}회` }] : []),
            ]}
          />
          <Typography variant="caption1" color="semantic.foreground.neutral.tertiary">
            주문 정보는 그대로 유지돼요. 결제수단만 다시 선택하면 바로 결제할 수 있어요.
          </Typography>
        </FlexBox>
      </FlexBox>
    </PageLayout>
  );
}
