import { FAILURE_REASONS } from './failure-reasons';

import type { FailureCode, Scenario } from './failure-reasons';

export type PayResult = { ok: true } | { ok: false; code: FailureCode };

type PayInput = {
  scenario: Scenario;
  methodId: string;
  /** 직전 실패 정보. 같은 원인이 결제수단에 남아 있는지 판단할 때 사용 */
  lastFailure: { code: FailureCode; methodId: string } | null;
};

export const PROCESSING_DELAY_MS = 2000;

/**
 * 실제 PG 연동 없이 결제 결과를 흉내 낸다.
 * - 첫 시도는 선택한 시나리오를 그대로 따른다.
 * - 재시도는 잔액·한도·카드 오류처럼 결제수단 자체의 문제면 같은 수단에서 다시 실패하고,
 *   다른 수단이거나 일시적인 문제(타임아웃·인증 취소)면 성공한다.
 */
export function resolvePayment({ scenario, methodId, lastFailure }: PayInput): PayResult {
  if (!lastFailure) {
    return scenario === 'success' ? { ok: true } : { ok: false, code: scenario };
  }
  const { code, methodId: failedMethodId } = lastFailure;
  if (FAILURE_REASONS[code].persistsOnSameMethod && failedMethodId === methodId) {
    return { ok: false, code };
  }
  return { ok: true };
}

export function createOrderNumber() {
  const now = new Date();
  const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((n) => String(n).padStart(2, '0'))
    .join('');
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');
  return `${date}-${random}`;
}
