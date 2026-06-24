import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai/fal';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 min — image generation kan duren

/**
 * Genereert hero foto's via FAL AI Flux.
 *
 * Gebruik:
 *   GET /api/admin/generate-hero?key=<SEED_KEY>&set=home
 *   GET /api/admin/generate-hero?key=<SEED_KEY>&set=panels
 *   GET /api/admin/generate-hero?key=<SEED_KEY>&set=all
 *
 * Returns array van URLs. Kopieer naar HeroPanels component.
 */

const PROMPTS = {
  // Voor de 4-panel composite hero op homepage
  panels: [
    {
      key: 'meubelmaker',
      prompt:
        'cinematic photo of a young Dutch furniture maker working with hand tools in a warm-lit workshop, wood shavings on workbench, soft window light, shallow depth of field, documentary photography style, dark moody background, vertical 9:16 portrait composition, professional photography, hyperrealistic, 35mm film grain',
      size: 'portrait_16_9' as const,
    },
    {
      key: 'koppel-materiaal',
      prompt:
        'cinematic photo of a young Dutch couple looking at wood material samples on a wooden table, soft warm pendant lighting, modern interior design studio atmosphere, smiling and engaged, professional documentary photography, vertical 9:16 composition, hyperrealistic, shallow depth of field, candid moment',
      size: 'portrait_16_9' as const,
    },
    {
      key: 'cad-tekening',
      prompt:
        'cinematic photo of CAD furniture design software on a large monitor showing detailed cabinet blueprint, dark technical drawing on screen with white lines, modern office desk with keyboard, blurred background, atmospheric lighting, vertical 9:16 composition, professional product photography',
      size: 'portrait_16_9' as const,
    },
    {
      key: 'houtstapel',
      prompt:
        'cinematic photo of a stack of oak wood planks close-up, beautiful wood grain texture, warm side lighting, dark moody background, professional product photography, vertical 9:16 composition, hyperrealistic detail, shallow depth of field',
      size: 'portrait_16_9' as const,
    },
  ],

  // Andere hero pagina's
  home: [
    {
      key: 'home-wide',
      prompt:
        'wide cinematic photo of a Dutch furniture workshop interior with stacked oak wood planks on a workbench, sawdust scattered, warm window light streaming in from the left, dark moody atmosphere, professional documentary photography, hyperrealistic, 16:9 landscape composition, no people',
      size: 'landscape_16_9' as const,
    },
  ],
  studenten: [
    {
      key: 'studenten',
      prompt:
        'cinematic photo of a young apprentice woodworker (around 19 years old) wearing safety glasses while operating a hand plane on oak wood, focused concentrated expression, workshop background with warm lighting, dust particles in air, documentary photography style, 16:9 landscape',
      size: 'landscape_16_9' as const,
    },
  ],
  bedrijven: [
    {
      key: 'bedrijven',
      prompt:
        'cinematic photo of a Dutch furniture workshop interior with custom cabinets in progress, master craftsman and apprentice working together, warm natural lighting from large windows, organized tool wall, professional documentary photography, hyperrealistic 16:9 landscape',
      size: 'landscape_16_9' as const,
    },
  ],
  solliciteren: [
    {
      key: 'solliciteren',
      prompt:
        'cinematic photo of a friendly Dutch interior designer or carpenter holding wood samples and smiling at camera in a bright workshop, professional photography, 16:9 landscape, warm inviting atmosphere',
      size: 'landscape_16_9' as const,
    },
  ],
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? '';
  const expected = process.env.SEED_KEY ?? '';
  if (!expected || key !== expected) {
    return NextResponse.json({ ok: false, error: 'Ongeldige key' }, { status: 401 });
  }

  const set = url.searchParams.get('set') ?? 'panels';
  const t0 = Date.now();

  try {
    let prompts: typeof PROMPTS.panels = [];
    if (set === 'all') {
      prompts = [...PROMPTS.panels, ...PROMPTS.home, ...PROMPTS.studenten, ...PROMPTS.bedrijven, ...PROMPTS.solliciteren];
    } else if (set in PROMPTS) {
      prompts = PROMPTS[set as keyof typeof PROMPTS];
    } else {
      return NextResponse.json({ ok: false, error: `Onbekende set. Kies: ${Object.keys(PROMPTS).join(', ')}, all` }, { status: 400 });
    }

    const results = await Promise.all(
      prompts.map(async (p) => {
        try {
          const imgs = await generateImage({
            prompt: p.prompt,
            model: 'flux/dev',
            size: p.size,
            steps: 28,
          });
          return { key: p.key, ok: true, url: imgs[0]?.url, width: imgs[0]?.width, height: imgs[0]?.height };
        } catch (err) {
          return { key: p.key, ok: false, error: String(err) };
        }
      }),
    );

    const duration = Date.now() - t0;
    return NextResponse.json({ ok: true, durationMs: duration, set, count: results.length, images: results });
  } catch (err) {
    console.error('[generate-hero]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
