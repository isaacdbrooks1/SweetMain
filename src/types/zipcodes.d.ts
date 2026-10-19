// Types for the "zipcodes" package (US ZIP codes with coordinates), which ships none.
declare module "zipcodes" {
  type ZipInfo = {
    zip: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  };
  const zipcodes: {
    lookup(zip: string | number): ZipInfo | undefined;
    lookupByName(city: string, state: string): ZipInfo[];
  };
  export default zipcodes;
}
