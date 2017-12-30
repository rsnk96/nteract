// @flow
const PREFIX = "PLAY";
const FULFILLED = "FULFILLED";
const FAILED = "FAILED";
const CANCELED = "CANCELED";

// UI-Related Action Types.
export const SET_CURRENT_KERNEL_NAME = `${PREFIX}/SET_CURRENT_KERNEL_NAME`;
export const SET_CURRENT_SERVER_ID = `${PREFIX}/SET_CURRENT_SERVER_ID`;
export const SET_PLATFORM = `${PREFIX}/SET_PLATFORM`;
export const SET_SHOW_PANEL = `${PREFIX}/SET_SHOW_PANEL`;
export const SET_SOURCE = `${PREFIX}/SET_SOURCE`;
export const SUBMIT_BINDER_FORM = `${PREFIX}/SUBMIT_BINDER_FORM`;
export const SET_CODE_MIRROR_MODE = `${PREFIX}/SET_CODE_MIRROR_MODE`;

// Server-Related Action Types
export const ACTIVATE_SERVER = `${PREFIX}/ACTIVATE_SERVER`;
export const ACTIVATE_SERVER_FULFILLED = `${PREFIX}/ACTIVATE_SERVER_${FULFILLED}`;
export const ACTIVATE_SERVER_FAILED = `${PREFIX}/ACTIVATE_SERVER_${FAILED}`;

export const KILL_SERVER = `${PREFIX}/KILL_SERVER`;
export const KILL_SERVER_FULFILLED = `${PREFIX}/KILL_SERVER_${FULFILLED}`;
export const KILL_SERVER_FAILED = `${PREFIX}/KILL_SERVER_${FAILED}`;

export const FETCH_KERNEL_SPECS = `${PREFIX}/FETCH_KERNEL_SPECS`;
export const FETCH_KERNEL_SPECS_FULFILLED = `${PREFIX}/FETCH_KERNEL_SPECS_${FULFILLED}`;
export const FETCH_KERNEL_SPECS_FAILED = `${PREFIX}/FETCH_KERNEL_SPECS_${FAILED}`;

export const ADD_SERVER_MESSAGE = `${PREFIX}/ADD_SERVER_MESSAGE`;

// Kernel-Related Action Types
export const ACTIVATE_KERNEL = `${PREFIX}/ACTIVATE_KERNEL`;
export const ACTIVATE_KERNEL_FULFILLED = `${PREFIX}/ACTIVATE_KERNEL_${FULFILLED}`;
export const ACTIVATE_KERNEL_FAILED = `${PREFIX}/ACTIVATE_KERNEL_${FAILED}`;

export const INTERRUPT_KERNEL = `${PREFIX}/INTERRUPT_KERNEL`;
export const INTERRUPT_KERNEL_FULFILLED = `${PREFIX}/INTERRUPT_KERNEL_${FULFILLED}`;
export const INTERRUPT_KERNEL_FAILED = `${PREFIX}/INTERRUPT_KERNEL_${FAILED}`;

export const KILL_KERNEL = `${PREFIX}/KILL_KERNEL`;
export const KILL_KERNEL_FULFILLED = `${PREFIX}/KILL_KERNEL_${FULFILLED}`;
export const KILL_KERNEL_FAILED = `${PREFIX}/KILL_KERNEL_${FAILED}`;

export const ADD_KERNEL_MESSAGE = `${PREFIX}/ADD_KERNEL_MESSAGE`;
export const ADD_KERNEL_OUTPUT = `${PREFIX}/ADD_KERNEL_OUTPUT`;
export const CLEAR_KERNEL_OUTPUTS = `${PREFIX}/CLEAR_KERNEL_OUTPUTS`;
export const RESTART_KERNEL = `${PREFIX}/RESTART_KERNEL`;
export const RUN_SOURCE = `${PREFIX}/RUN_SOURCE`;
export const SET_ACTIVE_KERNEL = `${PREFIX}/SET_ACTIVE_KERNEL`;
export const SET_ACTIVE_KERNEL_LANGUAGE_INFO = `${PREFIX}/SET_ACTIVE_KERNEL_LANGUAGE_INFO`;
export const SET_KERNEL_STATUS = `${PREFIX}/SET_KERNEL_STATUS`;
