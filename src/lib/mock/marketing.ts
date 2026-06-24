export type MarketingRegion = {
  slug: string;
  name: string;
  belongsToSwv: boolean;
  coordinator: {
    name: string;
    phone: string;
    email: string;
  };
  description: string;
  companyCount: number;
  studentCount: number;
  provinces: string[];
};

export const marketingRegions: MarketingRegion[] = [
  {
    slug: 'regio-noord-nederland',
    name: 'Noord-Nederland',
    belongsToSwv: true,
    coordinator: {
      name: 'Sanne Bakker',
      phone: '06 87 65 43 21',
      email: 'noord@swvmeubel.nl',
    },
    description:
      'Regio Noord-Nederland omvat Friesland, Groningen en Drenthe. Hier werken we met een actief netwerk van interieurbouwbedrijven en meubelmakerijen.',
    companyCount: 48,
    studentCount: 126,
    provinces: ['Friesland', 'Groningen', 'Drenthe'],
  },
  {
    slug: 'regio-twente-salland',
    name: 'Twente-Salland',
    belongsToSwv: true,
    coordinator: {
      name: 'Pieter de Groot',
      phone: '06 12 34 87 65',
      email: 'twente@swvmeubel.nl',
    },
    description:
      'Regio Twente-Salland bestrijkt het oosten van Overijssel met sterke ambachtelijke meubelbedrijven en grote interieurbouwers.',
    companyCount: 38,
    studentCount: 98,
    provinces: ['Overijssel oost'],
  },
  {
    slug: 'regio-noord-holland',
    name: 'Noord-Holland',
    belongsToSwv: true,
    coordinator: {
      name: 'Marit Jansen',
      phone: '06 55 66 77 88',
      email: 'noordholland@swvmeubel.nl',
    },
    description:
      'Noord-Holland heeft een mix van design-studio\'s, interieurbouwers en gespecialiseerde scheepsbetimmering.',
    companyCount: 52,
    studentCount: 132,
    provinces: ['Noord-Holland'],
  },
  {
    slug: 'regio-aaa',
    name: 'AAA',
    belongsToSwv: true,
    coordinator: {
      name: 'Femke Visser',
      phone: '06 22 33 44 55',
      email: 'aaa@swvmeubel.nl',
    },
    description:
      'Regio AAA (Amsterdam-Almere-Amstelland) verbindt jonge vakmensen aan moderne interieurbouwers in de Randstad.',
    companyCount: 41,
    studentCount: 104,
    provinces: ['Amsterdam', 'Almere', 'Amstelland'],
  },
  {
    slug: 'regio-brabant',
    name: 'Brabant',
    belongsToSwv: true,
    coordinator: {
      name: 'Bram Smit',
      phone: '06 99 88 77 66',
      email: 'brabant@swvmeubel.nl',
    },
    description:
      'Noord-Brabant kent een rijke meubel-traditie. Van Geffen tot Eindhoven werken talloze ambachtelijke bedrijven samen met SWV.',
    companyCount: 56,
    studentCount: 147,
    provinces: ['Noord-Brabant'],
  },
  {
    slug: 'regio-rotterdam',
    name: 'Rotterdam',
    belongsToSwv: true,
    coordinator: {
      name: 'Robin Kuipers',
      phone: '06 34 56 78 90',
      email: 'rotterdam@swvmeubel.nl',
    },
    description:
      'Regio Rotterdam combineert grote interieurbouw-projecten met specialistische scheepsbetimmering en yacht-interior bedrijven.',
    companyCount: 33,
    studentCount: 87,
    provinces: ['Zuid-Holland'],
  },
  {
    slug: 'regio-limburg',
    name: 'Limburg',
    belongsToSwv: true,
    coordinator: {
      name: 'Lotte van der Meer',
      phone: '06 23 45 67 89',
      email: 'limburg@swvmeubel.nl',
    },
    description:
      'In Limburg werken meubelmakers en houtbewerkers nauw samen — een hechte regio met sterke bedrijven en betrokken coördinatie.',
    companyCount: 27,
    studentCount: 71,
    provinces: ['Limburg'],
  },
  {
    slug: 'achterhoek-liemers',
    name: 'Achterhoek-Liemers',
    belongsToSwv: true,
    coordinator: {
      name: 'Daan Berends',
      phone: '06 56 78 90 12',
      email: 'achterhoek@swvmeubel.nl',
    },
    description:
      'Regio Achterhoek-Liemers verbindt jonge vakmensen aan bedrijven in oostelijk Gelderland. Veel maatwerk en interieurbouw.',
    companyCount: 22,
    studentCount: 58,
    provinces: ['Gelderland oost'],
  },
  {
    slug: 'regio-eindhoven',
    name: 'Eindhoven',
    belongsToSwv: false,
    coordinator: {
      name: 'BosMti',
      phone: '040 000 00 00',
      email: 'info@bosmti.nl',
    },
    description:
      'Regio Eindhoven behoort niet tot het Samenwerkingsverband, maar tot BosMti. Studenten en bedrijven in deze regio kunnen daar terecht.',
    companyCount: 18,
    studentCount: 49,
    provinces: ['Brabant zuidoost'],
  },
];

