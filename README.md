# Gitea

Check your notifications, explore repositories, and manage issues and pull requests.

## Configuration

You need to configure your personal access token and server URL to use this extension.

### Configuring a Personal Access Token and Server URL

1. Go to your Gitea Server (e.g. https://gitea.com).
2. Open your user settings.
3. Click "Applications".
4. Add a token name and select the scopes you want (recommended scopes below).
5. Click "Generate token".
6. Copy the token and paste it into the "Access Token" field.
7. Add your server url to the "Gitea URL" field.

### Recommended Scopes

To use this extension to its fullest potential, you need to set following scopes while creating your access token:

| Scope        | Permissions    |
| ------------ | -------------- |
| notification | read and write |
| repository   | read and write |
| user         | read and write |
