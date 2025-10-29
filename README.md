# Gitea Raycast Extension

Check your notifications, explore repositories, and manage issues and pull requests.

## Installation

Currently, you need to clone this repo and install it locally in developer mode.

You will need to have [Node.js](https://nodejs.org) installed.

### Steps

1. Clone this repo `git clone https://github.com/mitsimi/raycast-gitea.git`
2. Go to the folder `cd raycast-gitea`
3. Install dependencies `npm install`
4. Go to Raycast, run `Import Extension` and select the folder

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

## Language Colors

This extension uses [`assets/colors.json`](assets/colors.json), a file derived from the [GitHub Linguist project](https://github.com/github-linguist/linguist).  
It contains metadata and color mappings for over 8,000 programming languages, markup languages, and data formats.
