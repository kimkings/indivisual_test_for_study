# Space Company 업데이트 기획서 (실전형)

> ToDo 보드 + 대화 흐름 기반 정리. **게임의 2차 진화 (mid→late game 재설계)** 방향.

---

## 전체 방향 (핵심 컨셉)

| 기존 | 앞으로 |
|------|--------|
| 생산 → 확장 → 리셋 → 반복 | **생산 → 선택 → 빌드 → 리셋 → 전략 변화** |
| "숫자 커지는 게임" | **"운영 선택 게임"** |

---

## 버전 구조 (3단계)

- **V0.9** — 기반 안정화 & 피로도 제거  
- **V1.0** — Advanced Rebirth & 메타 구축 (핵심 업데이트)  
- **V1.1** — 우주 확장 & 전략 레이어 추가  

---

# V0.9 — 기반 안정화 & 피로도 제거

## 목표

- "불편해서 접는" 요소 제거  
- 시스템 신뢰 확보  
- 후반 진입 장벽 낮추기  

## 1. 경제/버그 핵심 수정 (선행조건)

| ToDo | 내용 |
|------|------|
| ~~DM bonus does not affect antimatter~~ | **DM bonus ↔ antimatter 연동 정상화** (완료: 이벤트 보상·UI 표시 반영) |
| Make Antimatter work as a resource | Antimatter를 "진짜 자원"으로 승격 |
| ~~Pulsing loading icon stops pulsing mid-load~~ | **로딩 UI 버그 수정** (완료: 펄스 콜백·로드 완료 시 인터벌 제거) |
| ~~Optimise InterstellarUI Loading updateShips/Fleet~~ | **Interstellar UI 로딩 최적화** (완료: 탭 비가시 시 star/fleet/antimatter nav DOM 업데이트 생략) |
| ~~RocketFuelTX no destroy~~ | **RocketFuelTX 정상 destroy** (완료: destroy 시 updateFuelProductionCost 호출) |
| Plasma tech from Sol Center re-purchasable on reload | **Plasma 중복 구매 버그 제거** |
| ~~Resource Eff Cost changing base value~~ | **Resource efficiency base 값 고정** (완료: tech 비용 항상 Game.techData base 사용) |

## 2. Antimatter 재정의 (핵심)

- Antimatter를 **"진짜 자원"**으로 승격  
- 생산 / 소비 / 저장 구조 분리  
- 이후 모든 시스템의 중심축  

## 3. UX / QoL 개선

- Multibuy discount  
- resource screen에 energy↔mass 변환 버튼  
- 구매 가능 시 (!) 표시 (pin system)  
- Interstellar UI 로딩 최적화  

---

# V1.0 — Advanced Rebirth & 메타 구축

## 목표

**"리셋 이후가 진짜 게임"으로 만들기**

## 1. Advanced Rebirth 시스템

- T2 Antimatter  
- EMC 변환 효율 개선  
- Auto EMC (queue / split)  
- Recycling 시스템  
- 리셋 이후: **"운영 설계 단계"**  

## 2. 자동화 해금 구조

- Auto storage upgrade  
- 일부 자동 구매  
- 조건 기반 자동화 (ex. 특정 수치 도달 시 실행)  
- **"성장 결과로 자동화 해금"**  

## 3. Enlightenment 개편 (핵심)

- **동시에 활성화 가능한 개수 제한**  
- 슬롯 기반 구조  
- 빌드 다양성, "정답 1개" 구조 제거  

## 4. Achievement → 실제 메타로 전환

- Specific achievement bonuses  
- 업적이 수치 강화에 영향  
- "빌드 전략 요소"  

## ToDo 매핑 (V1.0)

- Planets, Forced Submission  
- Overlord Appreciation Research  
- Other achievements / Specific achievement bonuses  
- Multibuy Discount  
- T2 antimatter - advanced rebirth upgrade  
- Queue/split autoemc - adv. rebirth  
- Emc improve conversion rate - adv. rebirth  
- Auto upgrade storage - adv. rebirth  
- Pin Researches, Machines to show (!)tab when available to buy  
- energy mass conversion buttons on the resource screen  
- Add more Statistics  
- add a bunch of google analytics to track players' progress, save transfers, dm upgrades etc  

---

# V1.1 — 우주 확장 & 전략 레이어

## 목표

**"게임을 한 단계 더 크게 만든다"**

## 1. Planet 시스템

- 행성 점령 / 관리  
- 자원 보너스 or 특화 효과  
- "위치 기반 전략"  

## 2. Forced Submission (지배 시스템)

- 특정 행성 / 세력 종속화  
- passive bonus 획득  

## 3. Diplomacy / Scouting / Espionage

- Scouting 개편: 단순 발견 → 정보 기반  
- Espionage 추가: 숨겨진 정보, 리스크/보상  
- **정보 = 자원**  

## 4. Military 확장

- missiles, planetary defense  
- 공격 / 방어 / 경제 선택지  

## 5. 신규 콘텐츠

- Trappist Star System (데이터 입력)  
- Moviton New Ships  
- Better plasma - more advanced storage, efficiency  
- **Limit the number of enlightenment upgrades active at a time** (슬롯 제한)  
- Recycling adv. rebirth  
- Change scouting to a better system (tbc)  
- Change scouting to be more reliant on info and add espionage  

---

# 핵심 설계 포인트

1. **Antimatter = 모든 것의 중심**  
   Rebirth → Antimatter 획득 → 시스템 해금 / 빌드 방향 결정  

2. **자동화는 "보상"**  
   초반 수동 → 중반 반자동 → 후반 자동. 바로 주면 재미 죽음.  

3. **선택지 강제**  
   Enlightenment 제한, 빌드 갈림. 없으면 게임 끝.  

4. **정보 시스템은 "보여주는 UX"가 핵심**  
   Scouting/Espionage: 뭘 모르는지, 뭘 알게 되는지, 다음 행동이 뭔지 UI로 보여줘야 함.  

---

# 최종 한 줄 전략

- **V1.0** = "리셋 이후 게임" 완성  
- **V1.1** = "우주 전략 게임"으로 확장  

---

# 구현 우선순위 (참고)

1. V0.9 버그/경제 수정 (무조건 선행)  
2. Antimatter 진짜 자원 승격  
3. V1.0 Advanced Rebirth / Enlightenment 제한  
4. V1.1 Planets, Diplomacy, Military는 **너무 빨리 넣지 않기**  
