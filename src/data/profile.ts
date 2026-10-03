/**
 * Homepage content. Text only: the page reads `public/publications.json` (citation counts, monthly CI)
 * and lists `public/img/renamed/` (certificates, rename CI) at build time, see `src/pages/index.astro`.
 */

export const site = {
  url: 'https://george-michoulis.com/',
  title: 'George Michoulis · Software Engineer → Agentic Software Engineer',
  description:
    'Software engineer in Thessaloniki, Greece, moving into agentic software engineering. Full-stack and Web3 products, plus published blockchain research.',
  shortDescription:
    'Software Engineer → Agentic Software Engineer in Thessaloniki, Greece. Full-stack and Web3 products, plus blockchain research.',
  ogImage: 'https://george-michoulis.com/og.png',
  ogImageAlt:
    'George Michoulis, Software Engineer → Agentic Software Engineer: an iridescent glass block linked to a short chain of smaller blocks.',
};

export const profile = {
  name: 'George Michoulis',
  email: 'gmixoulis@gmail.com',
  scholar: 'https://scholar.google.com/citations?user=nk0lq8YAAAAJ',
  linkedin: 'https://www.linkedin.com/in/george-michoulis/',
  linkedinPosts: 'https://www.linkedin.com/in/george-michoulis/recent-activity/all/',
  linkedinWidget: 'https://widgets.sociablekit.com/linkedin-profile-posts/iframe/97069',
  note: "I'm a human being with dyslexia, dysgraphia, ADHD, OCD and a short attention span. I built this site for people like me. If reading it already feels like a lot, I feel that too. We're all human.",
  lede: 'Software Engineer → Agentic Software Engineer',
  footer: 'George Michoulis (Georgios Michoulis, ',
  greekName: 'Γεώργιος Μιχούλης',
  footerPlace: '), Thessaloniki, Greece',
};

/** Headings are [text, dimmed continuation]. */
export const about = {
  h: ['Software Engineer →', 'Agentic Software Engineer.'],
  /** Definitional sentence for structured data and AI answers (not shown on the page). */
  def: 'George Michoulis is a software engineer based in Thessaloniki, Greece, moving into agentic software engineering. He builds full-stack and Web3 products and has published research on blockchain systems.',
  /** The one paragraph shown. **bold** marks the key facts for skimming. */
  body: (s: { papers: number }) => `I build full-stack and Web3 products at **Cyberscope** and have published **${s.papers} blockchain papers**. MSc in Data and Web Science, funded by a **DeepMind scholarship**.`,
};

const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
/** "Seven", "Twelve"… for small counts, digits beyond twenty. */
export const Word = (n: number) => { const w = words[n] ?? String(n); return w[0].toUpperCase() + w.slice(1); };

/** A listed paper after merging the curated facts with publications.json. `cites` is 0 when unknown. */
export type Paper = { title: string; year: string; venue: string; firstAuthor?: boolean; url?: string; cites: number; isPartOf: object };
/** A certificate scan found in public/img/renamed. */
export type Cert = { file: string; src: string; title: string; by: string; w?: number; h?: number; featured?: boolean };
/** Live numbers the copy is built from (computed at build time). */
export type Stats = { papers: number; cites: number; h: number; certs: number; featured: number; asOf: string };
/** Citation clause, omitted entirely when there is nothing to count (never prints "0 citations"). */
const citesClause = (s: Stats) => (s.cites > 0 ? `${s.cites} citation${s.cites === 1 ? '' : 's'} and an h-index of ${s.h} on Google Scholar` : '');

export const skills = {
  /** In order of importance: the first 4 sit beside the cube, the rest behind 'See all'. */
  h: ['Skills.', 'The ones that matter most first.'],
  items: (s: Stats) => [
    { area: 'teach', h: 'Ownership', p: '**Contract to frontend** at Cyberscope. Took **VerDe from thesis to a live system**.' },
    { area: 'res', h: 'Problem solving', p: "**3rd** at the Infinitech hackathon, **1st** in UoM's Basic Research Awards." },
    { area: 'cur', h: 'Critical thinking', p: 'I build **smart-contract audit tooling** and **benchmarked blockchains** as first author.' },
    { area: 'learn', h: 'Leadership', p: '**Led blockchain work** at Sidroco and **frontend teams** at the University of Nicosia.' },
    { h: 'Collaboration', p: 'Worked on **EU proposals that won funding**; co-authored NANCY D3.3.' },
    { h: 'Communication', p: "**Taught three university modules**; talks at GEC'22 and EU workshops." },
    { h: 'Learning fast', p: `**${s.certs} certificates** and counting, from Cisco networking to Azure cloud and machine learning.` },
  ] as { area?: string; h: string; p: string }[],
};


