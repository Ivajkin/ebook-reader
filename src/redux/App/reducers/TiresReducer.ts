import { createReducer } from '@reduxjs/toolkit';
import { Tire, TiresState } from '../../../types/tiresTypes';

import {
  addTire,
  clearTires,
  initTires,
  turnOnModeAll,
  turnOnModeHalf,
  turnOnModeNone,
} from '../actions/tiresActions/index';
const emptyTire: Tire = {
  mark: {
    id: null,
    value: null,
  },
  model: {
    id: null,
    value: null,
  },
  profile: null,
  radius: null,
  remainder: null,
  width: null,
  photos: [],
};
const initialState: TiresState = {
  tiresOwn: {
    leftTop: {
      tire: emptyTire,
      id: 117,
    },
    rightTop: {
      tire: emptyTire,
      id: 118,
    },
    leftDown: {
      tire: emptyTire,
      id: 119,
    },
    rightDown: {
      tire: emptyTire,
      id: 120,
    },
  },
  tiresProcessed: {
    leftTop: {
      ...emptyTire,
      id: 117,
    },
    rightTop: {
      ...emptyTire,
      id: 118,
    },
    leftDown: {
      ...emptyTire,
      id: 119,
    },
    rightDown: {
      ...emptyTire,
      id: 120,
    },
  },
  mode: 'none',
};

const checkTire = tire => {
  try {

    return (
      tire?.mark?.id !== null ||
      tire?.profile !== null ||
      tire?.width !== null ||
      tire?.radius !== null ||
      tire?.remainder !== null ||
      tire?.photos?.length !== 0
    );
  } catch {
    return false;
  }
};
export const tiresReducer = createReducer(initialState, builder => {
  builder
    .addCase(initTires, (state, action) => {
      let tires_pre = action.payload;
      //let place = action.payload.place;
      let tires = {};
      Object.keys(state.tiresProcessed).map(place => {
        tires[place] = { ...emptyTire, ...tires_pre[place] };
      });
      let newTiresOwn = state.tiresOwn;
      let newTiresProcessed = state.tiresProcessed;
      Object.keys(tires).map(place => {
        let isConfigured = checkTire(tires[place]);
        if (isConfigured) {
          newTiresOwn[place] = {
            tire: tires[place],
            id: state.tiresOwn[place].id,
          };
          newTiresProcessed[place] = tires[place];
        }
      });
      state.tiresOwn = newTiresOwn;
      state.tiresProcessed = newTiresProcessed;
    })
    .addCase(addTire, (state, action) => {
      let place = action.payload.place;
      let tire = action.payload.tire;

      state.tiresOwn[place] = {
        tire: {
          ...tire,
        },
        id: state.tiresOwn[place].id,
      };

      if (state.mode === 'half') {
        if (place === 'leftDown') {
          state.tiresProcessed.leftDown = {
            ...tire,
            id: state.tiresProcessed.leftDown.id,
          };
          state.tiresProcessed.rightDown = {
            ...tire,
            id: state.tiresProcessed.rightDown.id,
            //photos: state.tiresProcessed.rightDown.photos,
          };
        } else if (place === 'rightDown') {
          state.tiresProcessed.rightDown = {
            ...tire,
            id: state.tiresProcessed.rightDown.id,
          };
          state.tiresProcessed.leftDown = {
            ...tire,
            id: state.tiresProcessed.leftDown.id,
            //photos: state.tiresProcessed.leftDown.photos,
          };
        } else if (place === 'leftTop') {
          state.tiresProcessed.leftTop = {
            ...tire,
            id: state.tiresProcessed.leftTop.id,
          };
          state.tiresProcessed.rightTop = {
            ...tire,
            id: state.tiresProcessed.rightTop.id,
            //photos: state.tiresProcessed.rightTop.photos,
          };
        } else if (place === 'rightTop') {
          state.tiresProcessed.rightTop = {
            ...tire,
            id: state.tiresProcessed.rightTop.id,
          };
          state.tiresProcessed.leftTop = {
            ...tire,
            id: state.tiresProcessed.leftTop.id,
            //photos: state.tiresProcessed.leftTop.photos,
          };
        }
      } else if (state.mode === 'all') {
        Object.keys(state.tiresProcessed).map(key => {

          let newTire = {
            ...tire,
            //photos: state.tiresProcessed[key].photos,
            id: state.tiresProcessed[key].id,
          };
          if (key === place) {
            newTire = {
              ...tire,
              id: state.tiresProcessed[key].id,
            };
          }

          state.tiresProcessed[key] = newTire;

        });

      } else {
        state.tiresProcessed[place] = {
          ...tire,
          id: state.tiresOwn[place].id,
        };
      }
    })
    .addCase(turnOnModeHalf, (state, action) => {
      state.mode = 'half';
      let topKey =  ['leftTop', 'rightTop'].find((tireKey) => checkTire(state.tiresOwn[tireKey].tire) )
      let bottomKey = ['leftDown', 'rightDown'].find((tireKey) => checkTire(state.tiresOwn[tireKey].tire) )
      if (topKey){
        ['leftTop', 'rightTop'].map(key => {

          let newTire = {
            ...state.tiresOwn[topKey].tire,
            //photos: state.tiresProcessed[key].photos,
            id: state.tiresProcessed[key].id,
          };
          if (key === topKey) {
            newTire = {
              ...newTire,
              id: state.tiresProcessed[key].id,
            };
          }

          state.tiresProcessed[key] = newTire;

        });
      }
      if (bottomKey){
        ['leftDown', 'rightDown'].map(key => {

          let newTire = {
            ...state.tiresOwn[bottomKey].tire,
            //photos: state.tiresProcessed[key].photos,
            id: state.tiresProcessed[key].id,
          };
          if (key === topKey) {
            newTire = {
              ...newTire,
              id: state.tiresProcessed[key].id,
            };
          }

          state.tiresProcessed[key] = newTire;

        });
      }


    })
    .addCase(turnOnModeAll, (state, action) => {
      state.mode = 'all';
      let filledTireKey = Object.keys(state.tiresOwn).find((tireKey) => checkTire(state.tiresOwn[tireKey].tire) )
      if (filledTireKey){
        Object.keys(state.tiresProcessed).map(key => {

          let newTire = {
            ...state.tiresOwn[filledTireKey].tire,
            //photos: state.tiresProcessed[key].photos,
            id: state.tiresProcessed[key].id,
          };
          if (key === filledTireKey) {
            newTire = {
              ...newTire,
              id: state.tiresProcessed[key].id,
            };
          }

          state.tiresProcessed[key] = newTire;

        });
      }
    })
    .addCase(turnOnModeNone, (state, action) => {
      state.mode = 'none';

      Object.keys(state.tiresOwn).forEach((tireKey)=>{
        let newTire = {
          ...state.tiresOwn[tireKey].tire,
          id: state.tiresOwn[tireKey].id,
        };

        state.tiresProcessed[tireKey] = newTire;

      })
    })
    .addCase(clearTires, (state, action) => {
      state.tiresProcessed = initialState.tiresProcessed;
      state.tiresOwn = initialState.tiresOwn;
      state.mode = initialState.mode;
    });
});
