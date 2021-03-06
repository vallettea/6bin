'use strict';

import { combineReducers } from 'redux';
import { List, Map } from 'immutable';

import { BinData } from './Components/Dumb/Bin';
import { Action } from './actions';
import { SET_BINS, SAVE_BINS, ADD_BIN, UPDATE_BIN, DELETE_BIN, SET_BIN_AVAILABILITY } from './actions';
import { STORE_TEMP_BINS, CLEAR_TEMP_BINS } from './actions';
import { ADD_PENDING_ACTION, DELETE_PENDING_ACTION } from './actions';
import { SET_BIN_EDIT_MODE, SET_BIN_ADD_MODE, OPEN_BIN_PANEL, SELECT_BIN } from './actions';

// Bins is the state of all bins
var initialBinState = Map<string, BinData>({});
function bins (state = initialBinState, action: Action) {
    switch (action.type) {
        case SET_BINS:
            return action.bins;
            // return state.merge(state, action.bins);

        case SAVE_BINS: // dummy action, just to be sent over to server
            return state;
            
        case ADD_BIN:
            console.log('action', action);

            var newBin: BinData = {
                id: action.waste + '_' + action.id,
                isAvailable: true,
                type: action.waste,
                position: undefined
            };

            return state.set(newBin.id, newBin);

        case UPDATE_BIN:
            var updatedBin = Object.assign({}, state.get(action.id), action.delta);
            return state.set(action.id, updatedBin);

        case DELETE_BIN:
            return state.delete(action.id);

        case SET_BIN_AVAILABILITY:
            var bin = state.get(action.id);
            var updatedBin = (<any>Object.assign)({}, bin, { isAvailable: action.isAvailable });

            return state.set(action.id, updatedBin);

        default:
            return state;
    }
}

var initialTempBinState = Map<string, BinData>({});
function tempBins (state = initialTempBinState, action: Action) {
    switch (action.type) {
        case STORE_TEMP_BINS:
            return state.merge(state, action.bins);

        case CLEAR_TEMP_BINS:
            return Map({});
        
        default:
            return state;
    }
}

// Pending Actions are actions that need to be validated by the server
var initialPendingState = Map<number, Action>({});

function pending (state = initialPendingState, action: Action){
    switch (action.type) {
        case ADD_PENDING_ACTION:
            return state.set(action.index, action.pendingAction);

        case DELETE_PENDING_ACTION:
            return state.delete(action.index);

        default:
            return state;
    }
}

// Display is the state of what buttons/windows/texts is on the screen
interface DisplayState {
    isEditingBins: boolean;
    isAddingBins: boolean;
    isBinPanelOpen: boolean;
    selectedBin: string;
}

var displayState: DisplayState = {
    isEditingBins: false,
    isAddingBins: false,
    isBinPanelOpen: false,
    selectedBin: undefined
};

var initialDisplayState = Map(displayState);

function display (state = initialDisplayState, action: Action){
    switch (action.type) {
        case SET_BIN_EDIT_MODE:
            return state.set('isEditingBins', action.isEditingBins);

        case SET_BIN_ADD_MODE:
            return state.set('isAddingBins', action.isAddingBins);

        case OPEN_BIN_PANEL:
            return state.set('isBinPanelOpen', action.isBinPanelOpen);

        case SELECT_BIN:
            return state.set('selectedBin', action.id);

        default:
            return state;
    }
}

const binApp = combineReducers({
    bins,
    tempBins,
    pending,
    display
});

export default binApp;
