'use client';

import { ActionArea, ActionAreaButton, FlexBox, SectionMessage, Typography } from '@montage-ui/core';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import OrderSummary from '@/components/OrderSummary';
import PageLayout from '@/components/PageLayout';
import PaymentMethodList from '@/components/PaymentMethodList';
import { useCheckout } from '@/lib/checkout-store';
import { FAILURE_REASONS } from '@/lib/failure-reasons';
import { ORDER, PAYMENT_METHODS, formatWon, getPaymentMethod } from '@/lib/mock-data';

const NEXT_ROUTE = {
  idle: '/checkout',
  processing: '/checkout/processing',
  success: '/checkout/complete',
} as const;

export default function ChangeMethodPage() {
  const router = useRouter();
  const { hydrated, status, lastFailure, startPayment } = useCheckout();
  const failedMethodId = lastFailure?.methodId;

  // 실패한 결제수단은 목록 맨 아래로 내리고, 나머지 저장된 결제수단은 그대로 보여준다.
  const methods = [
    ...PAYMENT_METHODS.filter((m) => m.id !== failedMethodId),
    ...PAYMENT_METHODS.filter((m) => m.id === failedMethodId),
  ];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const value = selectedId ?? methods[0].id;
  const selected = getPaymentMethod(value);

  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!hydrated || status === 'failed') return;
    router.replace(NEXT_ROUTE[status]);
  }, [hydrated, status, router]);

  if (!hydrated || status !== 'failed' || !lastFailure) return <PageLayout>{null}</PageLayout>;

  const reason = FAILURE_REASONS[lastFailure.code];
  const failedMethod = getPaymentMethod(failedMethodId);
  const pickedFailed = value === failedMethodId;

  const handlePay = () => {
    if (submittingRef.current || !selected) return;
    submittingRef.current = true;
    setSubmitting(true);
    startPayment(selected.id);
  };

  return (
    <PageLayout
      title="다른 결제수단 선택"
      onBack={() => router.back()}
      bottom={
        <ActionArea background caption={selected ? `${selected.name}(으)로 결제해요` : undefined}>
          <ActionAreaButton onClick={handlePay} loading={submitting} disabled={!selected}>
            {formatWon(ORDER.totalAmount)} 결제하기
          </ActionAreaButton>
        </ActionArea>
      }
    >
      <FlexBox flexDirection="column" gap="24px">
        <SectionMessage
          variant="cautionary"
          description={`${failedMethod?.name ?? '이전 결제수단'} 결제가 '${reason.label}'(으)로 실패했어요. 주문 정보는 그대로예요.`}
        >
          결제수단만 바꾸면 바로 결제돼요
        </SectionMessage>

        <FlexBox flexDirection="column" gap="12px">
          <Typography variant="headline1" weight="bold">
            결제수단
          </Typography>
          <PaymentMethodList
            methods={methods}
            value={value}
            onChange={setSelectedId}
            failedMethodId={failedMethodId}
            disabled={submitting}
          />
          {pickedFailed && reason.persistsOnSameMethod && (
            <Typography variant="caption1" color="semantic.foreground.negative.primary">
              방금 {reason.label}(으)로 실패한 결제수단이에요. 문제를 해결하지 않았다면 다시 실패할 수 있어요.
            </Typography>
          )}
        </FlexBox>

        <FlexBox flexDirection="column" gap="12px">
          <Typography variant="headline1" weight="bold">
            주문 상품
          </Typography>
          <OrderSummary />
        </FlexBox>
      </FlexBox>
    </PageLayout>
  );
}