/** `when`: [datetime, label] pairs joined by "-"; `since` prefixes "Since". `org` parts are joined by a dimmed "/". */
export const work = {
  h: ['Experience.', ''],
  roles: [
    { since: true, when: [['2026-05', '05/2026']], title: 'Web3 Full-Stack Developer', org: ['Cyberscope by TAC'],
      d: 'I build Web3 products end to end: contracts, on-chain integrations, React and Next frontends, and security tooling.' },
    { when: [['2024', '2024'], ['2026', '2026']], title: 'Blockchain Developer & Researcher', org: ['Sidroco Holdings Ltd'],
      d: 'I built an NFT marketplace for 5G, Hyperledger Fabric prototypes and an Erasmus+ Moodle LMS, worked on multinational EU projects, and co-authored the Horizon Europe NANCY deliverable D3.3 (12/2024).' },
    { when: [['2023', '2023'], ['2025', '2025']], title: 'Lecturer & Academic Partner', org: ['University of Derby', 'Mediterranean College'],
      d: 'I taught Networks & Security, Web Scripting and Application Development, with labs in coding, networking and cryptography.' },
    { when: [['2022', '2022'], ['2024', '2024']], title: 'Blockchain & Full-Stack Developer', org: ['University of Nicosia', 'IFF'],
      d: 'I led frontend work on Next.js, NestJS and Docker applications, and delivered a Web3 NFT marketplace.' },
    { when: [['2019-10', 'Oct'], ['2019-12', 'Dec 2019']], title: 'Volunteer Web Developer', org: ['MKI Hellas'],
      d: 'I built a chatbot with Dialogflow, and a web page and database with Vue.js and Firebase.' },
    { when: [['2018', '2018'], ['2021', '2021']], title: 'Freelance WordPress Developer', org: ['Self-employed'],
      d: "I built and maintained the MarLab, CELC and EUDEM sites and planned each one with its client. For AUTH's Jean Monnet Chair I was WordPress developer and video editor, and I interned at AUTH's Center for European Legal Culture from 10/2019 to 05/2020." },
  ] as { since?: boolean; when: [string, string][]; title: string; org: string[]; d: string }[],
  education: [
    { b: 'MSc Data and Web Science', span: 'Aristotle University of Thessaloniki, 2020-2022, DeepMind scholarship, ',
      link: { href: 'https://doi.org/10.26262/heal.auth.ir.338875', text: 'thesis on graph embeddings for drug-target interaction prediction' } },
    { b: 'BSc Applied Informatics', span: 'University of Macedonia, 2015-2020, thesis on verifying academic qualifications with blockchain' },
  ] as { b: string; span: string; link?: { href: string; text: string } }[],
  awards: [
    { b: 'DeepMind scholarship', span: 'Aristotle University of Thessaloniki, 2020-2022' },
    { b: '3rd place, Infinitech Hackathon', span: 'Crowdpolicy, 06/2022' },
    { b: '1st place, Basic Research Awards 2020-21', span: 'University of Macedonia, for the VerDe dApp' },
    { b: 'Move/Sui Bootcamp Thessaloniki award', span: 'Move Bootcamp Thessaloniki' },
    { b: 'Progress Award', span: 'Greek Ministry of Education, 2015: first in my final-year class at the 1st Lyceum of Kalamaria' },
  ],
};

