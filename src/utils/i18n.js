/** @module utils/i18n */

import defaultConfig from '../config/defaults';

/**
 * i18n 관련 유틸을 포함하는 객체
 */
export default {
  /**
   * key값에 대응되는 i18n 텍스트를 찾고, 대응되는 텍스트가 없을 경우 기본 텍스트를 반환한다.
   *
   * @param {string} key
   * @param {object} config
   * @param {object} config.i18n
   * @returns {string}
   */
  // TODO: config.i18n 속성에 잘못된 타입을 넣을 경우 로그를 찍어줄 수 있도록 한다
  get(key, config) {
    return config.i18n[key] || defaultConfig.i18n[key];
  },
};
