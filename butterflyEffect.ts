import { Actions, createEffect } from '@ngrx/effects';

import { mergeMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ActionCreator, Creator, Action } from '@ngrx/store';


class ButterflyAction {
    toDispatch: ActionCreator<string, Creator>[] = [];

    constructor(public actionCreator: ActionCreator<string, Creator>) { }

    dispatch(...acs: ActionCreator<string, Creator>[]) {
        acs.forEach((a) => this.toDispatch.push(a));
        return this;
    }
}

export function on(actionCreator: ActionCreator<string, Creator>) {
    return new ButterflyAction(actionCreator);
}


// Dispatch actions in response to other actions in a clean way.
// If the trigger action has a payload property, it will be passed on to the dispatched actions.
//
// butterflyEffect(this.actions$,
//
//     on(aSuccess).dispatch(
//         bStart,
//         cStart
//     ),
//     on(cSuccess).dispatch(
//         dStart,
//     )
// )
//
export function butterflyEffect(actions$: Actions, ...bActions: ButterflyAction[]) {
    const butterflyActions = Array.from(bActions);

    return createEffect(() => {
        return actions$.pipe(
            mergeMap((incomingAction: ActionCreator) => {

                // see if we have a matching action
                const match = butterflyActions.find((b: ButterflyAction) => b.actionCreator.type == incomingAction.type);
                if (!match) {
                    return EMPTY;
                }

                // We found a matching action, so put all the actions we're supposed to dispatch into an array.
                // If the incoming action had a payload, pass it on.
                const toDispatch = match.toDispatch.map((ac: ActionCreator<string, Creator>) => {
                    if ((incomingAction as any).payload != undefined) {
                        // incoming action has a payload, so pass it on
                        return ac({ payload: (incomingAction as any).payload });
                    }
                    return ac();
                }) as Action[]


                return toDispatch;
            })
        )
    });
 
}