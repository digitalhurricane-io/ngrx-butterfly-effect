## NGRX Butterfly Effect

When you start having effects that trigger effects that trigger effects, it can get confusing quickly.

With the butterfly effect, you can cleanly and clearly define what effects trigger other effects.

Technically you're dispatching one or more action based on another action, with the purpose being to keep your effects neat, organized, and easy to read.

If the triggering action has a payload property, it will be passed on to the action(s) it dispatches.

I prefer to put the butterfly effect at the top of my effects file for easy reference.

Use it like this in your effects class:
```
be$ = butterflyEffect(this.actions$,

    on(aSuccess).dispatch(
        bStart,
        cStart,
    ),

    on(cSuccess).dispatch(
        dStart,
    )
)
```

