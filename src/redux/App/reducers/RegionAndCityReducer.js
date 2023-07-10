import { createReducer } from '@reduxjs/toolkit';

import {
  addChosenCity,
  addChosenRegion,
  addCityToRegionsShown,
  addRegionToRegionsShown,
  clearChosen,
  clearRegionsShown,
  deleteChosenCity,
  deleteChosenRegion,
  initRegions,
  setRegionCities,
  setRegionCollapsed,
  setRegionsShownToNoSearchMode,
} from '../actions/regionAndCityActions';

const initialState = {
  regions: [],
  regionsShown: [],
  regionsChosen: [],
  citiesChosen: [],
};

export const regionAndCityReducer = createReducer(initialState, builder => {
  builder
    .addCase(initRegions, (state, action) => {
      let loadedRegions = action.payload;
      if (loadedRegions !== null) {
        let clearRegions = action.payload.map((el, i) => {
          return {
            region: el,
            isCollapsed: true,
            data: [],
            index: i,
          };
        });
        state.regions = clearRegions;
        state.regionsShown = clearRegions;
      }
    })
    .addCase(setRegionCities, (state, action) => {
      let { cities, regionID } = action.payload;
      state.regions = state.regions.map(el => {
        if (el.region.id === regionID) {
          return {
            ...el,
            data: cities,
          };
        } else {
          return el;
        }
      });
      let foundRegion = state.regionsChosen.find(el => el.id === regionID);
      if (foundRegion !== undefined) {
        state.citiesChosen = [...state.citiesChosen, ...cities];
      }
    })
    .addCase(setRegionCollapsed, (state, action) => {
      let { isCollapsed, regionID } = action.payload;
      state.regions = state.regions.map(el => {
        if (el.region.id === regionID) {
          return {
            ...el,
            isCollapsed,
          };
        } else {
          return el;
        }
      });
    })
    .addCase(addChosenRegion, (state, action) => {
      let region = action.payload;
      let foundRegion = state.regionsChosen.find(el => {
        return el.title === region.title;
      });
      
      if (foundRegion === undefined) {
        state.regionsChosen = [...state.regionsChosen, region];
      }
    })
    .addCase(deleteChosenRegion, (state, action) => {
      let region = action.payload;
      state.regionsChosen = state.regionsChosen.filter(el => !(el.title === region.title));
    })
    .addCase(addChosenCity, (state, action) => {
      
      let city = action.payload;
      let foundCity = state.citiesChosen.find(el => el.id === city.id);
      if (foundCity === undefined) {
        state.citiesChosen.push(city);
      }
    })
    .addCase(deleteChosenCity, (state, action) => {
      let city = action.payload;
      state.citiesChosen = state.citiesChosen.filter(el => !(el.id === city.id));
      if (city.hasOwnProperty('region')) {
        let region = city.region;
        state.regionsChosen = state.regionsChosen.filter(regionChosen => regionChosen.title !== region);
      }
      
    })
    .addCase(clearChosen, (state, action) => {
      state.citiesChosen = initialState.citiesChosen;
      state.regionsChosen = initialState.regionsChosen;
    })
    .addCase(addCityToRegionsShown, (state, action) => {
      let item = action.payload;
      //checking if item is associated with region
      // let clearedRegions = state.regions.map(region => {
      //   return {
      //     ...region,
      //     data: [],
      //   };
      // });
      if (item.hasOwnProperty('region')) {
        let newRegionsShown = state.regionsShown;

        //is there something to show in this region already?
        let foundRegionShown = state.regionsShown.find(
          regionShown => regionShown.region.title === item.region
        );
        if (foundRegionShown === undefined) {
          //creating blank
          let foundRegion = state.regions.find(region => region.region.title === item.region);
          //add new showed region
          if (foundRegion !== undefined) {
            newRegionsShown.push({
              ...foundRegion,
              data: [item],
            });
          }
        } else {
          //add item to existing
          newRegionsShown = state.regionsShown.map(regionShown => {
            if (regionShown.region.title === item.region) {
              return {
                ...regionShown,
                data: [...regionShown.data, item],
              };
            }
            return regionShown;
          });
        }
        state.regionsShown = newRegionsShown;
      }
    })
    .addCase(clearRegionsShown, (state, action) => {
      state.regionsShown = [];
    })
    .addCase(setRegionsShownToNoSearchMode, (state, action) => {
      //form it from regions and chosens
      state.regionsShown = state.regions;
      state.citiesChosen.forEach(cityChosen => {
        let foundRegionIndex = state.regions.findIndex(
          region => region.region.title === cityChosen.region
        );
        if (foundRegionIndex !== -1) {
          state.regionsShown[foundRegionIndex].data = [
            ...state.regionsShown[foundRegionIndex].data,
            cityChosen,
          ];
        }
      });
    })
    .addCase(addRegionToRegionsShown, (state, action) => {
      let text = action.payload;
      state.regions.forEach(region => {
        if (region.region.title.startsWith(text)) {
          let findRegionShownIndex = state.regionsShown.findIndex(
            regionShown => regionShown.region.title === region.region.title
          );
          if (findRegionShownIndex === -1) {
            state.regionsShown = [...state.regionsShown, region];
          }
        }
      });
    });
});
