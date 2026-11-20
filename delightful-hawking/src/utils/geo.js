// Reference point used to compute "distance from me" for the professionals
// list — matches InteractiveMap's default map center (León, Guanajuato).
export const USER_LOCATION = { lat: 21.1215, lng: -101.6826 };

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10;
}
