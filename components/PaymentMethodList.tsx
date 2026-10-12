'use client';

import { Box, ContentBadge, FlexBox, RadioGroup, RadioGroupItem, Typography } from '@montage-ui/core';

import type { PaymentMethod, PaymentMethodType } from '@/lib/mock-data';

type PaymentMethodListProps = {
  methods: PaymentMethod[];
  value: string;
  onChange: (methodId: string) => void;
  /** 방금 결제에 실패한 결제수단. 배지로 표시한다. */
  failedMethodId?: string;
  disabled?: boolean;
};

const GROUP_LABEL: Record<PaymentMethodType, string> = {
  card: '카드',
  easy: '간편결제',
};

export default function PaymentMethodList({
  methods,
  value,
  onChange,
  failedMethodId,
  disabled,
}: PaymentMethodListProps) {
  // 그룹 순서는 전달받은 methods 순서를 따른다.
  const groups = methods.reduce<{ type: PaymentMethodType; items: PaymentMethod[] }[]>(
    (acc, method) => {
      const group = acc.find((g) => g.type === method.type);
      if (group) group.items.push(method);
      else acc.push({ type: method.type, items: [method] });
      return acc;
    },
    [],
  );

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      aria-label="결제수단"
      sx={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {groups.map((group) => (
        <FlexBox key={group.type} flexDirection="column" gap="8px">
          <Typography variant="label1" weight="bold" color="semantic.foreground.neutral.secondary">
            {GROUP_LABEL[group.type]}
          </Typography>
          {group.items.map((method) => (
            <MethodRow
              key={method.id}
              method={method}
              selected={method.id === value}
              failed={method.id === failedMethodId}
            />
          ))}
        </FlexBox>
      ))}
    </RadioGroup>
  );
}

function MethodRow({
  method,
  selected,
  failed,
}: {
  method: PaymentMethod;
  selected: boolean;
  failed: boolean;
}) {
  return (
    <Box
      as="label"
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 12,
        cursor: 'pointer',
        border: `1.5px solid ${
          selected ? theme.semantic.foreground.brand.primary : theme.semantic.line.neutral.secondary
        }`,
        backgroundColor: selected
          ? theme.semantic.surface.brand.subtle
          : theme.semantic.background.neutral.primary,
        transition: 'border-color 120ms, background-color 120ms',
      })}
    >
      <RadioGroupItem value={method.id} tight />
      <FlexBox flexDirection="column" flex={1} gap="2px" sx={{ minWidth: 0 }}>
        <FlexBox alignItems="center" gap="6px">
          <Typography variant="body1" weight={selected ? 'bold' : 'medium'}>
            {method.name}
          </Typography>
          {failed && (
            <ContentBadge size="xsmall" color="accent" accentColor="semantic.foreground.negative.primary">
              방금 실패
            </ContentBadge>
          )}
        </FlexBox>
        <Typography variant="label2" color="semantic.foreground.neutral.tertiary" noWrap>
          {method.detail}
        </Typography>
      </FlexBox>
    </Box>
  );
}
