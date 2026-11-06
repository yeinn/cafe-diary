/* =========================================================
   illust.js — 음료/디저트 이름 → 일러스트 매칭
   ✏️ 키워드를 추가·수정하려면 아래 ILLUST_RULES 만 고치면 돼요.
   - 위에서부터 차례로 검사하고, 처음 맞는 카테고리를 써요.
     (예: '녹차라떼'는 tea 가 coffee 보다 위라서 tea)
   - 어디에도 안 맞으면 default.png
   - 이미지 파일은 assets/illust/<image>.png
   ========================================================= */

const ILLUST_DIR = 'assets/illust/';

const ILLUST_RULES = {
  /* 음료 */
  drink: [
    { image: 'tea',    keywords: ['티', '차', '말차', '녹차', '홍차', '루이보스', '캐모마일', '얼그레이', '허브'] },
    { image: 'ade',    keywords: ['에이드', '스무디', '주스', '탄산', '모히또', '레몬수'] },
    { image: 'coffee', keywords: ['커피', '아메리카노', '라떼', '라테', '카푸치노', '에스프레소', '마키아또', '플랫화이트', '콜드브루', '모카', '아인슈페너', '카페'] },
  ],
  /* 디저트 */
  dessert: [
    { image: 'cake',   keywords: ['케이크', '케익', '티라미수', '푸딩', '타르트', '파이', '치즈', '크림', '롤', '브라우니', '마카롱'] },
    { image: 'cookie', keywords: ['쿠키', '스콘', '까눌레', '휘낭시에', '마들렌', '비스킷', '크로플', '와플', '샌드'] },
    { image: 'bread', keywords: ['빵', '베이글', '크루아상'] }
  ],
};

/* kind: 'drink' | 'dessert' → 일러스트 이미지 경로 */
function illustSrc(kind, name) {
  const text = (name || '').replace(/\s/g, '').toLowerCase();
  const rule = (ILLUST_RULES[kind] || []).find((r) => r.keywords.some((k) => text.includes(k)));
  return `${ILLUST_DIR}${rule ? rule.image : 'default'}.png`;
}
