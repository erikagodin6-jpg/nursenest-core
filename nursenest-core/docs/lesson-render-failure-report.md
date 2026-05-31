# Lesson Render Failure Report

## Finding

The lesson system route could fail before render because `PathwayLessonsHubPage` referenced `topicSlugsForList` without defining it in the same function scope.

## Failure Type

Likely runtime exception:

```text
ReferenceError: topicSlugsForList is not defined
```

## Affected Flow

System cards generate URLs such as:

```text
/canada/rn/nclex-rn/lessons?topicSlug=cardiovascular
```

The route then enters the filtered lesson hub branch. Before this fix, `listOpts` attempted to use `topicSlugsForList`, but the variable existed only in `generateMetadata`.

## Rendering Evidence Added

`LessonRuntimeTraceClient` now logs `client_rendered` for topic-filtered routes after hydration. If server traces show `query_completed` but this client trace does not appear, the failure has moved to rendering or hydration.

## Regression Guard

`src/lib/lessons/lesson-system-navigation.test.ts` now asserts that both `generateMetadata` and `PathwayLessonsHubPage` define:

- `topicSlugCandidates`
- `topicSlugsForList`

This prevents the same scope bug from returning silently.
