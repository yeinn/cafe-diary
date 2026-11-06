# 샘플 사진 폴더

직접 찍은 사진을 이 폴더에 넣으면 샘플 기록에 붙어요.

- 파일명: `카페코드-번호.jpg` (예: `pusil-1.jpg`, `pusil-2.jpg`, `pusil-3.jpg`) · 번호는 1부터 빠짐없이 이어서
- 형식: JPG (소문자 `.jpg`) · 카페당 여러 장 가능, 기록 하나에는 최대 3장이 붙어요
- 크기: 긴 변 1080px, 한 장 200~300KB 안팎 (앱이 저장하는 사진과 같은 기준)
- 넣은 뒤 `js/sample-photos.js` 의 `SAMPLE_PHOTO_COUNT` 숫자를 파일 개수로 바꾸고, 주소 뒤에 `?sample=reset` 을 붙여 열기

| 카페 | 코드 |
| --- | --- |
| 푸실 | pusil |
| 언리튼잉크 | unwrittenink |
| 르슈망 | le-chemin |
| 어코트 | acot |
| 리프레쉬룸 | refreshroom |
| 에이미베이크 해방촌 | amy-bake |
| 이소프 | isof |
| 일랑일랑 | ilang-ilang |
| 팥즈 | patzu |
| MLML | mlml |
| 스미튼 | smitten |
| 옐로우커피 | yellow-coffee |
| 푸티 | putti |
| 행집 | hangzip |
| 잔디바다 카페 | zandibada |
## 책 표지 (`covers/` 폴더)

| 책 | 파일명 |
| --- | --- |
| 이중 하나는 거짓말 | one-of-them-is-a-lie.jpg |
| 제철행복 | jecheol-haengbok.jpg |
| 지구에서 한아뿐 | hanabun.jpg |
| 사실은 이것도 디자인입니다 | design.jpg |
| 먼저 온 미래 | future-first.jpg |
| 바깥은 여름 | outside-summer.jpg |
| 모순 | mosun.jpg |
| 어서오세요 휴남동 서점입니다 | hyunam-dong.jpg |

- 크기: 세로가 긴 비율(2:3)로 400×600px, 한 장 30KB 안팎
- 넣은 뒤 `js/sample-photos.js` 의 `SAMPLE_BOOK_COVERS` 에서 그 책의 `''` 를 파일명으로 바꾸고 `?sample=reset`
