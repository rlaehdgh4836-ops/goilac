'use client';

import { Box, FlexBox, TopNavigation, TopNavigationButton } from '@montage-ui/core';

import type { ReactNode } from 'react';

type PageLayoutProps = {
  title?: string;
  onBack?: () => void;
  /** 하단 고정 영역 (ActionArea) */
  bottom?: ReactNode;
  children: ReactNode;
};

export default function PageLayout({ title, onBack, bottom, children }: PageLayoutProps) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: '100dvh',
        backgroundColor: theme.semantic.background.neutral.secondary,
      })}
    >
      <FlexBox
        flexDirection="column"
        sx={(theme) => ({
          maxWidth: 480,
          minHeight: '100dvh',
          margin: '0 auto',
          backgroundColor: theme.semantic.background.neutral.primary,
        })}
      >
        {(title || onBack) && (
          <TopNavigation
            sx={{ position: 'sticky', top: 0, zIndex: 10 }}
            leadingContent={
              onBack ? <TopNavigationButton variant="back-button" onClick={onBack} /> : undefined
            }
          >
            {title}
          </TopNavigation>
        )}
        <FlexBox flexDirection="column" flex={1} sx={{ padding: '8px 20px 32px' }}>
          {children}
        </FlexBox>
        {bottom && <Box sx={{ position: 'sticky', bottom: 0, zIndex: 10 }}>{bottom}</Box>}
      </FlexBox>
    </Box>
  );
}