export const research = {
  /** h: count word + dimmed rest. */
  h: (s: Stats) => ['Research.', `${Word(s.papers)} papers, the most important first.`],
  note: (s: Stats) => (citesClause(s) ? `${citesClause(s)[0].toUpperCase()}${citesClause(s).slice(1)}, as of ${s.asOf}. ` : ''),
  also: "I also gave two poster flash talks at GEC'22, the 4th Summit on Gender Equality in Computing, on 16 June 2022: one on blockchain in higher education, one on a gender equality observatory for scientific research. In Greek, I wrote a BSc thesis (2020) and a student-conference paper (2021) on verifying academic titles with Ethereum.",
};

/**
 * Curated papers, matched to publications.json by normalised title for their citation counts.
 * Everything publications.json lacks lives here: DOI, venue label, first-author flag, JSON-LD `isPartOf`,
 * and the 2026 DCOSS-IoT paper. `scholar` is the count verified on Scholar on 2026-09-30, used as a floor
 * because publications.json (last CI run 2026-08-01) still has older, lower counts.
 * ponytail: the floor only matters until the monthly job catches up; drop `scholar` then.
 */
export type CuratedPaper = { title: string; year: string; venue: string; firstAuthor?: boolean; doi?: string; scholar?: number; isPartOf: object };
const cw = (name: string) => ({ '@type': 'CreativeWork', name });
export const papers: CuratedPaper[] = [
  { title: 'Benchmarking blockchain technologies for agricultural applications', year: '2026', firstAuthor: true, doi: '10.1109/DCOSS-IoT69657.2026.00085',
    venue: 'IEEE DCOSS-IoT 2026, 22nd International Conference on Distributed Computing in Smart Systems and the IoT',
    isPartOf: cw('IEEE DCOSS-IoT 2026, 22nd International Conference on Distributed Computing in Smart Systems and the IoT') },
  { title: 'Data security for smart cities', year: '2025', doi: '10.1049/PBBE009E_ch8', scholar: 1,
    venue: 'Book chapter in Enabling Technologies for Sustainable Smart Cities, IET',
    isPartOf: { '@type': 'Book', name: 'Enabling Technologies for Sustainable Smart Cities', publisher: { '@type': 'Organization', name: 'IET' } } },
  { title: 'Unlocking 5G network slicing: a comprehensive survey on blockchain marketplace utilizing NFTs, AI, and advanced resource management',
    year: '2025', doi: '10.1109/ICCE63647.2025.10929953',
    venue: '2025 IEEE International Conference on Consumer Electronics (ICCE)',
    isPartOf: cw('2025 IEEE International Conference on Consumer Electronics (ICCE)') },
  { title: 'FraMark: a blockchain marketplace for a 5G network management using fractional NFTs', year: '2024', firstAuthor: true,
    doi: '10.1109/WSCE65107.2024.00009', scholar: 2,
    venue: '2024 7th World Symposium on Communication Engineering (WSCE), IEEE',
    isPartOf: cw('2024 7th World Symposium on Communication Engineering (WSCE)') },
  { title: 'Exploring decentralized governance: a framework applied to Compound Finance', year: '2023', doi: '10.1007/978-3-031-48731-6_9', scholar: 8,
    venue: 'MARBLE 2023, Mathematical Research for Blockchain Economy, London (Springer)',
    isPartOf: cw('MARBLE 2023, Mathematical Research for Blockchain Economy, London') },
  { title: 'A process-aware approach for blockchain-based verification of academic qualifications', year: '2022', doi: '10.1016/j.simpat.2022.102642', scholar: 34,
    venue: 'Simulation Modelling Practice and Theory 121, 102642 (Elsevier)',
    isPartOf: { '@type': 'PublicationVolume', volumeNumber: '121', isPartOf: { '@type': 'Periodical', name: 'Simulation Modelling Practice and Theory', publisher: { '@type': 'Organization', name: 'Elsevier' } } } },
  { title: 'Verification of academic qualifications through Ethereum blockchain: an introduction to VerDe', year: '2020', firstAuthor: true, scholar: 11,
    venue: 'XIV Balkan Conference on Operational Research (BALCOR 2020)',
    isPartOf: cw('XIV Balkan Conference on Operational Research (BALCOR 2020)') },
];

