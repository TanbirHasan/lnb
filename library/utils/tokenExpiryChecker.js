export const isTokenExpired = 
(token) => (Date.now() >= JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000)
