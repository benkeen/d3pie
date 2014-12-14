## d3pie

### About
d3pie is a highly configurable, re-usable script built on d3.js and jQuery for creating clear, attractive pie charts.
It's free, open source, and the source code for the website and script are found right here on github.

Visit [d3pie.org](http://d3pie.org) to learn about the script and create your own pie charts via the online
generation tool. This section is to document the codebase only. The website contains the script download links, standalone
examples, full documentation and lots of demo pies for you to play around with. That's the place to start!

<img src="http://d3pie.org/website/images/d3pie-screenshot.png" alt="d3pie" title="d3pie" style="float:right" />

### Download

To download the script, go to the [./d3pie](d3pie) folder and pick one of the files (minimized or not).

### The code

If you fancy hacking on the d3pie code, awesome! Visit the [./d3pie-source](d3pie-source) folder. That contains some
more info about how the code is organized and how the file is generated.

### The website

I wrote the website along with the script itself, and with the generator in particular in mind. The generator is my
version of TDD (test-driven-development). It's a UI that tests all (or almost all) features of the script to confirm
everything works as expected. So as I developed d3pie, I added the UI to generate pie charts with the available
settings. It felt, and still feels, like a very logical way to develop code - and never loses sight of the fact that this
script is intended for consumption by human beings.

Anyway, I digress. This codebase contains the website code as well as the d3pie code. It uses requireJS and Handlebars,
and a few other helper libraries here and there (jQuery, jQuery UI and others - see below). For the build process, I
use Grunt - it minifies everything (CSS, JS), precompiles the Handlebar templates and bundles everything into
md5-renamed files. It saves about 0.5MB of space. Yay. I also use grunt to build the d3pie.js and d3pie.min.js files.
See the gruntfile for the various tasks for all that.

### Script used on the website

Lots! A big thanks to the developers of these scripts.

- jQuery, jQuery UI
- jQuery slides
- Bootstrap
- momentJS
- Handlebars
- prettify
- three.js
- Modernizr
- requireJS
- grunt, npm

### Changelog

- `0.1.5` - Dec 14, 2014. placeholderParser option added for tooltips; bug fixes.
- `0.1.4` - Nov 16, 2014, Tooltips added, bug fixes.
- `0.1.3` - July 2, 2014. Small segment grouping option added; jQuery dependency dropped.
- `0.1.2` - June 7, 2014. Assorted bug fixes.
- `0.1.1` - May 7, 2014. Gradients added.
- `0.1.0` - April 24, 2014. Initial version

### Licence

MIT.
