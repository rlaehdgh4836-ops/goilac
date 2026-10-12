export type FailureCode =
  | 'insufficient_balance'
  | 'limit_exceeded'
  | 'card_invalid'
  | 'network_timeout'
  | 'auth_cancelled';

export type RecoveryAction = 'retry' | 'change_method';

export type FailureReason = {
  label: string;
  title: string;
  description: string;
  guide: string;
  primaryAction: RecoveryAction;
  /** 같은 결제수단으로 다시 시도해도 실패하는 원인인지 */
  persistsOnSameMethod: boolean;
  /** 실제 결제가 이뤄지지 않았음을 강조해서 안내할지 */
  notCharged?: boolean;
};

export const FAILURE_REASONS: Record<FailureCode, FailureReason> = {
  insufficient_balance: {
    label: '잔액 부족',
    title: '잔액이 부족해서 결제하지 못했어요',
    description: '선택한 결제수단의 잔액이 결제 금액보다 적어요.',
    guide: '잔액을 충전한 뒤 다시 결제하거나, 다른 결제수단을 선택해 주세요.',
    primaryAction: 'change_method',
    persistsOnSameMethod: true,
  },
  limit_exceeded: {
    label: '한도 초과',
    title: '카드 결제 한도를 초과했어요',
    description: '이번 달 사용 가능한 한도보다 결제 금액이 커요.',
    guide: '카드사 앱에서 한도를 늘리거나, 다른 결제수단을 선택해 주세요.',
    primaryAction: 'change_method',
    persistsOnSameMethod: true,
  },
  card_invalid: {
    label: '카드 정보 오류',
    title: '사용할 수 없는 카드예요',
    description: '유효기간이 지났거나 정지된 카드일 수 있어요.',
    guide: '카드 상태는 카드사에 문의해 주세요. 지금은 다른 결제수단으로 결제할 수 있어요.',
    primaryAction: 'change_method',
    persistsOnSameMethod: true,
  },
  network_timeout: {
    label: '네트워크 타임아웃',
    title: '결제 응답이 늦어져서 중단됐어요',
    description: '일시적인 통신 문제로 결제가 끝까지 처리되지 않았어요.',
    guide: '잠시 후 다시 결제해 주세요. 대부분 다시 시도하면 해결돼요.',
    primaryAction: 'retry',
    persistsOnSameMethod: false,
    notCharged: true,
  },
  auth_cancelled: {
    label: '인증 취소',
    title: '결제 인증이 완료되지 않았어요',
    description: '인증 창이 닫혔거나 인증 시간이 지나 결제가 취소됐어요.',
    guide: '다시 결제하기를 누르고 인증을 끝까지 진행해 주세요.',
    primaryAction: 'retry',
    persistsOnSameMethod: false,
    notCharged: true,
  },
};

export type Scenario = 'success' | FailureCode;

export const SCENARIO_OPTIONS: { value: Scenario; label: string }[] = [
  { value: 'success', label: '결제 성공' },
  ...(Object.keys(FAILURE_REASONS) as FailureCode[]).map((code) => ({
    value: code,
    label: `실패 · ${FAILURE_REASONS[code].label}`,
  })),
];
