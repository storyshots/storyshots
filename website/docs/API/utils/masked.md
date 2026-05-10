# masked {#masked}

[Mask](/API/test-components/actor#masking) the specified elements on all snapshots in the provided stories:

```ts
// Will cover the current date display element with a special mask
masked(
  {
    // List of elements to mask
    mask: [finder.getByTestId('very-dynamic-element')],
    // Mask color
    color: 'pink',
  },
  stories,
);
```

:::note Merging
When composing `masked` functions:

```ts
masked(config_1, masked(config_0, stories));
```

`config_1` and `config_0` will be merged according to the following rules:

- Masked elements (`config.mask`) will be combined.
- The mask color will be taken from the latest configuration (in the example above, this will be `config_1.color`).
  :::
