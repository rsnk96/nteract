// Flow goes crazy when this file is typed, raising errors throughout the project.
// I believe it's related to the intersection type of DesktopNotebookAppState.
// Lots of open bugs around intersection types, and they're used inside Immutable.js too, so layers upon layers.
// https://github.com/facebook/flow/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+intersect

import * as actions from "../actions";
import * as actionTypes from "../actionTypes";

import {
  makeDesktopNotebookRecord,
  DESKTOP_NOTEBOOK_CLOSING_NOT_STARTED,
  DESKTOP_NOTEBOOK_CLOSING_STARTED,
  DESKTOP_NOTEBOOK_CLOSING_READY_TO_CLOSE
} from "../state.js";

import {
  actionTypes as coreActionTypes,
  actions as coreActions,
  selectors
} from "@nteract/core";

import { Observable } from "rxjs/Observable";
import { empty } from "rxjs/observable/empty";
import { of } from "rxjs/observable/of";
import { zip } from "rxjs/observable/zip";
import { concat } from "rxjs/observable/concat";

import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  switchMap,
  take,
  tap,
  timeout
} from "rxjs/operators";

import { ActionsObservable, ofType } from "redux-observable";

import { remote, ipcRenderer as ipc } from "electron";

export const closeNotebookEpic = (action$: ActionsObservable<*>, store: *) =>
  action$.pipe(
    ofType(actionTypes.CLOSE_NOTEBOOK),
    exhaustMap((action: actionTypes.CloseNotebook) => {
      const contentRef = action.payload.contentRef;
      const state = store.getState();
      const model = selectors.model(state, { contentRef });

      var dirtyPromptObservable: Observable<boolean>;
      if (selectors.notebook.isDirty(model)) {
        dirtyPromptObservable = Observable.create(observer => {
          const promptDialog = {
            type: "question",
            buttons: ["Yes", "No"],
            title: "Confirm",
            message: "Unsaved data will be lost. Are you sure you want to quit?"
          };
          ipc.once("show-message-box-response", (event, arg) => {
            observer.next(arg === 0);
            observer.complete();
          });
          ipc.send("show-message-box", promptDialog);
        });
      } else {
        dirtyPromptObservable = of(true);
      }

      const killKernelActions = [];
      const killKernelAwaits = [];
      state.core.entities.kernels.byRef.forEach((kernel, kernelRef) => {
        // Skip if kernel unknown
        if (!kernel || !kernel.type) {
          return;
        }

        if (kernel.type === "zeromq") {
          killKernelActions.push(
            coreActions.killKernel({
              restarting: false,
              kernelRef: kernelRef
            })
          );

          killKernelAwaits.push(
            action$.pipe(
              ofType(
                coreActionTypes.KILL_KERNEL_SUCCESSFUL,
                coreActionTypes.KILL_KERNEL_FAILED
              ),
              filter(action => action.payload.kernelRef === kernelRef),
              take(1)
            )
          );
        } else if (kernel.type === "websocket") {
          console.log(
            "Need to implement a way to shutdown websocket kernels on desktop"
          );
        }
      });

      const killKernels = of(...killKernelActions);

      const awaitKillKernelResults = zip(...killKernelAwaits).pipe(
        timeout(1000 * 5), // This should be at least as long as the timeout used to wait for kernel to reply to shutdown msgs
        tap(result => {
          for (let r of result) {
            console.log(JSON.stringify(r)); // To see these in terminal, set ELECTRON_ENABLE_LOGGING=1. Could also start more explicitly routing them to main process stdout.
          }
        }),
        concatMap(_ =>
          // We don't need the results. Further, allowing the Array<Action> to flow through error middleware crashed
          // node.js for me, with "Error: async hook stack has become corrupted (actual: 1528, expected: 0)".
          // Seemed related to the error middleware not expecting an Array (returning result[0] avoids the crash as
          // well).
          empty()
        ),
        catchError((error: Error) => {
          console.log(
            "One or more kernels failed to shutdown properly in the allocated time."
          );
          console.log(error.message);
          return empty(); // Just carry on with closing.
        })
      );

      const updateClosingState = of(
        actions.closeNotebookProgress({
          newState: DESKTOP_NOTEBOOK_CLOSING_READY_TO_CLOSE // This is what allows the window to unload
        })
      );

      const initiateClose = Observable.create(observer => {
        console.log("Kernel shutdown complete; closing notebook window...");
        window.close();
        observer.complete();
      });

      return dirtyPromptObservable.pipe(
        concatMap((proceed: boolean) => {
          if (!proceed) {
            // Cancel any full-app shutdown in flight
            ipc.send("close-notebook-canceled");

            // Reset notebook state to allow another attempt later
            return of(
              actions.closeNotebookProgress({
                newState: DESKTOP_NOTEBOOK_CLOSING_NOT_STARTED
              })
            );
          }

          return concat(
            killKernels,
            awaitKillKernelResults,
            updateClosingState,
            initiateClose
          );
        })
      );
    })
  );
