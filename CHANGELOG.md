# Gitea Changelog

## [Improved Browsing and Notifications] - {PR_MERGE_DATE}

### New Features

- Search issues from repositories -- Repository actions now include Search Issues, opening issue search scoped to the selected repository with `repo:owner/name` query syntax.

### Improvements

- Repository commands now use server-side search
- Improve issue creation by validating selected labels, milestones, and assignees before submission
- Improve notification actions, menu bar refresh behavior, and links to the latest notification comment
- Align the My Pull Requests repository category with Forgejo's "In your repositories" behavior

### Fixed

- Keep issue creation usable when some repository metadata cannot be loaded, with clearer failure messages
- Show more detailed Gitea API errors across repository, issue, pull request, user, and notification requests

## [Added Gitea] - 2026-06-04

Initial release of the Gitea extension for Raycast.
