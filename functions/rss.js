


exports.handler = async (event, context) => {
  // 1. 가져올 네이버 블로그 RSS 주소 (여러개라면 여기서 로직 추가 가능)
  // 예: 본인의 네이버 블로그 RSS 주소 입력
  const TARGET_RSS_URL = 'https://rss.blog.naver.com/kj1nhon9o114.xml'; 

  try {
    // 2. 네이버 RSS 데이터 가져오기 (fetch는 Node 18+부터 내장)
    const response = await fetch(TARGET_RSS_URL);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const xmlData = await response.text();

    // 3. XML 그대로 응답 (필요하다면 xmlData를 여기서 수정/가공해도 됨)
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8", // XML 헤더 필수
        "Cache-Control": "max-age=3600, public" // 1시간 캐싱 (서버 부하 방지)
      },
      body: xmlData
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch RSS' })
    };
  }
};