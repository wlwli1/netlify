// netlify/functions/rss.js

exports.handler = async (event, context) => {
  const NAVER_ID = 'kj1nhon9o114';
  const TARGET_RSS_URL = `https://rss.blog.naver.com/${NAVER_ID}.xml`;
  
  // 내 사이트 도메인 (뒤에 슬래시 제거)
  const MY_DOMAIN = (process.env.URL || 'https://coinpop-guide.netlify.app').replace(/\/$/, '');

  try {
    const response = await fetch(TARGET_RSS_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    
    // 원본 XML 텍스트 가져오기
    let xmlData = await response.text();

    // ===============================================================
    // [가장 안전한 방법] 정규식으로 태그 내부의 링크만 정밀 타격
    // ===============================================================

    // 1단계: <link> 태그 안에 있는 http... 주소만 찾아서 변경
    // 예: <link>https://blog.naver.com/...</link>
    // 캡처 그룹(괄호)을 사용해서 태그는 건드리지 않고 내부 주소만 바꿉니다.
    
    xmlData = xmlData.replace(
      /<link>(https:\/\/blog\.naver\.com[^<]*)<\/link>/g, 
      (match, url) => {
        // 이미 변환된 주소인지 확인 (중복 방지 핵심)
        if (url.includes(MY_DOMAIN)) return match;
        
        // 변환되지 않은 네이버 주소만 내 주소로 감싸기
        return `<link>${MY_DOMAIN}/go?url=${url}</link>`;
      }
    );

    // 2단계: <guid> 태그 등 다른 곳에 있는 주소도 필요하면 변경 (선택사항)
    // 보통 RSS 리더는 <link> 태그를 가장 중요하게 봅니다.

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // 강력한 캐시 무효화 (브라우저가 절대 기억하지 못하게 함)
        "Cache-Control": "no-cache, no-store, must-revalidate", 
        "Pragma": "no-cache",
        "Expires": "0"
      },
      body: xmlData
    };

  } catch (error) {
    console.error("RSS Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch RSS' }) };
  }
};
