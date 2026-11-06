/* =========================================================
   sample-photos.js — 샘플 기록에 붙일 내 사진 설정
   ---------------------------------------------------------
   ✏️ 사진을 넣는 방법
   1. assets/sample/ 폴더에  <카페코드>-1.jpg, <카페코드>-2.jpg, <카페코드>-3.jpg …  처럼 번호를 이어서 저장
      (카페당 여러 장 가능 · 기록 하나에는 최대 3장이 붙어요)
   2. 아래 SAMPLE_PHOTO_COUNT 에서 그 카페 숫자를 실제 넣은 파일 개수로 바꾸기
      (예: pusil 에 3장 넣었으면  pusil: 3)
   3. 주소 뒤에 ?sample=reset 을 붙여 열면 사진이 반영돼요.
   · 같은 카페의 기록이 여러 개면 사진을 돌려가며 나눠 써요.
   · 숫자가 0이면 그 카페 기록은 사진 없이 보여요. (파일이 없는데 숫자만 적으면 깨진 그림이 나와요)
   ========================================================= */

const SAMPLE_PHOTO_DIR = 'assets/sample/';

/* 카페 이름 → 파일명에 쓰는 코드 (한글 파일명은 피하려고 영문으로 정했어요) */
const SAMPLE_CAFE_SLUGS = {
  '푸실': 'pusil',
  '언리튼잉크': 'unwrittenink',
  '르슈망': 'le-chemin',
  '어코트': 'acot',
  '리프레쉬룸': 'refreshroom',
  '에이미베이크 해방촌': 'amy-bake',
  '잔디바다 카페': 'zandibada',
  '이소프': 'isof',
  '일랑일랑': 'ilang-ilang',
  '팥즈': 'patzu',
  'MLML': 'mlml',
  '스미튼': 'smitten',
  '옐로우커피': 'yellow-coffee',
  '행집': 'hangzip',
  '푸티': 'putti',
};

/* 카페 코드 → assets/sample/ 에 실제로 넣은 사진 개수 */
const SAMPLE_PHOTO_COUNT = {
  'pusil': 7,
  'unwrittenink': 5,
  'le-chemin': 2,
  'acot': 2,
  'refreshroom': 1,
  'amy-bake': 1,
  'zandibada': 1,
  'isof': 1,
  'ilang-ilang': 0,
  'patzu': 1,
  'mlml': 2,
  'smitten': 1,
  'yellow-coffee': 0,
  'hangzip': 1,
  'putti': 3,
};

/* ---------- 책 표지 ----------
   ✏️ 표지를 넣는 방법
   1. assets/sample/covers/ 폴더에 아래 파일명으로 저장 (JPG)
   2. 넣은 책의 파일명을 아래 따옴표 안에 그대로 적기  (비워 두면 책 아이콘으로 보여요)
   3. 주소 뒤에 ?sample=reset 을 붙여 열기
   · 같은 책이 여러 기록에 나오면 모두 같은 표지를 써요. */
const SAMPLE_COVER_DIR = 'assets/sample/covers/';

const SAMPLE_BOOK_COVERS = {
  '이중 하나는 거짓말': 'one-of-them-is-a-lie.jpg',
  '제철행복': 'jecheol-haengbok.jpg',
  '지구에서 한아뿐': 'hanabun.jpg',
  '사실은 이것도 디자인입니다': 'design.jpg',
  '먼저 온 미래': 'future-first.jpg',
  '바깥은 여름': 'outside-summer.jpg',
  '모순': 'mosun.jpg',
  '어서오세요 휴남동 서점입니다': 'hyunam-dong.jpg',
};
