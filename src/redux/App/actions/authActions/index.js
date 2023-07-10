import { LOGIN_TOKEN } from '../../constants';

/**
 * function for save tokens
 */

export function setLoginToken(token) {
  return {
    type: LOGIN_TOKEN,
    payload: token,
  };
}
