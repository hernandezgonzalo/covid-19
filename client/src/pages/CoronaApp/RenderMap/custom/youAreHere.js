export const youAreHere = (map, user) => {
  const geo = user.location.coordinates;
  const circleOptions = {
    strokeColor: "#ff1744",
    strokeOpacity: 0.1,
    fillColor: "#ff1744",
    fillOpacity: 0.3,
    map,
    center: { lat: geo[1], lng: geo[0] }
  };

  const circle = new window.google.maps.Circle({
    ...circleOptions,
    radius: 0
  });

  setInterval(() => {
    const speed = 30 - (20 * circle.radius) / 1000;
    const radius = (circle.radius + speed) % 1000;
    const fillOpacity = (1 - radius / 1000) * 0.3;
    circle.setOptions({ radius, fillOpacity });
  }, 50);
};
