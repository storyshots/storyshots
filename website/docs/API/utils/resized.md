# resized {#resized}

Sets [screen dimensions](/API/test-components/actor#resize) for the provided stories:

```ts
resized(
  // Accepts a story configuration object
  ({ device }) =>
    // On mobile devices, the screen will be stretched vertically to fit the entire page content
    device.name === 'mobile' ? { height: 1200 } : undefined,
  stories,
);
```