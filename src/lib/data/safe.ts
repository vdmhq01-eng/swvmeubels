// Wrapper voor data-fetches die crashes voorkomt. Bij een DB-fout
// (bijv. ontbrekende DATABASE_URL op Vercel) krijg je een fallback
// terug ipv dat de hele page crash't.
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[safe data fetch]', err);
    return fallback;
  }
}
