'use client';

import { Box, Button, FlexBox, Typography } from '@montage-ui/core';

import OrderSummary from '@/components/OrderSummary';
import Panel from '@/components/Panel';
import { HEADER_HEIGHT } from '@/components/PageLayout';
import { ORDER, formatWon } from '@/lib/mock-data';

import type { ReactNode } from 'react';

type CheckoutLayoutProps = {
  children: ReactNode;
  /** 결제 버튼 아래 안내 문구 */
  caption?: string;
  onPay: () => void;
  payDisabled?: boolean;
  paying?: boolean;
};

/** 왼쪽: 결제수단 등 본문 / 오른쪽: 스크롤해도 따라오는 결제 금액 + 결제 버튼 */
export default function CheckoutLayout({
  children,
  caption,
  onPay,
  payDisabled,
  paying,
}: CheckoutLayoutProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 400px',
        gap: 32,
        alignItems: 'start',
      }}
    >
      <FlexBox flexDirection="column" gap="24px">
        {children}
      </FlexBox>

      <Box as="aside" sx={{ position: 'sticky', top: HEADER_HEIGHT + 40 }}>
        <Panel title="결제 금액">
          <OrderSummary />
          <FlexBox flexDirection="column" gap="12px">
            <Button size="large" fullWidth onClick={onPay} disabled={payDisabled} loading={paying}>
              {formatWon(ORDER.totalAmount)} 결제하기
            </Button>
            {caption && (
              <Typography variant="label2" align="center" color="semantic.foreground.neutral.tertiary">
                {caption}
              </Typography>
            )}
          </FlexBox>
        </Panel>
      </Box>
    </Box>
  );
}
