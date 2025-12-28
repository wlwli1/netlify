// netlify/functions/go.js

exports.handler = async (event, context) => {
  // 주소 뒤에 ?url=... 로 넘어온 값을 가져옵니다.
  const destination = event.queryStringParameters.url;

  // 목적지가 없으면 홈으로 보냄
  if (!destination) {
    return {
      statusCode: 302,
      headers: { Location: '/' }
    };
  }

  // 실제 네이버 블로그로 점프(리다이렉트) 시킴
  return {
    statusCode: 301,
    headers: {
      Location: destination
    }
  };
};
