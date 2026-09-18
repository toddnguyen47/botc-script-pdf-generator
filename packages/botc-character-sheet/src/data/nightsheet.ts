type Nightsheet = {
  firstNight: string[];
  otherNight: string[];
};

const JSON_URL = "https://release.botc.app/resources/data/nightsheet.json";
const CACHE_DURATION = 15 * 60 * 1000;

let nightsheet: Nightsheet | null = null;
let cachedAt = 0;
let loading: Promise<Nightsheet> | null = null;

async function loadNightsheet(): Promise<Nightsheet> {
  if (nightsheet !== null && Date.now() - cachedAt < CACHE_DURATION) {
    return nightsheet;
  }

  if (!loading) {
    loading = fetch(JSON_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load nightsheet: ${response.status}`);
        }

        return response.json() as Promise<Nightsheet>;
      })
      .then((data) => {
        nightsheet = data;
        cachedAt = Date.now();
        return data;
      })
      .finally(() => {
        loading = null;
      });
  }

  return loading;
}

export async function getFirstNightOrder(): Promise<string[]> {
  const data = await loadNightsheet();
  return data.firstNight;
}

export async function getOtherNightOrder(): Promise<string[]> {
  const data = await loadNightsheet();
  return data.otherNight;
}
