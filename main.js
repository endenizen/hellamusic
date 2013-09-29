(function() {
  var geocoder;
  //var map;
  var layerl0;
  var marker;

  var ECHONEST_KEY = "HI60IQAWDGBI3OO35";
  var ECHONEST_BASE_URL = "http://developer.echonest.com/api/v4/song/search?api_key=" + ECHONEST_KEY + "&bucket=id:rdio-US&bucket=tracks&bucket=artist_location&limit=true&format=jsonp&results=100";

  songSearch = function(params, callback) {
    var url = ECHONEST_BASE_URL;
    _.each(params, function(val, key) {
      url += '&' + key + "=" + val;
    });

    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(results) {
        if (results.response && results.response.songs) {
          callback(results.response.songs);
        }
      },
      cache: true
    });
  };

  function playEchonestSong(song) {
    var rdioKey;
    console.log('en song', song);
    if (song.tracks && song.tracks.length && song.tracks[0].foreign_id) {
      rdioKey = song.tracks[0].foreign_id.split(':')[2];
      R.ready(function() {
        R.player.play({ source: rdioKey });
      });
    }
  }

  function updateSongInfo() {
    var track = R.player.playingTrack();

    var art = $('#track_art');
    var link = art.find('a');
    var img = art.find('img');
    var title = $('#track_title');
    var artist = $('#track_artist');

    link.attr('href', track.get('shortUrl'));

    img.attr('src', track.get('icon'));
    img.show();

    title.html(track.get('name'));
    title.show();
    artist.html('by ' + track.get('artist'));
    artist.show();
  }

  function searchSongsInMap(map, callback) {
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var params = {
      min_longitude: sw.lng(),
      min_latitude: sw.lat(),
      max_longitude: ne.lng(),
      max_latitude: ne.lat()
    };

    songSearch(params, callback);
  }

  function updatePinsForSongs(songs) {
    var song;
    var loc;

    if (songs && songs.length) {
      song = songs[_.random(0, songs.length - 1)];
      playEchonestSong(song);

      /*
      if (song.artist_location) {
        loc = new google.maps.LatLng(song.artist_location.latitude, song.artist_location.longitude);
        if (marker) {
          marker.setMap(null);
        }
        marker = new google.maps.Marker({
          map: map,
          position: loc
        });
      }
      */
    }
  }

  function initialize() {
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(37.808441719910775, -122.20826827734379),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      panControl: false,
      streetViewControl: false
    });

    R.ready(function() {
      R.player.on('change:playingTrack', function() {
        updateSongInfo();
      });
    });

    var songSearcher = _.debounce(_.bind(searchSongsInMap, this, map, updatePinsForSongs), 500);
    google.maps.event.addListener(map, 'center_changed', songSearcher);
    google.maps.event.addListener(map, 'zoom_changed', songSearcher);
    songSearcher();

    var button = document.getElementById('search_button');
    button.onclick = function() {
      var search = document.getElementById('search_input').value;
      codeAddress(search);
      return false;
    };

    $('#search_input').keypress(function (e) {
      if (e.which == 13) {
        $('#search_button').click();
      }
    });
  }

  function codeAddress(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
        if (!marker) {
          marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
        } else {
          marker.setPosition(results[0].geometry.location);
        }
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
})();