export type StudentStory = {
  name: string;
  age: number;
  city: string;
  program: string;
  year: string;
  quote: string;
  photo: string;
  socials?: { tiktok?: string; instagram?: string };
};

export const studentStories: StudentStory[] = [
  {
    name: 'Jamie',
    age: 19,
    city: 'Groningen',
    program: 'Interieurbouwer BBL 3',
    year: 'Jaar 2',
    quote: 'Beste keus ooit. Ik leer een vak én verdien gewoon m\'n eigen geld. Theorie op vrijdag, rest van de week in de werkplaats.',
    photo: 'https://v3b.fal.media/files/b/0a9f9eb0/PNynWsW034hfYJ3NBgGcn.jpg',
    socials: { tiktok: '@jamie.builds' },
  },
  {
    name: 'Lisa',
    age: 18,
    city: 'Zwolle',
    program: 'Meubelmaker BBL 2',
    year: 'Jaar 1',
    quote: 'Klas was niks voor mij. Hier doe ik echt iets met mijn handen. En aan het eind van de maand staat er gewoon salaris op mijn rekening.',
    photo: 'https://v3b.fal.media/files/b/0a9f9eb0/-HtONgPlxb54rGZuQRGhr.jpg',
    socials: { instagram: '@lisa.maakt' },
  },
  {
    name: 'Mark',
    age: 21,
    city: 'Rotterdam',
    program: 'Houtbewerker BBL 2',
    year: 'Jaar 2',
    quote: 'Van CNC tot maatwerk. Elke dag iets nieuws. Mijn werkbedrijf wil me na m\'n diploma vast in dienst nemen.',
    photo: 'https://v3b.fal.media/files/b/0a9f9eb0/M-q-wKo8UyrvDIAhVWleR.jpg',
    socials: { tiktok: '@markwerkt' },
  },
];

export type SocialPost = {
  platform: 'tiktok' | 'instagram';
  thumb: string;
  caption: string;
  likes: string;
};

export const socialPosts: SocialPost[] = [
  { platform: 'tiktok',    thumb: 'https://v3b.fal.media/files/b/0a9f9edf/UdoqjSPgDybdecQf0h_nq.jpg', caption: 'Een dag op de werkplek 🔨', likes: '12.4k' },
  { platform: 'instagram', thumb: 'https://v3b.fal.media/files/b/0a9f9edf/UWEgmqPsq2WDhmZlytWQG.jpg', caption: 'Maatwerk kast af!',         likes: '2.1k' },
  { platform: 'tiktok',    thumb: 'https://v3b.fal.media/files/b/0a9f9edf/7538Q-H9cZmhY553NzfGJ.jpg', caption: 'Verdien je eigen geld',     likes: '8.7k' },
  { platform: 'instagram', thumb: 'https://v3b.fal.media/files/b/0a9f9edf/TH1o0Kbp3_YfLmB5odNkf.jpg', caption: 'Praktijkdag in Twente',    likes: '1.5k' },
];

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: 'Nieuws' | 'Event' | 'Verhaal';
  excerpt: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: 'open-dag-2026',
    title: 'Open Dag 2026: ontdek het vak in jouw regio',
    date: '2026-09-14',
    category: 'Event',
    excerpt:
      'Op zaterdag 14 september openen lidbedrijven door heel Nederland hun deuren. Maak kennis met meubelmaken, interieurbouw en houtbewerking.',
  },
  {
    slug: 'diploma-uitreiking-bbl3',
    title: 'Diploma-uitreiking BBL niveau 3',
    date: '2026-06-25',
    category: 'Nieuws',
    excerpt:
      '32 studenten ontvingen hun diploma na een succesvolle afronding van de opleiding. Felicitaties voor alle geslaagden.',
  },
  {
    slug: 'verhaal-jamie',
    title: 'Het verhaal van Jamie — van schoolbank tot werkbank',
    date: '2026-05-10',
    category: 'Verhaal',
    excerpt:
      'Jamie van Dijk vertelt hoe de BBL-opleiding zijn passie voor interieurbouw vorm gaf. "Elke dag een beetje beter worden in je vak."',
  },
  {
    slug: 'nieuwe-regio-achterhoek',
    title: 'Nieuwe regio Achterhoek-Liemers actief',
    date: '2026-04-18',
    category: 'Nieuws',
    excerpt:
      'Vanaf april is regio Achterhoek-Liemers volledig operationeel met een eigen coördinator en groeiend bedrijvennetwerk.',
  },
  {
    slug: 'praktijkdag-twente',
    title: 'Praktijkdag in Twente — een dag in het leven',
    date: '2026-03-22',
    category: 'Event',
    excerpt:
      'Tijdens de praktijkdag in Twente kwamen 40 leerlingen kennismaken met machinaal houtbewerken en maatwerkproductie.',
  },
  {
    slug: 'nieuwe-coordinator-noord',
    title: 'Welkom Sanne Bakker — nieuwe coördinator Noord-Nederland',
    date: '2026-02-08',
    category: 'Nieuws',
    excerpt:
      'Sanne neemt het stokje over en gaat aan de slag met 126 studenten verspreid over Friesland, Groningen en Drenthe.',
  },
];
