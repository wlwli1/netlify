exports.handler = async (event, context) => {
  const NAVER_ID = 'kj1nhon9o114'; 
  const TARGET_RSS_URL = `https://rss.blog.naver.com/${NAVER_ID}.xml`; 
  
  // 내 사이트 주소 (뒤에 슬래시 제거)
  const MY_DOMAIN = (process.env.URL || 'https://coinpop-guide.netlify.app').replace(/\/$/, '');

  try {
    const response = await fetch(TARGET_RSS_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    let xmlData = await response.text();

    // ============================================================
    // [최종 해결책] 이중 변환 방지 로직
    // ============================================================
    
    // 1. 이미 변환된 주소가 있다면 원상복구 (네이버 원본 주소로 초기화)
    // (혹시 모를 중복 방지를 위해 무조건 '깨끗한 상태'에서 시작)
    const resetRegex = new RegExp(`${MY_DOMAIN}/go\\?url=`, 'g');
    xmlData = xmlData.replace(resetRegex, '');

    // 2. 이제 깔끔하게 한 번만 감싸기
    // blog.naver.com 주소를 찾아서 내 리다이렉트 주소로 변경
    xmlData = xmlData.replaceAll(
      'https://blog.naver.com', 
      `${MY_DOMAIN}/go?url=https://blog.naver.com`
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // 캐시 끄기 (테스트용)
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
      body: xmlData
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed' }) };
  }
};
