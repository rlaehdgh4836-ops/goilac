'use client';

import { Box, FlexBox, IconButton, Typography } from '@montage-ui/core';
import { IconChevronLeft, IconLock } from '@montage-ui/icon';

import type { ReactNode } from 'react';

export const HEADER_HEIGHT = 72;

const STEPS = [
  { key: 'order', label: '주문서 작성' },
  { key: 'payment', label: '결제' },
  { key: 'complete', label: '주문 완료' },
] as const;

type Step = (typeof STEPS)[number]['key'];

type PageLayoutProps = {
  title?: string;
  onBack?: () => void;
  step?: Step;
  /** wide: 2단 레이아웃(1200px), narrow: 가운데 정렬 단일 카드(640px) */
  width?: 'wide' | 'narrow';
  children: ReactNode;
};

export default function PageLayout({
  title,
  onBack,
  step = 'payment',
  width = 'wide',
  children,
}: PageLayoutProps) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: '100dvh',
        backgroundColor: theme.semantic.background.neutral.secondary,
      })}
    >
      <Box
        as="header"
        sx={(theme) => ({
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: HEADER_HEIGHT,
          backgroundColor: theme.semantic.background.neutral.primary,
          borderBottom: `1px solid ${theme.semantic.line.neutral.secondary}`,
        })}
      >
        <FlexBox
          alignItems="center"
          justifyContent="space-between"
          sx={{ maxWidth: 1200, height: '100%', margin: '0 auto', padding: '0 40px' }}
        >
          <FlexBox alignItems="center" gap="8px" sx={{ minWidth: 240 }}>
            {onBack && (
              <IconButton size="medium" onClick={onBack} aria-label="뒤로 가기">
                <IconChevronLeft />
              </IconButton>
            )}
            <Typography as="h1" variant="heading2" weight="bold" sx={{ margin: 0 }}>
              {title}
            </Typography>
          </FlexBox>

          <FlexBox as="ol" alignItems="center" gap="12px" sx={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {STEPS.map((item, index) => {
              const current = item.key === step;
              return (
                <FlexBox
                  as="li"
                  key={item.key}
                  alignItems="center"
                  gap="12px"
                  aria-current={current ? 'step' : undefined}
                >
                  {index > 0 && (
                    <Typography variant="label1" color="semantic.foreground.neutral.quaternary" aria-hidden>
                      ›
                    </Typography>
                  )}
                  <Typography
                    variant="label1"
                    weight={current ? 'bold' : 'medium'}
                    color={
                      current ? 'semantic.foreground.neutral.primary' : 'semantic.foreground.neutral.tertiary'
                    }
                  >
                    {index + 1}. {item.label}
                  </Typography>
                </FlexBox>
              );
            })}
          </FlexBox>

          <FlexBox alignItems="center" justifyContent="flex-end" gap="6px" sx={{ minWidth: 240 }}>
            <IconLock
              aria-hidden
              sx={(theme) => ({ fontSize: 16, color: theme.semantic.foreground.neutral.tertiary })}
            />
            <Typography variant="label2" color="semantic.foreground.neutral.tertiary">
              안전한 결제 환경
            </Typography>
          </FlexBox>
        </FlexBox>
      </Box>

      <Box
        as="main"
        sx={{
          maxWidth: width === 'wide' ? 1200 : 640,
          margin: '0 auto',
          padding: width === 'wide' ? '40px 40px 80px' : '64px 40px 80px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
