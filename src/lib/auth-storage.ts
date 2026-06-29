const AUTH_USER_ID_KEY = "authUserId";

export function getStoredAuthUserId() {
  return localStorage.getItem(AUTH_USER_ID_KEY);
}

export function setStoredAuthUserId(userId: string | number) {
  localStorage.setItem(AUTH_USER_ID_KEY, String(userId));
}

export function clearStoredAuthUserId() {
  localStorage.removeItem(AUTH_USER_ID_KEY);
}
