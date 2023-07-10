let access_token =
  'vk1.a.OTOwzyy-V1umZS3O11SAYo5VEH6WsiB-9f_s6lF97QXFP6gtqVIqG749WVvHOsokGDj_RmXB9EV484ElSsAMV7fgK-u5BFOMEaKqIW9u8JEIS_Ak6UJjTw2ZUbJ1HfwQuVcHRaQ-6DwSzV3yK-2h9bLnjctpBXS4aFHI1YpJy8pmd17S5yDrIjcNS_N6ibV2ZOw6Z6KexvaSaHyIkEp18w';
const getRegions = async () => {
  let regions = await fetch('https://api.vk.com/method/database.getRegions', {
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
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
  })
    .then(response => response.json())
    .then(data => {
      return data.response;
    })
    .catch(err => {
      console.log('get regions error, RegionsAndCities', err);
    });

  return regions;
};
const getCitiesByRegion = async regionID => {
  let cities = await fetch('https://api.vk.com/method/database.getCities', {
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
    body: `country_id=1&access_token=${access_token}&region_id=${regionID}&count=${5}&v=5.131`,
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
  })
    .then(response => response.json())
    .then(data => {
      return data.response;
    })
    .catch(err => {
      console.log('get cities by region err, RegionsAndCities', err);
    });
  return cities;
};

export default { getRegions, getCitiesByRegion };
