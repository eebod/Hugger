# Googlesheet (appscript file)
This contains a hugger-appscript, not JS, but a JS based scripting language, that was developed by Google for automating tasks across the Google workspace.
It only gets used in a Google-workspace scripting environment.

In the file, there are three important things to take note of
- **A doPost function** that listens for post requests and data. This is an internally provided function that I set to listen to post requests sending the url in a json format from the browser extension.

<br>

- **A service provider** for fetching the user data. The simplest way for me to correctly and reliably get user profile data is with a providing API. I initially tried reading it from the DOM, and it was a real hassle, cause
Linkedin rotates element classnames, ID and even xpaths. In this case I found a generous free API service for my small use case on [rapidapi](https://rapidapi.com/).

    - It provides 50 free calls per month, never exceeded that for my use case, and even if I do, I could really squeeze out a lot from all similar free tier Linkedin API providers on the rapidapi platform, aggregating them and just scoping them to different functions that try eachother when I get a 'credit-exhuasted' error for one.

    - To use the gs file correctly, sign-up on rapid api, get a free-tier account and swap out the api-key value. I use the makePostRequest function to use the user url to fetch their data from the endpoint.

<br>

- **An appendToSheet function** that takes in the parsed data gotten back from the makePostRequest function, which then adds that to the sheet. It takes in the data, does a little bit of formatting and checks for data availaibility, and then writes
that to the next available row in the spreadsheet. I also added a date to the row data, just for historical purpose, if you need to find by when you added or somehting/


That's all there is to the appscript.
If you find any appliable fix or possible improvement, please do not hesitate to send in a fix pull request.