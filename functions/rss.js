// netlify/functions/rss.js

exports.handler = async (event, context) => {
  const NAVER_ID = 'kj1nhon9o114'; 
  const TARGET_RSS_URL = `https://rss.blog.naver.com/${NAVER_ID}.xml`; 
  
  // 내 사이트 주소 (환경변수 또는 고정주소)
  const MY_DOMAIN = process.env.URL || 'https://coinpop-guide.netlify.app'; 

  try {
    const response = await fetch(TARGET_RSS_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    let xmlData = await response.text();

    // ============================================================
    // [수정됨] 중복 방지를 위한 깔끔한 한 방 처리
    // ============================================================
    
    // 기존 코드에서는 명령어가 두 번 실행되면서 꼬였습니다.
    // 그냥 모든 'https://blog.naver.com'을 찾아서 한 번에 바꿉니다.
    // 이렇게 하면 메인 주소든, 글 주소든 딱 한 번만 감싸집니다.
    
    xmlData = xmlData.replaceAll(
      'https://blog.naver.com', 
      `${MY_DOMAIN}/go?url=https://blog.naver.com`
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "max-age=3600, public"
      },
      body: xmlData
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch RSS' }) };
  }
};
