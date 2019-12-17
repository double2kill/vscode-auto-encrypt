# auto-encrypt

auto encrypt secret files to encrypted files. you can push encrypted files to github.

# Change Log

update `auto-encrypt@0.0.2`

## [v0.0.4] - 2019-11-6
### fix

- extension can not run in mac os system [#1](https://github.com/double2kill/vscode-auto-encrypt/issues/1)

## [v0.0.2] - 2018-11-27
### fix

- downgrade `event-stream@3.3.4` to remove package [`flatmap-stream`](https://github.com/dominictarr/event-stream/issues/116)

# Motivation

There are some auth settings in my server, I need to set auth files into `.gitignore` file and copy these file to other computer through safe ways. It is very troublesome to copy files especially when these secret files updated. Just want to publish encrypt files to github and decrypt them when I want to use.

## Features
* **auto encrypt when a secret file save**
* **auto decrypt when a secret file open**
* read your encrypt password in user settings
* setting your secret files in `.encryptrc`(only one file in v0.0.1)

![Usage](images/auto-encrypt.gif)

## Extension Settings

*user settings*:
* `auto-encrypt.password`: auto-encrypt password.

*example: **settings.json** file in vscode extension user settings*
```
{
  ...,
  "auto-encrypt.password": "123456",
}
```

*file settings*
* `.encryptrc`: set a file to a secret file that considered as target file by auto-encrypt extension

*example: **.encryptrc** file in workspace root folder*
```
password.js
```

**Enjoy!**