/** Scholar items not listed as papers (posters, theses, the booklet; the "also" note covers them). New items appear automatically. */
export const hiddenPubs = [
  '3rd Women in Bioinformatics & Data Science LA Conference Booklet',
  'A Gender Equality Observatory on Scientific Research',
  'Blockchain in Higher Education: permissioned and permissionless approaches',
  'Graph Embedding and Node Features for Drug-Target Interaction Prediction',
  'Επαλήθευση εγκυρότητας Ακαδημαϊκών Τίτλων με χρήση του Ethereum Blockchain',
  'Επαλήθευση ακαδημαϊκών τίτλων με χρήση της τεχνολογίας Blockchain',
];

/**
 * Labels for the files in public/img/renamed. Which ones show is decided by src/lib/certRank.ts, not here.
 * Files the rename workflow adds later get a label derived from their filename.
 */
export const certificates = {
  h: (s: Stats) => [`${s.certs} certificates.`, `The ${Word(s.featured).toLowerCase()} that matter most are here.`],
  items: [
    { file: '1Master-Degree_1Master-Degree-Data-And-Web-Science.jpg', title: 'MSc Data and Web Science', by: 'Aristotle University of Thessaloniki, 2022', w: 1240, h: 1755 },
    { file: '1Bachelor-Degree_Bachelor-Degree-Computer-Science.jpg', title: 'BSc Applied Informatics', by: 'University of Macedonia', w: 1742, h: 2460 },
    { file: 'Move-Sui-First-Thessaloniki-Bootacamp-Award_Move-Bootcamp-Thessaloniki.png', title: 'Move/Sui Bootcamp Thessaloniki award', by: 'Move Bootcamp Thessaloniki', w: 3543, h: 3542 },
    { file: 'Certificate-Of-Completion_CCNA-Cisco-Certified-Network-Associate.jpg', title: 'Accelerated CCNA, 132 hours', by: 'University of Thessaly, 2020', w: 2175, h: 1439 },
    { file: 'Certificate-Of-Completion_Rust-Developer.png', title: 'Certified Rust developer', by: 'W3Schools, 2025', w: 2342, h: 1656 },
    { file: 'Certificate-Of-Completion_Machine-Learning-And-Deep-Neural-Networks.jpg', title: 'Machine learning and deep neural networks (CVML), 17 hours, 1.5 ECTS', by: 'Aristotle University of Thessaloniki, 2021', w: 1755, h: 1240 },
    { file: 'Certificate-Of-Completion_How-To-Get-Published-With-IEEE.jpg', title: 'How to get published with IEEE', by: 'IEEE, 2020', w: 1650, h: 1275 },
    { file: 'Certificate-Of-Achievement_Introduction-To-Digital-Currencies.jpg', title: 'Introduction to digital currencies', by: 'University of Nicosia, 2020', w: 1754, h: 1241 },
    { file: 'Certificate-Of-Completion_Cloud-Engineering.png', title: 'Cloud engineering (Azure), 90 hours', by: 'Code.Hub, 2024', w: 2481, h: 3509 },
    { file: 'Certificate-Of-Completion_NFT-Talents-Program.jpg', title: 'NFT talents program', by: 'Frankfurt School Blockchain Center, 2022', w: 1500, h: 844 },
    { file: 'Certificate-Of-Participation_Launch-Event-RippleX-Workshop.jpg', title: 'Launch event and RippleX workshop', by: 'University of Nicosia IFF, 2020', w: 1754, h: 1241 },
    { file: 'Certificate-Of-Completion_Advanced-Ethical-Hacking.png', title: 'Advanced ethical hacking, 48 hours', by: 'Audax Cybersecurity, 2021', w: 800, h: 600 },
    { file: 'Award_Academic-Achievement.jpg', title: 'Progress Award', by: 'Greek Ministry of Education, 2015', w: 2269, h: 1593 },
    { file: 'English-Certificate_English-Certificate-English-Proficiency.jpg', title: 'Certificate of Proficiency in English, C2', by: 'Michigan Language Assessment, 2018', w: 1532, h: 2163 },
    { file: 'Certificate-Of-Achievement_TOEIC-Listening-Reading-Test.jpg', title: 'TOEIC listening and reading, 860', by: 'ETS, 2018', w: 2284, h: 1620 },
    { file: 'Certificate-Of-Completion_Networking-Essentials.png', title: 'Networking essentials', by: 'Cisco Networking Academy', w: 303, h: 303 },
    { file: 'Certificate-Of-Completion_Cybersecurity-ELearning-Academy.jpg', title: 'Cybersecurity eLearning Academy, 20 hours', by: 'College Link, 2023', w: 6667, h: 4959 },
    { file: 'Certificate-Of-Completion_Software-Development-For-Telecommunication-Networks.jpg', title: 'Software development for telecommunication networks', by: 'Intracom Telecom, 2019', w: 2127, h: 1496 },
    { file: 'Certificate-Of-Participation_GNULinux-Command-Line.jpg', title: 'GNU/Linux command line', by: 'University of Macedonia and GreekLUG, 2017', pin: true, w: 1495, h: 2171 },
    { file: 'Certificate-Of-Completion_The-Hour-Of-Code.jpg', title: 'The Hour of Code', by: 'Code.org, 2013', w: 2066, h: 1498 },
    { file: 'Certificate-Of-Completion_Entrepreneurship-Funding-And-Development-Of-New-Enterprises.png', title: 'Founding, funding and development of startups', by: 'Athens University of Economics and Business, 2023', w: 1575, h: 1112 },
    { file: 'Certificate-Of-Participation_MIGMA-MARKETING-KAI-BRAND.png', title: 'Marketing mix and brand', by: 'National and Kapodistrian University of Athens, 2023', w: 1654, h: 2339 },
    { file: 'Certificate-Of-Completion_Discover-Customer.jpg', title: 'Discover customer', by: 'PepsiCo School, 2018', w: 2157, h: 1547 },
    { file: 'Certificate-Of-Completion_Digital-Skills-For-Tourism.jpg', title: 'Digital skills for tourism', by: 'Grow Greek Tourism Online (Google), 2017', w: 1650, h: 1275 },
    { file: 'Certificate-Of-Completion_How-To-Design-Build-A-Website.jpg', title: 'How to design and build a website', by: 'Grow Greek Tourism Online (Google), 2018', w: 1650, h: 1275 },
    { file: 'Certificate-Of-Participation_Blockchain-For-The-Legal-Industry-How-Is-The.jpg', title: 'Blockchain for the legal industry: how is the coronavirus crisis making adoption more imminent?', by: 'Block.co and University of Nicosia, 2020', w: 1754, h: 1241 },
    { file: 'Certificate-Of-Participation_Blockchain-In-Education-Remote-Learning-Social-Distancing-And.jpg', title: 'Blockchain in education: remote learning, social distancing and the certification case', by: 'Block.co and University of Nicosia, 2020', w: 1754, h: 1241 },
    { file: 'Certificate-Of-Participation_VeChain-ToolChain-Digital-Transformation-Of-The-Healthcare-Industry.jpg', title: 'VeChain ToolChain: digital transformation of the healthcare industry', by: 'University of Nicosia IFF and VeChain, 2020', w: 1754, h: 1241 },
    { file: 'Certificate-Of-Participation_Data-Analytics-To-Strengthen-Healthcare-Cybersecurity.jpg', title: 'Data analytics to strengthen healthcare cybersecurity', by: 'AUTH Data and Web Science MSc, 2021', w: 1754, h: 1241 },
    { file: 'Certificate-Of-Participation_Processing-Data-In-The-Fog-The-Example-Of.jpg', title: 'Processing data in the fog: the RAINBOW fog computing platform', by: 'AUTH Data and Web Science MSc, 2022', w: 1754, h: 1241 },
    { file: 'Certificate-Of-Participation_EY-Cyber-Day.jpg', title: 'First EY Cyber Day', by: 'EY', w: 2876, h: 1941 },
    { file: 'Certificate-Of-Participation_Skgcode-Project-Creation-Of-A-Real-Estate-Chatbot.jpg', title: 'skg.code project: a real-estate chatbot', by: 'skg.code, 2019', w: 2219, h: 1519 },
    { file: 'Certificate-Of-Participation_Marine-Educational-Robotics-Hydrobot-Program.jpg', title: 'Hydrobot marine educational robotics', by: 'Eugenides Foundation, 2015', w: 2157, h: 1509 },
    { file: 'Certificate-Of-Completion_Aristoteleio-University-Of-Thessaloniki-European-Legal-Culture-Program.jpg', title: 'Internship, Center for European Legal Culture', by: 'Aristotle University of Thessaloniki, 2019-2020', w: 1755, h: 1241 },
  ] as { file: string; title: string; by: string; w: number; h: number; pin?: boolean }[],
};

