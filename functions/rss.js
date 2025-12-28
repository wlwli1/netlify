exports.handler = async (event, context) => {
  const NAVER_ID = 'kj1nhon9o114'; 
  const TARGET_RSS_URL = `https://rss.blog.naver.com/${NAVER_ID}.xml`; 
  
  // 내 사이트 주소 (뒤에 슬래시 제거)
  const MY_DOMAIN = (process.env.URL || 'https://coinpop-guide.netlify.app').replace(/\/$/, '');
  const REDIRECT_PREFIX = `${MY_DOMAIN}/go?url=`;

  try {
    const response = await fetch(TARGET_RSS_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    let xmlData = await response.text();

    // ============================================================
    // [청소 & 재포장 로직]
    // 1. 만약 기존에 잘못 만들어진 "내 주소 껍데기"가 있다면 싹 지워버립니다.
    //    (예: .../go?url=.../go?url=... -> 원래 네이버 주소로 복구)
    // ============================================================
    xmlData = xmlData.replaceAll(REDIRECT_PREFIX, '');

    // ============================================================
    // 2. 이제 깨끗해진 네이버 주소에 "딱 한 번만" 껍데기를 씌웁니다.
    // ============================================================
    xmlData = xmlData.replaceAll(
      'https://blog.naver.com', 
      `${REDIRECT_PREFIX}https://blog.naver.com`
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // 캐시 끄기 (수정 확인용)
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
      body: xmlData
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'RSS Fetch Failed' }) };
  }
};
