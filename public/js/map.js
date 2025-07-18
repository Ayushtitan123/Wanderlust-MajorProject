
    // let mapToken = mapToken;
    console.log(mapToken);
    
      const map = new maplibregl.Map({
        container: 'map',
        style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
        center: listing.geometry.coordinates, // Example: New Delhi
        zoom: 11
      });
  
      
      // Optional: add zoom and rotation controls
      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Optional: add a marker
      const marker =new maplibregl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
        .addTo(map);

      
    