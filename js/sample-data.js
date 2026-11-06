/* =========================================================
   sample-data.js — 고정 샘플 기록 32개 (2026년 7월 ~ 11월)
   ---------------------------------------------------------
   · 한 번 써 둔 고정 데이터라서 사이트를 열 때마다 바뀌지 않아요.
   · real: true  → 직접 쓴 실제 기록 8개 (내용은 원문 그대로)
     real 없음   → 생성 기록 24개
   · photoCount  → 사진을 몇 장 붙일지. 실제 사진 파일은 sample-photos.js 의
                   설정(카페별 파일 개수)에 따라 연결돼요. 파일이 없으면 0장.
   · 같은 날짜의 순서는 배열 순서예요. (10/17, 11/4 가 하루 2개)
   · 날씨: sunny 맑음 · cloud 흐림 · rain 비
   ========================================================= */

const sn = (text, icon) => ({ text, icon });
const sb = (title, pages = '') => ({ title, pages, cover: '' });

const SAMPLE_RECORDS = [
  /* ───────── 7월 (7) ───────── */
  { date: '2026-07-05', weather: 'sunny', cafe: '푸실', drink: '아이스 라떼', dessert: '휘낭시에', revisit: true, photoCount: 2,
    book: sb('먼저 온 미래', '1 – 42쪽'),
    quote: '좋아하는 장소가 생긴다는 건, 돌아갈 곳이 하나 늘어난다는 뜻이다.',
    diary: '장마가 시작되기 전에 푸실에 들렀다. 창가 자리가 비어 있어서 한참 앉아 있었다. 라떼를 마시며 책을 펴니 더위가 조금 가시는 기분!',
    notes: [sn('휘낭시에 겉바속촉 ㅎㅎ', 'heart-note'), sn('다음엔 티라미수도 먹어봐야지', 'think')] },

  { id: 'sample-29', date: '2026-07-09', weather: 'rain', cafe: '푸티', drink: '유자민트티', dessert: '마들렌', revisit: true, photoCount: 1,
    book: null, quote: '',
    diary: '장마철이라 습한데 유자민트티 덕분에 입안이 개운해졌다. 처음 와 본 곳인데 좌석 간격이 넓어서 마음이 편하다.',
    notes: [sn('민트 향이 생각보다 진하다!', 'rain')] },

  { real: true, date: '2026-07-13', weather: 'sunny', cafe: '언리튼잉크', drink: '아이스 카페라떼', dessert: '', revisit: true, photoCount: 1,
    book: sb('이중 하나는 거짓말'),
    quote: '둥글고 무분별한 포옹이 아닌 절제된 직각의 수용',
    diary: '한껏 감성적일 수 있는 곳이다. 잠시 다른 세상에 온 것 같기도 하다…!',
    notes: [sn('오늘도 나만의 장소에 왔다', 'heart-note')] },

  { real: true, date: '2026-07-16', weather: 'sunny', cafe: '르슈망', drink: '아이스 아메리카노', dessert: '까눌레', revisit: true, photoCount: 1,
    book: sb('이중 하나는 거짓말'),
    quote: '눈 앞에 출구가 보이지 않을 때 온 힘을 다해 다른 선택지를 찾는 건 도망이 아니라 기도니까',
    diary: '오늘은 새로운 카페에 왔다. 여긴 2층도 있다. 무려 통창뷰! 처음에 왔을 땐 더워서 후회했는데 곧 선선한 바람이 불더라.',
    notes: [sn('까눌레가 아주 맛나다!', 'cake'), sn('여기도 저장해두고 종종 와야지', 'gift')] },

  { date: '2026-07-19', weather: 'cloud', cafe: '이소프', drink: '아이스 아메리카노', dessert: '마들렌', revisit: false, photoCount: 1,
    book: null, quote: '',
    diary: '산책하다가 우연히 들어왔다. 흐린 날이라 그런지 가게 안이 더 아늑하게 느껴진다. 마들렌이 아직 따뜻해서 기분 좋았다.',
    notes: [] },

  { real: true, date: '2026-07-22', weather: 'rain', cafe: '푸실', drink: '아이스 라떼', dessert: '레몬 티라미수', revisit: true, photoCount: 1,
    book: sb('제철행복'),
    quote: '무리하면 지치는 법이니 지금 지쳐있다면 그건 필히 무리했다는 뜻이리라.',
    diary: '열심히 살았다 나 자신! 근데 열심히 산 만큼 잘 되고 있는건지는 모르겠다. 열심히 사는 것에도 정답이 있는걸까?',
    notes: [sn('푸실 라떼는 여전히 참 맛있다.', 'coffee'), sn('홧김에 레몬 티라미수도 시켰는데 정말 맛있다!💛', 'cake')] },

  { real: true, date: '2026-07-27', weather: 'sunny', cafe: '에이미베이크 해방촌', drink: '말차라떼', dessert: '햄치즈 슬라이스 샌드위치', revisit: false, photoCount: 1,
    book: null, quote: '',
    diary: '점심을 먹으러 브런치 집에 왔다. 가격이 좀 있지만, 양이 꽤 많다. 근데 빵이 너무 안썰려서 힘들었다… 속에 발라져있는 갈색 잼은 처음 먹어본 맛인데 크게 내 스타일은 아닌 것 같다..🤔',
    notes: [sn('굉장히 둠칫둠칫한 배경음악🎵', 'party'), sn('내부는 뭔가 어두컴컴해..!', 'think')] },

  /* ───────── 8월 (5) ───────── */
  { date: '2026-08-06', weather: 'sunny', cafe: '어코트', drink: '아이스티', dessert: '바나나푸딩', revisit: false, photoCount: 1,
    book: null, quote: '', diary: '',
    notes: [sn('바나나푸딩이 달달해서 오후를 버틸 힘이 생겼다!', 'cake')] },

  { real: true, date: '2026-08-14', weather: 'cloud', cafe: '어코트', drink: '아이스티', dessert: '', revisit: false, photoCount: 1,
    book: sb('지구에서 한아뿐'),
    quote: '동그라미를 잘 그리는데만 집착하던 시절이 있었다.',
    diary: '점심시간 마다 사치를 부리듯 여유를 보내는 이 시간이 참 소중하다. 잠시 일상에서 벗어나서 오롯이 나를 경험하는 시간! 오늘 컵홀더 문구가 굉장히 마음에 든다.',
    notes: [sn('나에게 동그라미는 ‘돈’이었을까?', 'think')] },

  { real: true, date: '2026-08-21', weather: 'rain', cafe: '푸실', drink: '아이스 라떼', dessert: '레몬 티라미수', revisit: true, photoCount: 1,
    book: sb('사실은 이것도 디자인입니다'),
    quote: '디자이너는 더이상 예술가가 아니다.',
    diary: '오늘은 유독 케이크 양이 많은 것 같다. 기분 탓인가? ㅎ,ㅎ 오늘 읽은 책은 꽤 도움이 되는 것 같다. 그동안 UIUX를 공부해오면서 들었던 단어들을 이제서야 이해한 것 같다. 직접 해 본 경험이 있어서 더 쉽게 와닿았던 듯!',
    notes: [] },

  { date: '2026-08-25', weather: 'cloud', cafe: '언리튼잉크', drink: '아이스 라떼', dessert: '휘낭시에', revisit: true, photoCount: 3,
    book: sb('먼저 온 미래', '43 – 90쪽'),
    quote: '바쁜 하루에도 숨 쉴 틈 하나쯤은 내 손으로 만들어 두자.',
    diary: '오랜만에 언리튼잉크에 왔다. 처음 왔을 때처럼 조용한 직각의 공간이 여전히 좋다. 말없이 앉아 있기만 해도 하루가 정리되는 기분이다.',
    notes: [sn('역시 나만의 장소', 'heart-note'), sn('휘낭시에는 가장자리가 제일 맛있다!', 'cake')] },

  { date: '2026-08-30', weather: 'sunny', cafe: '팥즈', drink: '자몽에이드', dessert: '스콘', revisit: false, photoCount: 1,
    book: null, quote: '',
    diary: '늦여름 햇볕이 아직 따갑다. 시원한 자몽에이드로 한숨 돌렸다. 스콘이 퍽퍽하지 않고 촉촉해서 놀랐다!',
    notes: [sn('팥 들어간 메뉴가 궁금하다. 다음엔 도전!', 'think')] },

  /* ───────── 9월 (4) ───────── */
  { date: '2026-09-03', weather: 'cloud', cafe: '푸실', drink: '아이스 라떼', dessert: '레몬 티라미수', revisit: true, photoCount: 1,
    book: sb('바깥은 여름', '1 – 35쪽'),
    quote: '', diary: '', notes: [] },

  { real: true, date: '2026-09-10', weather: 'cloud', cafe: '리프레쉬룸', drink: '리프라떼', dessert: '당근 라페 샌드위치', revisit: true, photoCount: 1,
    book: sb('제철행복'),
    quote: '',
    diary: '운동을 끝내고 집에 가서 옷을 갈아입은 후 바로 이 곳으로 달려왔다. 12시가 넘어가니 점점 사람들이 많아졌다. 다들 바쁜 점심시간에 나만 느긋하게 앉아 있는 기분 ㅎㅎ 가격대는 조금 있는 편이지만 정말 맛있다! 카레 당근은 싫은데 당근 라페는 왜이리 맛있는지..! 🥕 라떼도 진해서 맛있더라. 달달쌉싸름!',
    notes: [sn('고양이의 야옹 소리', 'heart-note'), sn('고양이를 보며 행복하게 웃는 소리', 'party'), sn('옆자리의 도란도란 이야기 소리', 'think')] },

  { date: '2026-09-17', weather: 'sunny', cafe: '르슈망', drink: '아이스 아메리카노', dessert: '까눌레', revisit: true, photoCount: 2,
    book: sb('모순', '1 – 60쪽'),
    quote: '선택하지 않은 길도 결국 내가 걸어온 길의 일부다.',
    diary: '2층 통창 자리가 비어 있어서 바로 올라갔다. 이제는 바람이 선선해서 창문을 열어 두어도 기분 좋다. 까눌레는 이번에도 실패가 없다.',
    notes: [sn('가을 냄새가 나기 시작했다', 'sunny'), sn('까눌레 겉이 바삭 그 자체!', 'cake')] },

  { date: '2026-09-26', weather: 'cloud', cafe: '스미튼', drink: '딸기라떼', dessert: '마들렌', revisit: false, photoCount: 1,
    book: null, quote: '',
    diary: '시간이 조금 남아서 들렀다. 딸기라떼가 생각보다 덜 달아서 좋았다. 마들렌은 레몬 향이 은은하게 났다.',
    notes: [] },

  /* ───────── 10월 (10) ───────── */
  { real: true, date: '2026-10-02', weather: 'sunny', cafe: '잔디바다 카페', drink: '잔디라떼', dessert: '소금빵', revisit: false, photoCount: 1,
    book: null, quote: '',
    diary: '바다 여행 두번째는 쌀쌀한 가을 🍂 물놀이는 못하지만 이번엔 차로 이동한 덕분에 지금까지와는 다른 여행이 된 것 같다! 늘 대중교통으로 왔던 곳을 차로 오니까 신기했다. 예쁜 길도 발견! 전부터 와보고 싶었던 카페도 오고 ㅎㅎ 차가 있으니 정말 좋다!',
    notes: [] },

  { date: '2026-10-08', weather: 'sunny', cafe: '푸실', drink: '아이스 라떼', dessert: '레몬 티라미수', revisit: true, photoCount: 3,
    book: sb('어서오세요 휴남동 서점입니다', '1 – 55쪽'),
    quote: '천천히 가는 사람도 결국 같은 계절을 지나간다.',
    diary: '가을 하늘이 너무 예뻐서 일부러 푸실까지 걸어왔다. 단골이 되니 메뉴를 고르는 시간이 줄어서 좋다. 오늘도 라떼와 티라미수, 변함없는 조합!',
    notes: [sn('걷기 딱 좋은 날씨', 'sunny'), sn('라떼는 여전히 정답', 'coffee')] },

  { id: 'sample-30', date: '2026-10-10', weather: 'sunny', cafe: '푸티', drink: '녹차라떼', dessert: '초코케이크', revisit: true, photoCount: 2,
    book: sb('먼저 온 미래', '91 – 130쪽'),
    quote: '가장 익숙한 것들이 어느 날 가장 낯설게 보이기도 한다.',
    diary: '', notes: [] },

  { date: '2026-10-13', weather: 'cloud', cafe: '일랑일랑', drink: '유자차', dessert: '스콘', revisit: false, photoCount: 0,
    book: null, quote: '',
    diary: '쌀쌀해져서 이번엔 따뜻한 음료를 시켰다. 유자차가 목을 타고 내려가니 몸이 스르륵 풀린다.',
    notes: [sn('스콘에 잼 듬뿍 발라 먹기 성공!', 'party')] },

  { date: '2026-10-17', weather: 'sunny', cafe: '언리튼잉크', drink: '아이스 라떼', dessert: '휘낭시에', revisit: true, photoCount: 2,
    book: sb('지구에서 한아뿐', '45 – 98쪽'),
    quote: '모서리가 있어서 오히려 편한 날도 있다.',
    diary: '오전에 혼자 와서 책을 읽었다. 읽다 보니 어느새 한 시간이 훌쩍 지나 있었다. 다른 일정이 있어서 아쉽지만 일어났다.',
    notes: [sn('오늘도 만족 100%', 'heart-note'), sn('이따 또 카페 가는 사람 나야 나', 'gift')] },

  { date: '2026-10-17', weather: 'sunny', cafe: '리프레쉬룸', drink: '리프라떼', dessert: '당근 라페 샌드위치', revisit: true, photoCount: 0,
    book: null, quote: '', diary: '',
    notes: [sn('당근 라페 샌드위치, 두 번째인데도 맛있다 🥕', 'fire')] },

  { date: '2026-10-21', weather: 'cloud', cafe: 'MLML', drink: '자몽차', dessert: '초코케이크', revisit: false, photoCount: 2,
    book: null, quote: '',
    diary: '이름이 특이해서 궁금했던 곳에 드디어 왔다. 자몽차는 새콤한 편이고 초코케이크는 꽤 진해서 한 입씩 천천히 먹었다.',
    notes: [] },

  { date: '2026-10-24', weather: 'rain', cafe: '푸실', drink: '아이스 라떼', dessert: '레몬 티라미수', revisit: true, photoCount: 1,
    book: sb('바깥은 여름', '36 – 89쪽'),
    quote: '비 오는 날의 창가는 평소보다 오래 앉아 있어도 괜찮은 자리가 된다.',
    diary: '비가 와서 창밖이 온통 촉촉하다. 우산을 접고 들어서자마자 익숙한 커피 향이 났다. 이럴 땐 집보다 푸실이 더 집 같다.',
    notes: [sn('비 오는 날은 푸실이지', 'rain'), sn('티라미수 위 레몬 향이 오늘따라 더 상큼', 'cake')] },

  { id: 'sample-31', date: '2026-10-27', weather: 'cloud', cafe: '행집', drink: '딸기라떼', dessert: '마들렌', revisit: false, photoCount: 1,
    book: sb('바깥은 여름', '90 – 130쪽'),
    quote: '작은 집 한 칸에도 계절은 어김없이 먼저 들어온다.',
    diary: '골목 안쪽에 숨어 있어서 지도를 두 번이나 확인했다. 도착하고 나니 헤맨 시간이 아깝지 않을 만큼 아담하고 포근한 곳이다.',
    notes: [sn('딸기라떼 위에 올라간 크림이 귀엽다', 'heart-note'), sn('이런 골목 카페 취향 저격!', 'camera')] },

  { date: '2026-10-29', weather: 'sunny', cafe: '어코트', drink: '얼그레이티', dessert: '바나나푸딩', revisit: false, photoCount: 0,
    book: sb('모순', '61 – 118쪽'),
    quote: '',
    diary: '컵홀더 문구가 이번에도 마음에 든다. 얼그레이티 향이 은은해서 책이 술술 읽혔다.',
    notes: [] },

  /* ───────── 11월 (6) ───────── */
  { date: '2026-11-01', weather: 'cloud', cafe: '푸실', drink: '아이스 라떼', dessert: '레몬 티라미수', revisit: true, photoCount: 1,
    book: null, quote: '', diary: '',
    notes: [sn('11월의 첫날부터 얼죽아 인증 ㅎㅎ', 'snow')] },

  { date: '2026-11-02', weather: 'sunny', cafe: '르슈망', drink: '아이스 아메리카노', dessert: '까눌레', revisit: true, photoCount: 2,
    book: sb('어서오세요 휴남동 서점입니다', '56 – 110쪽'),
    quote: '좋은 하루란 대단한 일이 없어도 마음이 한 번쯤 따뜻해지는 하루다.',
    diary: '꽤 쌀쌀해졌지만 통창 자리에 햇볕이 가득 들어와서 포근했다. 2층에서 사람 구경, 하늘 구경을 한참 했다.',
    notes: [sn('르슈망 단골 도장 쾅!', 'party'), sn('다음엔 따뜻한 음료도 시켜볼까?', 'think')] },

  { date: '2026-11-03', weather: 'rain', cafe: '옐로우커피', drink: '초코라떼', dessert: '스콘', revisit: false, photoCount: 0,
    book: null, quote: '',
    diary: '아침부터 비가 내려서 노란 간판이 더 눈에 띄었다. 초코라떼가 진하고 따뜻해서 손부터 녹았다.',
    notes: [sn('스콘은 조금 단 편', 'cake'), sn('비 오는 날에 간판 색이 예뻐서 합격', 'rain')] },

  { date: '2026-11-04', weather: 'cloud', cafe: '언리튼잉크', drink: '아이스 라떼', dessert: '휘낭시에', revisit: true, photoCount: 2,
    book: sb('지구에서 한아뿐', '99 – 140쪽'),
    quote: '마음에도 환기가 필요하다. 가끔은 창을 열 듯이.',
    diary: '아침에 일어나자마자 오늘은 어디든 가야겠다는 생각이 들었다. 결국 언리튼잉크로 직행! 조용한 곳에서 책을 읽으니 머릿속이 한결 정리된다.',
    notes: [sn('오전 카페 타임 성공', 'sunny'), sn('휘낭시에는 두 개 먹을걸', 'heart-note')] },

  { date: '2026-11-04', weather: 'cloud', cafe: '리프레쉬룸', drink: '리프라떼', dessert: '당근 라페 샌드위치', revisit: true, photoCount: 0,
    book: null,
    quote: '좋아하는 것을 반복하는 건 지루한 게 아니라 확신이다.',
    diary: '', notes: [] },

  { id: 'sample-32', date: '2026-11-05', weather: 'cloud', cafe: '푸티', drink: '핫초코', dessert: '바나나푸딩', revisit: true, photoCount: 3,
    book: sb('먼저 온 미래', '131 – 170쪽'),
    quote: '추운 날에 손을 녹여 주는 컵 하나면 하루의 절반은 괜찮아진다.',
    diary: '아침 공기가 확 차가워져서 처음으로 핫초코를 골랐다. 푸티는 올 때마다 조용해서 책 읽기 좋다. 바나나푸딩이랑 같이 먹으니 든든하다.',
    notes: [sn('겨울 시작은 핫초코로 ☕', 'snow'), sn('푸티도 단골 후보 1순위', 'gift')] },
];
