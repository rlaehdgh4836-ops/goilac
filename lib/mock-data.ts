export type PaymentMethodType = 'card' | 'easy';

export type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  name: string;
  detail: string;
};

export const ORDER = {
  productName: '무선 노이즈캔슬링 헤드폰',
  option: '미드나잇 블랙 · 1개',
  productPrice: 289000,
  shippingFee: 0,
  get totalAmount() {
    return this.productPrice + this.shippingFee;
  },
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card-shinhan', type: 'card', name: '신한카드', detail: '개인 · 1234' },
  { id: 'card-kb', type: 'card', name: 'KB국민카드', detail: '개인 · 5678' },
  { id: 'kakaopay', type: 'easy', name: '카카오페이', detail: '카카오페이 머니 · 연결 카드' },
  { id: 'naverpay', type: 'easy', name: '네이버페이', detail: '네이버페이 포인트 · 연결 계좌' },
  { id: 'tosspay', type: 'easy', name: '토스페이', detail: '토스머니 · 연결 계좌' },
];

export const DEFAULT_METHOD_ID = PAYMENT_METHODS[0].id;

export function getPaymentMethod(id: string | null | undefined) {
  return PAYMENT_METHODS.find((method) => method.id === id);
}

export function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}
