type Nightsheet = {
  firstNight: string[];
  otherNight: string[];
};

let firstNightOrder: string[] = [];
let otherNightOrder: string[] = [];

const JSON_URL = "https://release.botc.app/resources/data/nightsheet.json";

export async function loadNightsheet(): Promise<void> {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Failed to load nightsheet: ${response.status}`);
  }

  const nightsheet = (await response.json()) as Nightsheet;

  firstNightOrder = nightsheet.firstNight;
  otherNightOrder = nightsheet.otherNight;
}

export function getFirstNightOrder(): string[] {
  return firstNightOrder;
}

export function getOtherNightOrder(): string[] {
  return otherNightOrder;
}
