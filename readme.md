# Linkedin Hugger
A repository for a chrome extension and an appscript that makes it possible to pull Linkedin user profile information via their page straight to a googlesheet.

There are two folders in this repository.
- Googlesheet
- Hugger_extension

They both work together as a part of the complete solution.

## Hugger_extension
The Hugger_extension is a browser-extension(Developed for Chrome), that gets installed on a browser, correctly gets and render a user's image and name data, and then sends the user url to to the google sheet.
More information on how the extension works is provided in its own folder readme [here](https://github.com/eebod/Hugger/blob/main/Hugger_extension/README.md)

## Googlesheet (appscript file)
The Googlesheet folder contains an appscript for a Google's spreadsheet that listens and receives the URL(sent from the extension), uses a service provider to get the user data, and appends the formatted user data to the previous documents in the sheet.
More information is provided in its readme file [here](https://github.com/eebod/Hugger/blob/main/Googlesheet/README.md).

## Watch me use this project
<!-- [![Watch me use this project](<img-link>)](<video-url>)  
Click on Image to Youtube video or use link: <video-url> -->

## Help Improve
You can also contribute to improving how this works, by sending in a pull request. It can be to fix a problem, improve a section, or to add a new feature.

## Reach me
This was written and developed by me, Ebode.
You can find more adventurous solutions I have developed in my corner [here](https://ebode.dev).