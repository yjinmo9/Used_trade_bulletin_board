# 신뢰기반 중고거래 예약 시스템  
_산업경영공학부 정보시스템설계 팀 프로젝트_

---

## 프로젝트 개요  
비대면 중고거래에서 발생하는 노쇼, 사기 등 거래 신뢰 문제를  
거래 예약 시스템과 실시간 사용자 신뢰도 평가, 거래 이력 관리 기능으로 해결하는 웹서비스입니다.  
Next.js를 프론트엔드와 API 서버에 활용하고, MySQL을 데이터베이스로 사용했습니다.

---

## 주요 기능  
- 거래 시간 및 장소 예약 시스템  
- EWMA(지수 가중 이동평균) 기반 사용자 신뢰도 산정 및 이상행동 탐지  
- 회원가입, 로그인, 권한 관리 (NextAuth 등 도입 가능)  
- 거래 후기 작성 및 노쇼/사기 신고 기능  
- 의사결정표(Decision Table) 기반 거래 승인/거부 로직  
- MySQL 기반 데이터 관리 및 Prisma ORM 활용 (또는 Sequelize)

---

## 기술 스택  
- Frontend & API: Next.js (React, Server-Side Rendering, API Routes)  
- Database: MySQL  
- ORM: Prisma (권장) 또는 Sequelize  
- 인증: NextAuth.js (선택적)  
- 기타: Node.js, JavaScript, EWMA 알고리즘

---
 


<img width="663" alt="스크린샷 2025-07-05 오후 1 22 08" src="https://github.com/user-attachments/assets/303f7373-cd40-4f87-938d-f072f9e7407d" />


<img width="472" alt="스크린샷 2025-07-05 오후 1 23 24" src="https://github.com/user-attachments/assets/6b97960e-b72c-491a-8cc1-867b72196e3d" />
<img width="475" alt="스크린샷 2025-07-05 오후 1 23 33" src="https://github.com/user-attachments/assets/3ec7a3cd-0af5-4fc9-a935-4f77907e0b45" />
<img width="333" alt="스크린샷 2025-07-05 오후 1 23 42" src="https://github.com/user-attachments/assets/b2232876-26dc-4e5b-a340-0bb478c7889d" />
