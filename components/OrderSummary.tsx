'use client';

import { Divider, FlexBox, Typography } from '@montage-ui/core';

import { ORDER, formatWon } from '@/lib/mock-data';

export default function OrderSummary() {
  return (
    <FlexBox
      flexDirection="column"
      gap="12px"
      sx={(theme) => ({
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.semantic.background.neutral.secondary,
      })}
    >
      <FlexBox flexDirection="column" gap="2px">
        <Typography variant="body1" weight="bold">
          {ORDER.productName}
        </Typography>
        <Typography variant="label1" color="semantic.foreground.neutral.secondary">
          {ORDER.option}
        </Typography>
      </FlexBox>
      <Divider />
      <SummaryRow label="상품 금액" value={formatWon(ORDER.productPrice)} />
      <SummaryRow label="배송비" value={ORDER.shippingFee === 0 ? '무료' : formatWon(ORDER.shippingFee)} />
      <FlexBox justifyContent="space-between" alignItems="center">
        <Typography variant="body1" weight="bold">
          최종 결제 금액
        </Typography>
        <Typography variant="heading2" weight="bold" color="semantic.foreground.brand.primary">
          {formatWon(ORDER.totalAmount)}
        </Typography>
      </FlexBox>
    </FlexBox>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <FlexBox justifyContent="space-between">
      <Typography variant="label1" color="semantic.foreground.neutral.secondary">
        {label}
      </Typography>
      <Typography variant="label1">{value}</Typography>
    </FlexBox>
  );
}
