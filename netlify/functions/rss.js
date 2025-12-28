// netlify/functions/rss.js

exports.handler = async (event, context) => {
  // 1. 네이버 블로그 아이디 설정
  const NAVER_ID = 'kj1nhon9o114'; // 사용자의 네이버 ID
  const TARGET_RSS_URL = `https://rss.blog.naver.com/${NAVER_ID}.xml`; 
  
  // 내 사이트 도메인 (자동 감지 또는 수동 입력)
  // 예: https://coinpop-guide.netlify.app
  const MY_DOMAIN = process.env.URL || 'https://coinpop-guide.netlify.app'; 

  try {
    const response = await fetch(TARGET_RSS_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    let xmlData = await response.text();

    // ============================================================
    // [핵심] 네이버 주소를 내 사이트 주소로 바꿔치기
    // 구글은 내 도메인 아래에 있는 링크만 인정해줍니다.
    // ============================================================
    
    // 1. 블로그 메인 주소 변경
    // https://blog.naver.com/아이디 -> https://내사이트/go?url=...
    const blogMainRegex = new RegExp(`https://blog.naver.com/${NAVER_ID}`, 'g');
    xmlData = xmlData.replace(blogMainRegex, `${MY_DOMAIN}/go?url=https://blog.naver.com/${NAVER_ID}`);

    // 2. 개별 글 주소 변경 (RSS 피드 내의 모든 링크)
    // 네이버 링크가 포함된 <link> 태그 등을 내 리다이렉트 주소로 변경
    // (단순 무식하게 모든 blog.naver.com 링크를 치환합니다)
    xmlData = xmlData.replaceAll('https://blog.naver.com', `${MY_DOMAIN}/go?url=https://blog.naver.com`);

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
