export const goUserLocation = (map, zoom = 12) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      geo => {
        const userLocation = {
          lat: geo.coords.latitude,
          lng: geo.coords.longitude
        };
        map.setCenter(userLocation);
        map.setZoom(zoom);
      },
      function (error) {
        map.setCenter({ lat: 20, lng: 2 });
        map.setZoom(3);
      }
    );
  }
};

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      geo => {
        resolve({
          lat: geo.coords.latitude,
          lng: geo.coords.longitude
        });
      },
      error => {
        reject(error);
      }
    );
  });
};
