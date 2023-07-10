import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
let access_token =
  'vk1.a.OTOwzyy-V1umZS3O11SAYo5VEH6WsiB-9f_s6lF97QXFP6gtqVIqG749WVvHOsokGDj_RmXB9EV484ElSsAMV7fgK-u5BFOMEaKqIW9u8JEIS_Ak6UJjTw2ZUbJ1HfwQuVcHRaQ-6DwSzV3yK-2h9bLnjctpBXS4aFHI1YpJy8pmd17S5yDrIjcNS_N6ibV2ZOw6Z6KexvaSaHyIkEp18w';

// Define a service using a base URL and expected endpoints
export const regionsAndCitiesApi = createApi({
  reducerPath: 'regionsAndCitiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.vk.com/method/' }),
  endpoints: builder => ({
    getRegions: builder.query({
      query: () => ({
        url: 'database.getRegions',
        method: 'POST',
        headers: {
          accept: '*/*',
          'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://dev.vk.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `country_id=1&access_token=${access_token}&v=5.131`,
        mode: 'cors',
        credentials: 'omit',
      }),
    }),
    getRegionsLikeCities: builder.query({
      query: () => ({
        url: 'database.getCities',
        method: 'POST',
        headers: {
          accept: '*/*',
          'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://dev.vk.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `country_id=1&access_token=${access_token}&v=5.131`,
        mode: 'cors',
        credentials: 'omit',
      }),
    }),
    getCitiesByRegion: builder.query({
      query: params => ({
        url: 'database.getCities',
        method: 'POST',
        headers: {
          accept: '*/*',
          'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://dev.vk.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `country_id=1&access_token=${access_token}&region_id=${params.regionID}&count=1000&offset=${params.offset}&v=5.131`,
        mode: 'cors',
        credentials: 'omit',
      }),
    }),
    searchCities: builder.query({
      query: q => ({
        url: 'database.getCities',
        method: 'POST',
        headers: {
          accept: '*/*',
          'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://dev.vk.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `country_id=1&access_token=${access_token}&q=${q}&v=5.131`,
        mode: 'cors',
        credentials: 'omit',
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyGetRegionsQuery,
  useLazyGetCitiesByRegionQuery,
  useLazySearchCitiesQuery,
  useLazyGetRegionsLikeCitiesQuery,
} = regionsAndCitiesApi;