export const projects = {
  /** Listed in order of importance: the first SHOWN are on the slider, the rest behind 'See all'. */
  h: ['Projects.', 'The most important first.'],
  items: [
    { wide: true, img: '/img/portfolio/verde.uom.gr.PNG', w: 1840, h: 907, alt: 'VerDe website, contact page with a map of the University of Macedonia',
      name: 'VerDe', host: 'verde.uom.gr', d: 'The **Ethereum system for verifying degrees**, from my BSc thesis.', tag: 'From my thesis' },
    { img: '/img/portfolio/george-michoulis.com.png', w: 1840, h: 940, alt: 'Homepage of george-michoulis.com: the name George Michoulis in large type above an iridescent glass cube linked to a chain of smaller cubes', name: 'This site', host: 'george-michoulis.com', d: 'Built with an **agent pipeline**: one agent plans and reviews, another writes the code.', tag: 'Agentic' },
    { img: '/img/portfolio/bbf-gui.ddns.net.gif', w: 1377, h: 956, alt: 'Blockchain Benchmarking Framework landing page', freeze: true,
      name: 'Blockchain Benchmarking Framework', host: 'bbf-gui.ddns.net', d: 'Deploys and **benchmarks blockchain protocols**.' },
    { img: '/img/portfolio/metau.unic.ac.cy.png', w: 1698, h: 943, alt: 'University of Nicosia metaverse course site with a Connect Wallet button',
      name: 'UNIC metaverse course', host: 'metau.unic.ac.cy', d: 'A course site that is **on-chain and in the metaverse**.' },
    { img: '/img/portfolio/accelerate.png', w: 1910, h: 998, alt: 'Sign-in page of the UNIC Accelerate platform',
      name: 'UNIC Accelerate', host: 'accelerate.unic.ac.cy', d: "Sign-in for the University of Nicosia's **Accelerate platform**." },
    { img: '/img/portfolio/celc.web.auth.gr.PNG', w: 1600, h: 936, alt: 'Centre for European Legal Culture website in Greek',
      name: 'Centre for European Legal Culture', host: 'celc.web.auth.gr', d: 'Greek-language site with news, publications and members.', tag: 'Freelance, WordPress' },
    { img: '/img/portfolio/eudem.polsci.auth.gr.PNG', w: 1896, h: 944, alt: 'EUDEM Jean Monnet Chair website',
      name: 'EUDEM Jean Monnet Chair', host: 'eudem.polsci.auth.gr', d: "The chair's activities, staff and news.", tag: 'Freelance, WordPress' },
    { img: '/img/portfolio/marlab.ode.uom.gr.PNG', w: 1835, h: 917, alt: 'MarLab, the University of Macedonia Marketing Laboratory website',
      name: 'MarLab', host: 'marlab.ode.uom.gr', d: "The University of Macedonia's Marketing Laboratory.", tag: 'Freelance, WordPress' },
  ] as { wide?: boolean; img: string; w: number; h: number; alt: string; freeze?: boolean; name: string; host: string; d: string; tag?: string }[],
};

