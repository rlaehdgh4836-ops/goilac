'use client';

import { ActionArea, ActionAreaButton, FlexBox, Option, Select, Typography } from '@montage-ui/core';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import OrderSummary from '@/components/OrderSummary';
import PageLayout from '@/components/PageLayout';
import PaymentMethodList from '@/components/PaymentMethodList';
import { useCheckout } from '@/lib/checkout-store';
import { SCENARIO_OPTIONS } from '@/lib/failure-reasons';
import { ORDER, PAYMENT_METHODS, formatWon, getPaymentMethod } from '@/lib/mock-data';

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
    <PageLayout
      title="결제하기"
      bottom={
        <ActionArea background
          caption={selectedMethod ? `${selectedMethod.name}(으)로 결제해요` : '결제수단을 선택해 주세요'}
        >
          <ActionAreaButton
            onClick={handlePay}
            disabled={!selectedMethod || !hydrated}
            loading={submitting}
          >
            {formatWon(ORDER.totalAmount)} 결제하기
          </ActionAreaButton>
        </ActionArea>
      }
    >
      <FlexBox flexDirection="column" gap="28px">
        <Section title="주문 상품">
          <OrderSummary />
        </Section>

        <Section title="결제수단">
          <PaymentMethodList
            methods={PAYMENT_METHODS}
            value={checkout.selectedMethodId}
            onChange={checkout.selectMethod}
            disabled={submitting}
          />
        </Section>

        <FlexBox
          flexDirection="column"
          gap="8px"
          sx={(theme) => ({
            padding: 16,
            borderRadius: 12,
            border: `1px dashed ${theme.semantic.line.neutral.primary}`,
          })}
        >
          <Typography variant="label1" weight="bold" color="semantic.foreground.neutral.secondary">
            데모 · 결제 결과 시뮬레이션
          </Typography>
          <Select
            size="medium"
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
          <Typography variant="caption1" color="semantic.foreground.neutral.tertiary">
            첫 결제 시도의 결과예요. 잔액·한도·카드 문제는 같은 결제수단으로 다시 시도하면 또
            실패하고, 다른 결제수단으로 바꾸면 성공해요.
          </Typography>
        </FlexBox>
      </FlexBox>
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <FlexBox flexDirection="column" gap="12px">
      <Typography variant="headline1" weight="bold">
        {title}
      </Typography>
      {children}
    </FlexBox>
  );
}
