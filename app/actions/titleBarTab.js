import * as TYPES from './types';

export function switchTitleBarTab(selTabIndex) {
    return {
        type: TYPES.SWITCH_TITLE_BAR_TAB,
        selTabIndex: selTabIndex
    }
}