/** `glyph` picks the isometric drawing in Activities.astro. */
export const activities = {
  /** In order of importance: the first 4 are cards, the rest behind 'See all'. */
  h: ['Outside work.', 'The ones that matter most first.'],
  items: [
    { glyph: 'agentic', h: 'Agentic AI', p: 'I build with **AI agents that write, test and ship code**.' },
    { glyph: 'volunteering', h: 'Volunteering', p: '**MKI Hellas, 2019**: a Dialogflow chatbot and a web page.' },
    { glyph: 'theatre', h: 'Theatre', p: '**Acting on stage** and watching plays.' },
    { glyph: 'languages', h: 'Languages', p: 'I keep **learning new ones**.' },
    { glyph: 'citizen', h: 'Active citizen', p: 'Politically engaged.' },
    { glyph: 'fitness', h: 'Fitness', p: 'Workouts and staying fit.' },
    { glyph: 'news', h: 'The news', p: 'I keep up with it.' },
    { glyph: 'anime', h: 'Anime', p: 'Watching it.' },
  ],
};

export const linkedin = {
  h: ['LinkedIn.', 'My latest posts.'],
  fine: 'Third-party embed: the feed loads from sociablekit.com.',
  url: 'linkedin.com/in/george-michoulis',
  loading: 'Loading posts from LinkedIn…',
  failed: "The LinkedIn feed isn't showing here. Your browser may be blocking it, or you may be offline.",
};

