export function queryCountry() {
  return fetch('https://api.mobimecdn.com/public/country').then((response) => response.json());
}
