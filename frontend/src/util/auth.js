export function getAuthToken() {
  const duration = getDuration();

  if (duration < 0) {
    localStorage.setItem('token', null);
    return null;
  } else {
    return localStorage.getItem('token');
  }
  
}

export function getDuration(){
  const expirationTime = localStorage.getItem('expirationTime');
  const expirationDate = new Date(expirationTime);
  const nowDate = new Date();
  const duration = expirationDate.getTime() - nowDate.getTime();
  return duration;
}