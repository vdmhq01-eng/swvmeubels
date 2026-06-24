/**
 * FAL AI client wrapper voor image generation.
 * Vereist FAL_KEY env var (set in Vercel).
 *
 * Gebruik:
 *   const url = await generateImage({ prompt: '...', size: 'landscape_16_9' });
 *
 * Models:
 * - flux/schnell: snel (~3s) + goedkoop, lichte kwaliteit
 * - flux/dev: middel (~10s) + betere kwaliteit
 * - flux-pro/v1.1-ultra: trager (~20s) + hoogste kwaliteit
 */

export type FalImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';

export type FalModel = 'flux/schnell' | 'flux/dev' | 'flux-pro/v1.1-ultra';

export type GenerateOptions = {
  prompt: string;
  model?: FalModel;
  size?: FalImageSize;
  numImages?: number;
  steps?: number; // alleen voor flux/dev
  seed?: number;
};

export type GeneratedImage = {
  url: string;
  contentType: string;
  width: number;
  height: number;
};

const FAL_BASE = 'https://fal.run';

function getKey(): string {
  const key = process.env.FAL_KEY || process.env.FAL_API_KEY;
  if (!key) throw new Error('FAL_KEY niet gezet in env vars');
  return key;
}

export async function generateImage(opts: GenerateOptions): Promise<GeneratedImage[]> {
  const model = opts.model ?? 'flux/dev';
  const key = getKey();

  const body: Record<string, unknown> = {
    prompt: opts.prompt,
    image_size: opts.size ?? 'landscape_16_9',
    num_images: opts.numImages ?? 1,
    enable_safety_checker: true,
  };

  if (model === 'flux/dev' || model === 'flux-pro/v1.1-ultra') {
    body.num_inference_steps = opts.steps ?? 28;
  }
  if (opts.seed !== undefined) body.seed = opts.seed;

  const res = await fetch(`${FAL_BASE}/fal-ai/${model}`, {
    method: 'POST',
    headers: {
      authorization: `Key ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`FAL ${model} → ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    images: Array<{ url: string; content_type: string; width: number; height: number }>;
  };

  return data.images.map((i) => ({
    url: i.url,
    contentType: i.content_type,
    width: i.width,
    height: i.height,
  }));
}
