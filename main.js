(function() {
  var map;
  var layerl0;

  function initialize() {

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(37.808441719910775, -122.20826827734379),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    layerl0 = new google.maps.FusionTablesLayer({
      query: {
        select: "col3",
        from: "14ZHXZcZ3Fy4Qk0k3_cNV16N_Xl-n5GHy2kd8XEM"
      },
      map: map,
      styleId: 2,
      templateId: 2
    });

  }
  google.maps.event.addDomListener(window, 'load', initialize);
})();
