'use client';

import { SectionMessage, Typography } from '@montage-ui/core';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import CheckoutLayout from '@/components/CheckoutLayout';
import PageLayout from '@/components/PageLayout';
import Panel from '@/components/Panel';
import PaymentMethodList from '@/components/PaymentMethodList';
import { useCheckout } from '@/lib/checkout-store';
import { FAILURE_REASONS } from '@/lib/failure-reasons';
import { PAYMENT_METHODS, getPaymentMethod } from '@/lib/mock-data';

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

  if (!hydrated || status !== 'failed' || !lastFailure) {
    return <PageLayout title="다른 결제수단 선택">{null}</PageLayout>;
  }

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
    <PageLayout title="다른 결제수단 선택" onBack={() => router.back()}>
      <CheckoutLayout
        onPay={handlePay}
        payDisabled={!selected}
        paying={submitting}
        caption={selected ? `${selected.name}(으)로 결제해요` : undefined}
      >
        <SectionMessage
          variant="cautionary"
          description={`${failedMethod?.name ?? '이전 결제수단'} 결제가 '${reason.label}'(으)로 실패했어요. 주문 정보는 그대로예요.`}
        >
          결제수단만 바꾸면 바로 결제돼요
        </SectionMessage>

        <Panel title="결제수단">
          <PaymentMethodList
            methods={methods}
            value={value}
            onChange={setSelectedId}
            failedMethodId={failedMethodId}
            disabled={submitting}
          />
          {pickedFailed && reason.persistsOnSameMethod && (
            <Typography variant="label2" color="semantic.foreground.negative.primary">
              방금 {reason.label}(으)로 실패한 결제수단이에요. 문제를 해결하지 않았다면 다시 실패할 수 있어요.
            </Typography>
          )}
        </Panel>
      </CheckoutLayout>
    </PageLayout>
  );
}
