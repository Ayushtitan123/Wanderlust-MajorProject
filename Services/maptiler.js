// services/maptiler.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const MAPTILER_API_KEY = process.env.MAP_API_KEY;

async function forwardGeocode(address) {
    try {
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${MAPTILER_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`MapTiler API error: ${res.status} ${res.statusText}`);
            return null;
        }
        const data = await res.json();
        if (data.features && data.features.length > 0) {
            // const [lng, lat] = data.features[0].geometry.coordinates;
            return data.features[0].geometry;
        } else {
            console.warn(`MapTiler: No results for "${address}"`);
            return null;
        }
    } catch (error) {
        console.error(`MapTiler fetch error: ${error}`);
        return null;
    }
}

module.exports = {
    forwardGeocode,
};
