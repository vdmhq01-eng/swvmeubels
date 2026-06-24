import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai/fal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
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

  // 3 student verhalen voor de StudentStories sectie op homepage
  // Authentic, in-the-workshop documentary photos
  verhalen: [
    {
      key: 'jamie',
      prompt:
        'authentic candid photo of a 19-year-old young Dutch male apprentice interior builder in a workshop, dark blonde hair, wearing work apron over t-shirt, smiling slightly at camera, holding wooden cabinet panel, warm workshop lighting, wood shavings around, vertical portrait composition, documentary photography style, hyperrealistic, shallow depth of field, natural unposed look',
      size: 'portrait_4_3' as const,
    },
    {
      key: 'lisa',
      prompt:
        'authentic candid photo of an 18-year-old young Dutch female apprentice furniture maker with short dark hair, wearing work overalls and safety glasses pushed up on forehead, in a workshop holding hand plane on oak wood, confident focused expression, warm side lighting from window, vertical portrait composition, documentary photography style, hyperrealistic, natural unposed authentic moment',
      size: 'portrait_4_3' as const,
    },
    {
      key: 'mark',
      prompt:
        'authentic candid photo of a 21-year-old young Dutch male woodworking apprentice with short brown hair, wearing work shirt and safety glasses, operating a CNC wood router in a modern workshop, focused concentration, industrial workshop lighting, vertical portrait composition, documentary photography style, hyperrealistic, professional wood-craftsman atmosphere',
      size: 'portrait_4_3' as const,
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
    type Prompt = { key: string; prompt: string; size: 'portrait_16_9' | 'landscape_16_9' | 'portrait_4_3' };
    let prompts: Prompt[] = [];
    if (set === 'all') {
      prompts = [...PROMPTS.panels, ...PROMPTS.home, ...PROMPTS.studenten, ...PROMPTS.bedrijven, ...PROMPTS.solliciteren, ...PROMPTS.verhalen];
    } else if (set in PROMPTS) {
      prompts = PROMPTS[set as keyof typeof PROMPTS] as Prompt[];
    } else {
      return NextResponse.json({ ok: false, error: `Onbekende set. Kies: ${Object.keys(PROMPTS).join(', ')}, all` }, { status: 400 });
    }

    // Random seed per request voor nieuwe variaties bij elke call
    const seedBase = Math.floor(Math.random() * 1_000_000);

    const results = await Promise.all(
      prompts.map(async (p, i) => {
        try {
          const imgs = await generateImage({
            prompt: p.prompt,
            model: 'flux/dev',
            size: p.size,
            steps: 28,
            seed: seedBase + i,
          });
          return { key: p.key, ok: true, url: imgs[0]?.url, width: imgs[0]?.width, height: imgs[0]?.height };
        } catch (err) {
          return { key: p.key, ok: false, error: String(err) };
        }
      }),
    );

    const duration = Date.now() - t0;
    return new NextResponse(
      JSON.stringify({ ok: true, durationMs: duration, set, seedBase, count: results.length, images: results }),
      {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  } catch (err) {
    console.error('[generate-hero]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
