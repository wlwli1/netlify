// netlify/functions/rss.js

exports.handler = async (event, context) => {
  const NAVER_ID = 'kj1nhon9o114'; 
  const TARGET_RSS_URL = `https://rss.blog.naver.com/${NAVER_ID}.xml`; 
  const MY_DOMAIN = process.env.URL || 'https://coinpop-guide.netlify.app'; 

  try {
    const response = await fetch(TARGET_RSS_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    let xmlData = await response.text();

    // 단 한 번만 전체 치환 (중복 방지)
    xmlData = xmlData.replaceAll(
      'https://blog.naver.com', 
      `${MY_DOMAIN}/go?url=https://blog.naver.com`
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // 👇 [수정됨] 캐시를 끄는 설정 (테스트용)
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
      body: xmlData
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed' }) };
  }
};
