'use strict';

import { combineReducers } from 'redux';
import { List, Map } from 'immutable';

import { BinData } from './Components/Dumb/Bin';
import { Action } from './actions';
import { SET_BINS, SAVE_BINS, ADD_BIN, DELETE_BIN, SET_BIN_AVAILABILITY } from './actions';
import { ADD_PENDING_ACTION, DELETE_PENDING_ACTION } from './actions';
import { SET_BIN_EDIT_MODE, SET_WASTE_SELECT_MODE, SELECT_BIN } from './actions';

// console.log('ACTION TYPE', Action);
// var Action = Action;

// Bins is the state of all bins
var initialBinState = List<BinData>([]);
function bins (state = initialBinState, action: Action) {
    switch (action.type) {
        case SET_BINS:
            return state.merge(state, action.bins);

        case SAVE_BINS: // dummy action, just to be sent over to server
            return state;
            
        case ADD_BIN:
            return state.push(action.bin);

        case DELETE_BIN:
            return state.delete(action.id);

        case SET_BIN_AVAILABILITY:
            var bin = state.get(action.id);
            var updatedBin = (<any>Object.assign)({}, bin, {isAvailable: action.isAvailable});

            return state.set(action.id, updatedBin);

        default:
            return state;
    }
}

// Pending Actions are actions that need to be validated by the server
var initialPendingState = Map<number, Action>({});

function pending (state = initialPendingState, action: Action){
    switch (action.type) {
        case ADD_PENDING_ACTION:
            return state.set(action.id, action.pendingAction);

        case DELETE_PENDING_ACTION:
            return state.delete(action.id);

        default:
            return state;
    }
}

// Display is the state of what buttons/windows/texts is on the screen
interface DisplayState {
    isEditingBins: boolean;
    isSelectingWaste: boolean;
    selectedBin: number;
}

var displayState: DisplayState = {
    isEditingBins: false,
    isSelectingWaste: false,
    selectedBin: undefined
};

var initialDisplayState = Map(displayState);

function display (state = initialDisplayState, action: Action){
    switch (action.type) {
        case SET_BIN_EDIT_MODE:
            return state.set('isEditingBins', action.isEditingBins);

        case SET_WASTE_SELECT_MODE:
            return state.set('isSelectingWaste', action.isSelectingWaste);

        case SELECT_BIN:
            // var current = state.get('selectedBin', action.id);
            console.log('select', action.id);
            return state.set('selectedBin', action.id);

        default:
            return state;
    }
}

const binApp = combineReducers({
    bins,
    pending,
    display
});

export default binApp;