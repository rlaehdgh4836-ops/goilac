'use client';

import { FlexBox, Option, Select, Typography } from '@montage-ui/core';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import CheckoutLayout from '@/components/CheckoutLayout';
import PageLayout from '@/components/PageLayout';
import Panel from '@/components/Panel';
import PaymentMethodList from '@/components/PaymentMethodList';
import { useCheckout } from '@/lib/checkout-store';
import { SCENARIO_OPTIONS } from '@/lib/failure-reasons';
import { PAYMENT_METHODS, getPaymentMethod } from '@/lib/mock-data';

import type { Scenario } from '@/lib/failure-reasons';

export default function CheckoutPage() {
  const router = useRouter();
  const checkout = useCheckout();
  const { hydrated, status, reset } = checkout;
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // 새 결제 화면에 들어오면 이전 흐름(실패·완료 등)을 정리한다.
  useEffect(() => {
    if (hydrated && status !== 'idle' && !submittingRef.current) reset();
  }, [hydrated, status, reset]);

  const selectedMethod = getPaymentMethod(checkout.selectedMethodId);

  const handlePay = () => {
    // 상태 반영 전 빠른 연속 클릭도 막는다.
    if (submittingRef.current || !selectedMethod) return;
    submittingRef.current = true;
    setSubmitting(true);
    checkout.startPayment(selectedMethod.id);
    router.push('/checkout/processing');
  };

  return (
    <PageLayout title="결제하기">
      <CheckoutLayout
        onPay={handlePay}
        payDisabled={!selectedMethod || !hydrated}
        paying={submitting}
        caption={selectedMethod ? `${selectedMethod.name}(으)로 결제해요` : '결제수단을 선택해 주세요'}
      >
        <Panel title="결제수단">
          <PaymentMethodList
            methods={PAYMENT_METHODS}
            value={checkout.selectedMethodId}
            onChange={checkout.selectMethod}
            disabled={submitting}
          />
        </Panel>

        <FlexBox
          flexDirection="column"
          gap="10px"
          sx={(theme) => ({
            padding: 24,
            borderRadius: 16,
            border: `1px dashed ${theme.semantic.line.neutral.primary}`,
          })}
        >
          <Typography variant="label1" weight="bold" color="semantic.foreground.neutral.secondary">
            데모 · 결제 결과 시뮬레이션
          </Typography>
          <FlexBox alignItems="center" gap="16px">
            <Select
              size="medium"
              width={280}
              value={checkout.scenario}
              onChange={(value) => checkout.setScenario(value as Scenario)}
              disabled={submitting}
            >
              {SCENARIO_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Typography variant="caption1" color="semantic.foreground.neutral.tertiary" sx={{ flex: 1 }}>
              첫 결제 시도의 결과예요. 잔액·한도·카드 문제는 같은 결제수단으로 다시 시도하면 또 실패하고, 다른
              결제수단으로 바꾸면 성공해요.
            </Typography>
          </FlexBox>
        </FlexBox>
      </CheckoutLayout>
    </PageLayout>
  );
}
