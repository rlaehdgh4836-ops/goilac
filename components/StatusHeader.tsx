'use client';

import { FlexBox, Typography } from '@montage-ui/core';

import type { ReactNode } from 'react';

type StatusHeaderProps = {
  icon: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
};

/** 실패·완료 화면 상단의 아이콘 + 제목 영역 */
export default function StatusHeader({ icon, eyebrow, title, description }: StatusHeaderProps) {
  return (
    <FlexBox
      flexDirection="column"
      alignItems="center"
      gap="16px"
      sx={{ padding: '8px 0 0', textAlign: 'center' }}
    >
      {icon}
      <FlexBox flexDirection="column" alignItems="center" gap="6px">
        {eyebrow && (
          <Typography variant="label1" weight="bold" color="semantic.foreground.neutral.secondary">
            {eyebrow}
          </Typography>
        )}
        <Typography as="h1" variant="title3" weight="bold" sx={{ margin: 0, wordBreak: 'keep-all' }}>
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body1-reading"
            color="semantic.foreground.neutral.secondary"
            sx={{ wordBreak: 'keep-all' }}
          >
            {description}
          </Typography>
        )}
      </FlexBox>
    </FlexBox>
  );
}
