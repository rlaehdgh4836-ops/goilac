'use client';

import { FlexBox, Typography } from '@montage-ui/core';

import type { ReactNode } from 'react';

/** 라벨-값 형태의 정보 목록 (결제 시도 정보, 완료 영수증 등) */
export default function InfoRows({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <FlexBox
      as="dl"
      flexDirection="column"
      gap="12px"
      sx={(theme) => ({
        margin: 0,
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.semantic.background.neutral.secondary,
      })}
    >
      {rows.map((row) => (
        <FlexBox key={row.label} justifyContent="space-between" alignItems="baseline" gap="16px">
          <Typography as="dt" variant="label1" color="semantic.foreground.neutral.secondary" sx={{ flexShrink: 0 }}>
            {row.label}
          </Typography>
          <Typography as="dd" variant="label1" weight="medium" align="right" sx={{ margin: 0 }}>
            {row.value}
          </Typography>
        </FlexBox>
      ))}
    </FlexBox>
  );
}
