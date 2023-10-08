export const isUserLoggedIn = () => {
  return window.sessionStorage.getItem("x-token") !== null;
}

export const getUserToken = () => {
  return window.sessionStorage.getItem("x-token");
}

export const getUserRefreshToken = () => {
  return window.sessionStorage.getItem("x-refresh-token");
}

export const setUserToken = (token: string, refreshToken: string) => {
  window.sessionStorage.setItem("x-token", token);
  window.sessionStorage.setItem("x-refresh-token", refreshToken);
};