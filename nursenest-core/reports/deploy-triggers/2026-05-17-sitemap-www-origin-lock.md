# Sitemap canonical www origin lock

Deployment marker for commit:
- `fefaaae219011df9653682892d3434bbdf8776f7`

Expected post-deploy behavior:
- `/sitemap.xml` emits child sitemap `<loc>` entries using:
  - `https://www.nursenest.ca/...`
- never `https://nursenest.ca/...`
