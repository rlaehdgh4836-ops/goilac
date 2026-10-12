'use client';

import { FlexBox, Typography } from '@montage-ui/core';

import type { SxProp } from '@montage-ui/core';
import type { ReactNode } from 'react';

type PanelProps = {
  title?: string;
  trailing?: ReactNode;
  children: ReactNode;
  sx?: SxProp;
};

/** 데스크탑 화면의 흰색 콘텐츠 카드 */
export default function Panel({ title, trailing, children, sx }: PanelProps) {
  return (
    <FlexBox
      as="section"
      flexDirection="column"
      gap="20px"
      sx={[
        (theme) => ({
          padding: 32,
          borderRadius: 16,
          backgroundColor: theme.semantic.background.neutral.primary,
          border: `1px solid ${theme.semantic.line.neutral.secondary}`,
        }),
        sx,
      ]}
    >
      {(title || trailing) && (
        <FlexBox alignItems="center" justifyContent="space-between">
          {title && (
            <Typography as="h2" variant="heading2" weight="bold" sx={{ margin: 0 }}>
              {title}
            </Typography>
          )}
          {trailing}
        </FlexBox>
      )}
      {children}
    </FlexBox>
  );
}
