---
sidebar_position: 2
---

# filter {#filter}

Filters out [stories](/specification/requirements/borders) that do not satisfy the predicate:

```ts
// Keep stories that mention 'user' in their title
filter(stories, (story) => story.title.includes('user'));
```