export const contact = {
  h: ['Contact.', 'Write to me.'],
  /** In order of importance: the first 3 show, the rest behind 'See all'. */
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/george-michoulis/' },
    { label: 'GitHub', href: 'https://github.com/gmixoulis' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=nk0lq8YAAAAJ' },
    { label: 'X', href: 'https://twitter.com/GeorgeMicou' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0002-5139-448X' },
    { label: 'Semantic Scholar', href: 'https://www.semanticscholar.org/author/2180238066' },
  ],
};

/** schema.org Person (JSON-LD). */
export const person = {
  '@type': 'Person',
  '@id': 'https://george-michoulis.com/#person',
  name: 'George Michoulis',
  givenName: 'George',
  familyName: 'Michoulis',
  alternateName: ['Γεώργιος Μιχούλης', 'Georgios Michoulis'],
  url: 'https://george-michoulis.com/',
  email: 'mailto:gmixoulis@gmail.com',
  image: 'https://george-michoulis.com/og.png',
  jobTitle: ['Software Engineer', 'Agentic Software Engineer'],
  description: about.def,
  identifier: { '@type': 'PropertyValue', propertyID: 'ORCID', value: '0000-0002-5139-448X', url: 'https://orcid.org/0000-0002-5139-448X' },
  homeLocation: { '@type': 'Place', name: 'Thessaloniki, Greece', address: { '@type': 'PostalAddress', addressLocality: 'Thessaloniki', addressCountry: 'GR' } },
  address: { '@type': 'PostalAddress', addressLocality: 'Thessaloniki', addressCountry: 'GR' },
  worksFor: { '@type': 'Organization', name: 'Cyberscope by TAC' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'University of Macedonia' },
    { '@type': 'CollegeOrUniversity', name: 'Aristotle University of Thessaloniki' },
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'BSc Applied Informatics', credentialCategory: 'degree', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'University of Macedonia' } },
    { '@type': 'EducationalOccupationalCredential', name: 'MSc Data and Web Science', credentialCategory: 'degree', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Aristotle University of Thessaloniki' } },
  ],
  award: [
    'DeepMind scholarship, Aristotle University of Thessaloniki (2020-2022)',
    '3rd place, Infinitech Hackathon, Crowdpolicy (06/2022)',
    '1st place, Basic Research Awards 2020-21 (University of Macedonia), for the VerDe dApp',
    'Move/Sui Bootcamp Thessaloniki award',
    'Progress Award, Greek Ministry of Education (2015)',
  ],
  knowsAbout: ['Agentic software engineering', 'AI coding agents', 'Multi-agent orchestration', 'Blockchain', 'Ethereum', 'Smart contracts', 'Solidity', 'TypeScript', 'Web3', 'NFTs', 'DeFi', 'Hyperledger Fabric',
    'Blockchain benchmarking', '5G network slicing', 'Graph embeddings', 'Next.js', 'NestJS', 'Docker', 'Networks and security', 'WordPress'],
  knowsLanguage: ['English'],
  sameAs: [
    'https://www.linkedin.com/in/george-michoulis/',
    'https://github.com/gmixoulis',
    'https://scholar.google.com/citations?user=nk0lq8YAAAAJ',
    'https://orcid.org/0000-0002-5139-448X',
    'https://twitter.com/GeorgeMicou',
    'https://www.semanticscholar.org/author/2180238066',
  ],
};
