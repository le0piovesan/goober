import { type Location } from "@prisma/client";

export const getStaticMapImage = (
  startLocation: Location,
  endLocation: Location,
) => {
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";
  const parameters: Record<string, string[]> = {
    size: ["1000x250"],
    markers: [
      `color:0x845ec2|label:S|${startLocation.latitude},${startLocation.longitude}`,
      `color:0x4ffbdF|label:E|${endLocation.latitude},${endLocation.longitude}`,
    ],
    path: [
      `color:0x0000ff|weight:2|${startLocation.latitude},${startLocation.longitude}|${endLocation.latitude},${endLocation.longitude}`,
    ],
    key: [process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""],
  };

  const url = new URL(baseUrl);
  Object.keys(parameters).forEach((key) =>
    parameters[key]!.forEach((value) => url.searchParams.append(key, value)),
  );

  return url.toString();
};
