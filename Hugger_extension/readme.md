# Hugger_extension
The hugger extension contains the required files for a correct browser extension (Chrome) as provided in their documentation.
a manifest.json file, and simple icons I created for the extension logo in the browser bar and in the extension setting.

The extension is very simple, it has three important parts

- **The popup.html file:** This is the part that opens up when you click the extension icon. It is built with html, tailwindcss and has logic from the popup.js file. The Tailwind folder is in the directory including the config and source file, excluding the node modules, which can be gotten by running a ```npm install``` or a ```yarn install``` in the Tailwind directory. There is a build and watch script command for watching for tailwind directives in the HTML and js file, with an output to the popup.css file. You can see and modify them in the 'package.json' file, or run them with either ```npm run <watch | build>``` in the Tailwind directory.

- **The popup.js file:** This is the script file to the popup.htm file. It checks if the extension is triggered on a linkedin page by checking for the presence of a 'linkedin/in/' in the url, which is unique to user profiles. If it is not, it shows an error message, and also disables the 'Save to sheet' button, it leaves the 'View sheet' button so it is possbile to quickly reach the sheet for saved data on any page. The popup.js file, also sends an internal a message to the contentscript file(content.js) to get the username and userimage, which it shows in the popup.html file. Finally, once all is done, it sends a post request containing the url of the page, to the googlesheet listener.

- **The contentscript:** The content.js file is allows for script to be run in the context of the webpage being viewed. That means that I can query the DOM elements on the linkedin page, find the element holding the user profile picture and the user name, which is supplied in the image alt attribute field, and then send that to othe popup.js file, which in turns renders that on the popup.html view.

That is all to the Hugger extension.
Simple yet effective.

If you find any appliable fix or possible improvement, please do not hesitate to send in a fix pull request.