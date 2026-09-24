export const profile = {
  name: 'George Michoulis',
  short: 'George',
  location: 'Thessaloniki · Remote',
  email: 'gmixoulis@gmail.com',
  roles: [
    'Blockchain',
    'Full-Stack',
    'Data Science',
    'Web3',
    'Machine Learning',
    'Research',
  ],
  thesis:
    'Blockchain developer and researcher. Smart contracts, graph-based ML, and full-stack Web3 systems.',
  about:
    'Based in Thessaloniki. BSc Applied Informatics (University of Macedonia) on Ethereum credential verification. MSc Data and Web Science (Aristotle University) on graph-embedding methods for blockchain fraud detection, funded by DeepMind.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/george-michoulis/' },
    { label: 'GitHub', href: 'https://github.com/gmixoulis' },
    { label: 'Scholar', href: 'https://scholar.google.com/citations?user=nk0lq8YAAAAJ&hl=el' },
    { label: 'X', href: 'https://twitter.com/GeorgeMicou' },
  ],
  pillars: [
    {
      title: 'Research',
      body: 'Publications and startup work on ledger effectiveness, improvement areas, and practical change across blockchain systems.',
    },
    {
      title: 'Build',
      body: 'Web3 (NFTs, DeFi), data science with graph embeddings, and shipping across Solidity, TypeScript, and cloud.',
    },
    {
      title: 'Teach',
      body: 'Lecturer in networks, security, and application development. Public speaking on Web3 and edge tech.',
    },
  ],
  experience: [
    {
      when: '05 / 2026 - Present',
      title: 'Web3 Full-Stack Developer',
      org: 'Cyberscope by TAC',
      body: 'End-to-end Web3 products: contracts, on-chain integrations, React/Next frontends, security tooling.',
    },
    {
      when: '2024 - 2026',
      title: 'Blockchain Developer & Researcher',
      org: 'Sidroco Holdings LTD',
      body: 'NFT marketplace for 5G, Hyperledger Fabric prototypes, Erasmus+ LMS, multinational EU projects.',
    },
    {
      when: '2023 - 2025',
      title: 'Lecturer & Academic Partner',
      org: 'University of Derby / Mediterranean College',
      body: 'Networks & Security, Web Scripting, Application Development. Inclusivity-first assessment.',
    },
    {
      when: '2022 - 2024',
      title: 'Blockchain & Full-Stack Developer',
      org: 'University of Nicosia / IFF',
      body: 'Large-scale Next.js / NestJS / Docker apps and a Web3 NFT marketplace.',
    },
  ],
  education: [
    {
      when: '2020 - 2022',
      title: 'MSc Data and Web Science',
      org: 'Aristotle University of Thessaloniki',
      note: 'DeepMind Scholarship',
    },
    {
      when: '2015 - 2020',
      title: 'BSc Applied Informatics',
      org: 'University of Macedonia',
      note: 'Web3 thesis on academic credentials',
    },
  ],
  awards: [
    { when: '2020 - 2022', title: 'DeepMind Scholarship', org: 'AUTH' },
    { when: '06 / 2022', title: '3rd place, Infinitech Hackathon', org: 'Crowdpolicy' },
    { when: '2020 - 2021', title: 'Basic Research grant', org: 'University of Macedonia' },
  ],
} as const;

export type Publication = {
  title?: string;
  link?: string;
  year?: string;
  publication?: string;
  cited_by?: { value?: number };
};
