# 결제 오류 복구 플로우 프로토타입

결제 오류가 발생했을 때 사용자가 실패 원인을 이해하고, 적절한 복구 행동을 선택해 결제를 다시 완료할 수 있도록 하는 UX 프로토타입입니다.
UI는 [Montage 디자인 시스템](https://github.com/wanteddev/montage-web)(`@montage-ui/core`)으로 만들었습니다.

## 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에 접속하면 결제 화면(`/checkout`)으로 이동합니다.

## 화면

| 경로 | 화면 |
| --- | --- |
| `/checkout` | 결제수단 선택 |
| `/checkout/processing` | 결제 진행 중 |
| `/checkout/failed` | 결제 실패 (원인 안내 + 다시 결제하기 / 다른 결제수단 선택) |
| `/checkout/change-method` | 다른 결제수단 선택 |
| `/checkout/complete` | 결제 완료 |

## 결제 결과 시뮬레이션

실제 PG 연동 없이 결제 결과를 흉내 냅니다. 결제 화면 하단의 **데모 · 결제 결과 시뮬레이션**에서 첫 시도의 결과를 고를 수 있습니다.

- 성공
- 잔액 부족 · 한도 초과 · 카드 정보 오류: 같은 결제수단으로 다시 시도하면 또 실패하고, 다른 결제수단으로 바꾸면 성공합니다.
- 네트워크 타임아웃 · 인증 취소: 다시 시도하면 성공합니다.

실패 원인별 문구와 권장 행동은 `lib/failure-reasons.ts`, 결과 판정 로직은 `lib/mock-pay.ts`에 있습니다.
