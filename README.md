# Gitea

Check your notifications and manage issues and pull requests.

## Configuring a Personal Access Token and Server URL

1. Go to your Gitea Server(e.g. https://gitea.com) user settings.
2. Click "Applications".
3. Add a token name and select the scopes you want.
4. Click "Generate token".
5. Copy the token and paste it into the "Access Token" field.
6. Add your server url to the "Gitea URL" field.

## Scopes

To use this extension to its fullest potential, you need to set following scopes while creating your access token:

- notification -> read and write
- repository -> read and write
- user -> read and write
