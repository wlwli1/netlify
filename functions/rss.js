exports.handler = async (event, context) => {
  const NAVER_ID = 'kj1nhon9o114'; 
  const TARGET_RSS_URL = `https://rss.blog.naver.com/${NAVER_ID}.xml`; 
  
  // 내 사이트 주소 (뒤에 슬래시 제거)
  const MY_DOMAIN = (process.env.URL || 'https://coinpop-guide.netlify.app').replace(/\/$/, '');
  
  // 지워야 할 내 껍데기 주소 패턴
  const WRAPPER = `${MY_DOMAIN}/go?url=`;

  try {
    const response = await fetch(TARGET_RSS_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    let xmlData = await response.text();

    // ============================================================
    // [강력한 청소] 반복문(while)으로 껍데기 박멸
    // ============================================================
    // 설명: xmlData 안에 내 주소(WRAPPER)가 하나라도 남아있다면
    // 계속해서 빈카드로 지워버립니다. (양파 껍질 벗기듯 다 벗김)
    
    while (xmlData.includes(WRAPPER)) {
      xmlData = xmlData.replaceAll(WRAPPER, '');
    }

    // ============================================================
    // [재포장] 이제 원본 네이버 주소만 남았으니, 딱 한 번만 입힘
    // ============================================================
    xmlData = xmlData.replaceAll(
      'https://blog.naver.com', 
      `${WRAPPER}https://blog.naver.com`
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // 테스트를 위해 캐시 끄기
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
      body: xmlData
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed' }) };
  }
};
