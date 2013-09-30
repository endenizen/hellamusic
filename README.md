HellaMusic
==========

Find music from Oakland and beyond!

Move the map to any location using drag and drop or the search box provided. When you get to a new location, music by artists that are from that area will start playing.

This hack was made as part of the Hella Hack Oakland music hackathon at Pandora in Oakland, CA.

Technology
==========

The Google Maps API provides the mapping interface and the latitude/longitude of the current window. Sending that information to Echonest returns a list of songs by artists within those bounds. I then take a random song from that list and play it through the Rdio JS API.
