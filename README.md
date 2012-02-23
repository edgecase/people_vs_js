## Dependencies

Project dependencies are managed with NPM. Don't forget to run the following command to install dependencies:

```
npm install
```

Additionally some of the project dependencies (such as Jake and Handlebars) require them to be installed globally via NPM so that they are available from the shell.

```
sudo npm install -g jake
sudo npm install -g handlebars
```

## Usage

This app relies on client-side rendering of handlebars templates. These templates must be precompiled before the app is run, or upon any changes for the app to function properly. To facilitate this we have built in some jake (node equivalent of rake) tasks.

```
// one time compile all templates
jake compile
```

```
// watch the template folder for changes and recompile automatically
// this is best for use if you are developing the templates
jake watch
```

The app runs as a standard node app by executing:
```
node server.js
```

Once the app is running there are two urls available:

  - http://localhost:3000/presenter
  - http://localhost:3000

The presenter url is secured via basic authentication, the login for which is currently hardcoded to be: presenter/esacegde


This app is not gauranteed in any way to be bug free. It was an exercise for our particular conference presentation and though we have done our best to squash any bugs that we know exist, there may still be some lurking in the dark corners.

## License
Copyright (c) 2011 EdgeCase LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
