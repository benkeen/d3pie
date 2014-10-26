## d3pie source

#### Overview

So when I started developing this script I launched into writing it all in a single file because, hey, it's going need
to end up that way anyway. Well that was pretty shortsighted. It didn't take long to get completely unmanageable. So I
split it up into logical groups and I use grunt to combine them. The final, generated files found in /d3pie:
`jquery.d3pie.min.js` and `jquery.d3pie.js`. This let me organize the code far better and keeps me sane in the process.
To re-generate the code from these source files, just run:

`grunt bundle`

(Yeah, you'll need to Google <code>Grunt</code> & get it installed first. I know it's a pain for newbies, but you'll
thank me. Honest. Tough love).

The end code is a little more verbose than it need be because I wrapped each file except `core.js` into their
own module pattern. The advantage was that this makes it really clear from a dev perspective: you know where a chunk of
code is grouped by it's `d3pie.helpers` or `d3.math` prefix.

#### Relationship to the website

None! Well, basically none. The website uses the same version of d3pie that's available for download - it just
makes judicious use of the available API functions to update / redraw the pie charts, to provide the generator
functionality.

### The files

* `d3pie-source.js` - this is the top level file. It contains the jQuery wrapper, and the main logic for the script:
the d3pie object, initialization function and all the code for actually generating the pie. This is the only part that
contains references to "this". All other files are helpers, and are passed data from d3pie-source.
* `_helpers.js` - all manner of helper functionality. If I end up dropping the jQuery dependency, all the jQuery shims
will end up here.
* `_labels.js` - code relating to the pie chart labels, label lines.
* `_math.js` - hard stuff which I'm ashamed to say I'd largely forgotten from high school.
* `_default-settings.js` the default settings for the pie chart.
* `_validate.js` - code for validating the user's pie chart configuration object.
* `_segments.js` - code relating to the pie chart segments.