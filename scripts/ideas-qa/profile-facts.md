# George Michoulis: sourced fact sheet

Compiled 2026-09-30 for the portfolio redesign. Every line carries a source tag.

**Tag legend**
- `[legacy:X.tsx]`: `legacy/src-react/section/X.tsx` (or `layout/`, `pages/`), the old React site's source
- `[repo:path]`: a file in this repo (`src/data/profile.ts`, `public/publications.json`, git history)
- `[cert:file]`: a scan in `public/img/renamed/`. I read these images directly and quote only what is printed on them.
- `[live-site]`: what https://george-michoulis.com serves today (an older CRA build, `static/js/main.a12fa0d3.js`, plus the HTML head)
- `[scholar]`: https://scholar.google.com/citations?user=nk0lq8YAAAAJ, fetched 2026-09-30
- `[github]`: `gh api users/gmixoulis`, the repo list, pinned items, and the profile README (`gmixoulis/gmixoulis`)
- `[linkedin-mcp]`: the LinkedIn MCP `linkedin_get_my_profile` call
- `[web: URL]`: any other public page or API

---

## 1. Identity & links

### Profile URLs for schema.org `sameAs` (all verified as this person)
| Profile | URL | Source |
|---|---|---|
| LinkedIn | https://www.linkedin.com/in/george-michoulis/ | [legacy:Footer.tsx] [repo:src/data/profile.ts] [web: https://orcid.org/0000-0002-5139-448X] |
| GitHub | https://github.com/gmixoulis | [legacy:Footer.tsx] [github] |
| Google Scholar | https://scholar.google.com/citations?user=nk0lq8YAAAAJ | [legacy:Footer.tsx] [scholar] |
| ORCID | https://orcid.org/0000-0002-5139-448X | [web: https://pub.orcid.org/v3.0/0000-0002-5139-448X/record] (record links his LinkedIn, Scholar and GitHub) |
| X / Twitter | https://twitter.com/GeorgeMicou | [legacy:Footer.tsx] [github] (`twitter_username: GeorgeMicou`) |
| Semantic Scholar | https://www.semanticscholar.org/author/2180238066 | [web: https://api.semanticscholar.org/graph/v1/author/search?query=George%20Michoulis] |
| ResearchGate | https://www.researchgate.net/profile/George-Michoulis | [web: search result; the page itself returns HTTP 403] |
| Facebook | https://www.facebook.com/george.mihoulis/ | [legacy:Footer.tsx] (the current `profile.ts` dropped it, so it is optional) |

### Other pages about him (useful as citations, not `sameAs`)
- University of Nicosia staff page: https://www.unic.ac.cy/michoulis-george/ ("Full Stack Developer, Institute For the Future") [web: https://www.unic.ac.cy/michoulis-george/]
- AUTH Jean Monnet Centre of Excellence interns page: https://jm-euconst.auth.gr/center/en/the-center-of-excellence/interns/ [web: that URL]
- DBLP: his papers are indexed (keys `journals/simpra/NousiasTMPV22`, `conf/marble/PapangelouCM23`, `conf/iccel/TsourdinisMNALP25`), but I couldn't get the person-page PID because dblp.org served a bot challenge. [web: https://api.semanticscholar.org/graph/v1/author/2180238066/papers] (unverified PID)
- web3.career profile: https://web3.career/@gmichoulis [web: https://web3.career/@gmichoulis]. It shows salary expectations, so **don't link it**.
- Telegram `@gmichoulis`, plus TikTok and Twitch profiles, are listed on web3.career [web: https://web3.career/@gmichoulis]. I couldn't find the TikTok or Twitch handles (unverified).

### Contact & location
- Email: gmixoulis@gmail.com [repo:src/data/profile.ts] [github] [linkedin-mcp] (`emailVerified: true`)
- Location: "Greece · Thessaloniki, Remote" [legacy:Hero.tsx]; "Thessaloniki" [github]
- Domains: george-michoulis.com [live-site]. GitHub's `blog` field and Scholar's "Homepage" link still point to `gmixoulis.github.io` [github] [scholar]. The old `og:image` points to `gmichoulis.on.fleek.co` [live-site].
- Scholar shows a "Verified email at mc-class.gr" (the Mediterranean College domain) [scholar]

---

## 2. Headline / bio

- **LinkedIn headline: not available.** `linkedin_get_my_profile` returns only OpenID fields: name "George Michoulis", given/family name, picture, email, locale US/en. It returns no headline field. [linkedin-mcp] The public page returned HTTP 999. [web: https://www.linkedin.com/in/george-michoulis/]
- GitHub bio: "Software/Blockchain Developer" [github]
- GitHub README headline: "Software and AI Engineer | Blockchain / Full Stack Developer" [github]
- Live site `<title>`: "George Michoulis - Blockchain & Web3 Developer"; `og:title`: "George Michoulis - Web3 Developer" [live-site]
- web3.career headline: "Web3 & Blockchain Developer" [web: https://web3.career/@gmichoulis]
- Hero intro: "I Am George Michoulis". The typed roles cycle through BLOCKCHAIN, FULL-STACK, DATA SCIENCE, WEB3, MACHINE LEARNING, FREELANCE. [legacy:Hero.tsx]
- About (his words): "a blockchain developer and Deep Learning enthusiast from Thessaloniki, Greece, with a strong focus in Web3 design, research, and development… interest on lifelong learning." [legacy:About.tsx] [live-site]
- Current site thesis line: "Blockchain developer and researcher. Smart contracts, graph-based ML, and full-stack Web3 systems." [repo:src/data/profile.ts]
- ResearchGate bio (from the search snippet): a researcher, software engineer and blockchain developer "with a multidisciplinary focus on blockchain-based architectures"; the convergence of DLT, network and security, and AI-driven optimisation; "affiliated with Sidroco Holdings Ltd (Cyprus)". [web: https://www.researchgate.net/profile/George-Michoulis] (unverified wording: page 403, summary via search)
- README: currently interested in researching "Zero Knowledge Proofs (ZKPs)" and "Advanced Graph Neural Networks (Using PyTorch)" [github]
- Scholar research interests: Computer science, Blockchain, Ethereum, Deep Learning [scholar]
- ORCID keyword: blockchain [web: https://orcid.org/0000-0002-5139-448X]

---

## 3. Experience

| When | Role | Organisation | Details | Source |
|---|---|---|---|---|
| 05/2026 – present | Web3 Full-Stack Developer | Cyberscope by TAC | End-to-end Web3 products: smart contracts, on-chain integrations, React/Next.js frontends and Node services. Blockchain security tooling and audit workflows. Solidity, ethers/viem, TypeScript, cloud deployment. | [legacy:Resume.tsx]. Also corroborated by the `cyberscope.io` domain on this repo's recent commit author. Not on the live site or ORCID yet. |
| 2024 – 2026 | Blockchain Developer & Researcher | Sidroco Holdings LTD | Led blockchain work: an NFT marketplace for 5G technologies and advanced dashboards. Contributed to Horizon/MSCA/KA2 proposals "that secured EU funding". Coordinated, managed and disseminated multinational European projects (presentations, workshops, international events). Hyperledger Fabric prototypes. Moodle LMS for Erasmus+. | [legacy:Resume.tsx] (short form) [live-site] (full form) |
| ORCID: 2024 – 2025 | Blockchain Researcher, R&D | Sidroco Holdings LTD | Paper affiliation "Sidroco Holdings Ltd, R&D Dpt., Thessaloniki" on the 2024, 2025 and 2026 papers | [web: https://orcid.org/0000-0002-5139-448X] [web: https://api.crossref.org/works?query.author=Michoulis] |
| 2023 – 2025 | Lecturer & Academic Partner | University of Derby / Mediterranean College | Taught Networks & Security, Web Scripting and Application Development, with hands-on labs in coding, networking and cryptography. Inclusive, fair assessment: oral exams, projects, personal feedback. Represented the college at events and gave public talks on Web3 and edge tech. | [legacy:Resume.tsx] [live-site]. Scholar's mc-class.gr verified email supports this. [scholar] |
| 2022 – 2024 | Blockchain & Full-Stack Developer | University of Nicosia / Institute For the Future (IFF) | Led frontend work on large apps (Next.js, Flask, NestJS, Docker). Ran agile sprints with Asana/Trello. Delivered a Web3 NFT marketplace. Coordinated cross-functional teams. Shell and Docker pipelines. | [legacy:Resume.tsx] [live-site]. The 2022-11 version adds "Develop Flask based Application. Use of Gulp.js and Jquery… Develop Research Papers." [repo:git a1e9117] |
| (same role) | "Full Stack Developer, Institute For the Future" | University of Nicosia | Staff listing | [web: https://www.unic.ac.cy/michoulis-george/] |
| 2018 – 2021 | WordPress Developer (freelance) | Freelance | Sites: MarLab (marlab.ode.uom.gr), CELC (celc.web.auth.gr), EUDEM (eudem.polsci.auth.gr). Met clients about design and function. Built and updated WordPress sites. Made an organisation's introduction video. | [legacy:Resume.tsx] |
| (overlapping) | WordPress developer and video editor | Jean Monnet Chair for European Constitutional Law and Culture (AUTH) | "He is also WordPress developer and video editor for Jean Monnet chair…" | [web: https://jm-euconst.auth.gr/center/en/the-center-of-excellence/interns/] |
| 01 Oct 2019 – 31 May 2020 | Intern (πρακτική άσκηση) | Center for European Legal Culture (ΚΕΝοΠ), AUTH School of Law | Completed internship programme | [cert:Certificate-Of-Completion_Aristoteleio-University-Of-Thessaloniki-European-Legal-Culture-Program.jpg] [web: https://jm-euconst.auth.gr/center/en/the-center-of-excellence/interns/] |
| October 2018 (see conflicts) | Web Developer (volunteer) | MKI Hellas | Built a chatbot with Dialogflow, plus a web page and database with Vue.js and Firebase | [legacy:Resume.tsx] |
| Oct – Dec 2019 | Participant, skg.code project | skg.code (signed by MKI Hellas branch manager) | "regarding the creation of a Real Estate Chatbot" | [cert:Certificate-Of-Participation_Skgcode-Project-Creation-Of-A-Real-Estate-Chatbot.jpg] |
| Dec 2024 deliverable | Co-author (SID) | Horizon Europe NANCY project (GA 101096456) | Listed as a deliverable author of NANCY D3.3 "AI-based B-RAN Orchestration" (submitted 24 Dec 2024) | [web: https://nancy-project.eu/wp-content/uploads/2025/01/NANCY_D3.3_NANCY_AI-based_B-RAN_Orchestration_v1.0.pdf] |

---

## 4. Education

| When | Degree | Institution | Details | Source |
|---|---|---|---|---|
| 2020 – 2022 | MSc Data and Web Science | Aristotle University of Thessaloniki (School of Sciences, School of Informatics) | Awarded 27 March 2022 with «ΑΡΙΣΤΑ» (Excellent, the 8.5–10 band). Courses: Blockchain, Big Data (Scala–Spark), Advanced Machine Learning, Web Data Mining, NLP. Funded by a DeepMind scholarship. | [cert:1Master-Degree_1Master-Degree-Data-And-Web-Science.jpg] [legacy:Resume.tsx] [web: https://orcid.org/0000-0002-5139-448X] |
| MSc thesis | "Graph Embedding and Node Features for Drug-Target Interaction Prediction" (2022) | AUTH repository (IKEE) | DOI 10.26262/heal.auth.ir.338875. Keywords: Graph Embeddings, Drug Discovery, Node Features. | [scholar] [web: https://api.datacite.org/dois/10.26262/heal.auth.ir.338875] [live-site] [github] |
| 2015 – 2020 | BSc Applied Informatics (Πτυχίο Εφαρμοσμένης Πληροφορικής) | University of Macedonia | Grade «ΛΙΑΝ ΚΑΛΩΣ» (Very good). Conferred 23 February 2021, issued 10/04/2021. Courses: Cryptography, Computer Architecture, Operating Systems, Neural Networks, OO Programming (Java), Blockchain, Big Data Mining. | [cert:1Bachelor-Degree_Bachelor-Degree-Computer-Science.jpg] [legacy:Resume.tsx] [web: https://orcid.org/0000-0002-5139-448X] |
| BSc thesis | «Επαλήθευση ακαδημαϊκών τίτλων με χρήση της τεχνολογίας Blockchain» (Verification of academic qualifications with blockchain technology), 2020 | University of Macedonia repository | Handle 2159/24707; builds on Ethereum and smart contracts | [scholar] [web: https://dspace.lib.uom.gr/handle/2159/24707] [legacy:About.tsx] |
| 2014 – 2015 | Final year of upper-secondary school | 1st General Lyceum (ΓΕΛ) of Kalamaria | See Awards (Progress Award) | [cert:Award_Academic-Achievement.jpg] [legacy:Resume.tsx] |

The grade lines come from scans he already publishes on his certificate wall. Whether to repeat them on the page is his call.

---

## 5. Publications

Citation counts are from Scholar on 2026-09-30. `publications.json` is stale (see Conflicts).

**Peer-reviewed / formal**
1. **Benchmarking blockchain technologies for agricultural applications.** G. Michoulis (1st author), K. Tsourdinis, K. Kyranou, C. Eleftheriadis, E.M. Pechlivani, P. Christakakis, T. Lagkas, V. Argyriou, P. Sarigiannidis. *2026 22nd Int. Conf. on Distributed Computing in Smart Systems and the IoT (DCOSS-IoT)*, IEEE, pp. 505–512, 22 June 2026. DOI [10.1109/DCOSS-IoT69657.2026.00085](https://doi.org/10.1109/DCOSS-IoT69657.2026.00085). Benchmarks Ethereum Sepolia, Base, IOTA 2.0 Testnet, Sui and Hyperledger Fabric across four agricultural use cases: traceability, DeFi, IoT monitoring and data sharing. [scholar] [web: https://api.crossref.org/works?query.author=Michoulis]. **Not in publications.json.**
2. **Data security for smart cities.** C. Eleftheriadis, G. Michoulis, E. Fountoukidis, M. Tzana, A. Lytos, T. Lagkas, V. Argyriou, Z.D. Zaharis, P. Sarigiannidis. A book chapter in *Enabling Technologies for Sustainable Smart Cities*, IET, pp. 161–202, Oct 2025. DOI [10.1049/PBBE009E_ch8](https://doi.org/10.1049/PBBE009E_ch8), ISBN 9781839539442. 1 citation. [scholar] [web: https://pub.orcid.org/v3.0/0000-0002-5139-448X/record]
3. **Unlocking 5G Network Slicing: A Comprehensive Survey on Blockchain Marketplace Utilizing NFTs, AI, and Advanced Resource Management.** K. Tsourdinis, G. Michoulis, G. Niotis, V. Argyriou, T. Lagkas, K. Psannis, P. Radoglou-Grammatikis, K. Chrysagis, P. Sarigiannidis. *2025 IEEE Int. Conf. on Consumer Electronics (ICCE)*, pp. 1–6, 11 Jan 2025. DOI [10.1109/ICCE63647.2025.10929953](https://doi.org/10.1109/ICCE63647.2025.10929953). Scholar shows no count; Semantic Scholar shows 1. [scholar] [web: https://api.semanticscholar.org/graph/v1/author/2180238066/papers]
4. **FraMark: A Blockchain Marketplace for a 5G Network Management using Fractional NFTs.** G. Michoulis (1st author), K. Tsourdinis, G. Niotis, K. Kyranou, E. Fountoukidis, T. Lagkas, V. Argyriou, P. Sarigiannidis, K.E. Psannis, S.K. Goudos. *2024 7th World Symposium on Communication Engineering (WSCE)*, IEEE, pp. 15–21, 28 Sep 2024. DOI [10.1109/WSCE65107.2024.00009](https://doi.org/10.1109/WSCE65107.2024.00009). Hyperledger Fabric with fractional NFTs representing 5G resources, evaluated for CPU, memory, latency and block size. 2 citations. [scholar] [web: https://ieeexplore.ieee.org/abstract/document/10945166/]
5. **Exploring Decentralized Governance: A Framework Applied to Compound Finance.** S. Papangelou, K. Christodoulou, G. Michoulis. *Mathematical Research for Blockchain Economy: 4th Int. Conf. MARBLE 2023, London*, Lecture Notes in Operations Research (Springer), pp. 152–168, published 15 Dec 2023. DOI [10.1007/978-3-031-48731-6_9](https://doi.org/10.1007/978-3-031-48731-6_9), arXiv 2304.08160. Proposes a method to measure governance decentralisation in a DAO. 8 citations. [scholar] [web: https://link.springer.com/chapter/10.1007/978-3-031-48731-6_9]
6. **A process-aware approach for blockchain-based verification of academic qualifications.** N. Nousias, G. Tsakalidis, G. Michoulis, S. Petridou, K. Vergidis. *Simulation Modelling Practice and Theory* 121, 102642, Dec 2022 (Elsevier journal). DOI [10.1016/j.simpat.2022.102642](https://doi.org/10.1016/j.simpat.2022.102642). Design and early implementation of the VerDe (Verified Degrees) platform as a BPMN-based dApp. **34 citations, his most cited.** [scholar] [web: https://www.sciencedirect.com/science/article/abs/pii/S1569190X22001149]
7. **Verification of Academic Qualifications through Ethereum Blockchain: An Introduction to VerDe.** G. Michoulis (1st author), S. Petridou, K. Vergidis. *XIV Balkan Conference on Operational Research (BALCOR) 2020*, pp. 429–433, Sep 2020, ISBN 978-618-85079-0-6. Uses an ERC20 token for verification. 11 citations. [scholar] [web: https://www.researchgate.net/publication/344037052_Verification_of_Academic_Qualifications_through_Ethereum_Blockchain_An_Introduction_to_VerDe]

**Posters, student conference and theses**
8. **Blockchain in Higher Education: permissioned and permissionless approaches.** Georgios Michoulis, Nikolaos Nousias, Stylianos Basagiannis, Sophia Petridou. *4th Summit on Gender Equality in Computing (GEC'22)*, Poster Session 1 / flash talk, 16 June 2022. [scholar] [web: https://gec22.auth.gr/program/] [web: https://www.researchgate.net/publication/361226133_Blockchain_in_Higher_Education_permissioned_and_permissionless_approaches]
9. **A Gender Equality Observatory on Scientific Research.** S. Kyrama, V. Moschopoulos, D. Tourgaidis, G. Michoulis. *GEC'22*, Poster Session 1 / flash talk, 16 June 2022. Code at `KyraStyl/gender_equality_observatory` (he pins his fork). [scholar] [web: https://gec22.auth.gr/program/] [github]
10. «Επαλήθευση εγκυρότητας Ακαδημαϊκών Τίτλων με χρήση του Ethereum Blockchain». G. Michoulis, S. Petridou (plus K. Vergidis per the author string, unverified). *Management Science and Technology Students' Conference*, 2021. This is a student-conference paper, not a thesis. [scholar]
11. MSc thesis (2022) and BSc thesis (2020): see Education. [scholar]
12. "3rd Women in Bioinformatics & Data Science LA Conference Booklet" (Zenodo, 2022, author A. Rueda) is attached to his Scholar profile. His role in it is unknown (unverified; probably a listed contribution). [scholar]

---

## 6. Research metrics

- **Google Scholar (2026-09-30): 56 citations (all 56 since 2021), h-index 3, i10-index 2.** 13 items listed. [scholar]
- Scholar co-authors listed: Sophia Petridou and Kostas Vergidis (Dept. of Applied Informatics, University of Macedonia) [scholar]
- Frequent co-authors across papers: T. Lagkas, V. Argyriou, P. Sarigiannidis, K. Tsourdinis, K. Kyranou, G. Niotis, K. Psannis, E. Fountoukidis, C. Eleftheriadis, N. Nousias, K. Christodoulou [scholar]
- Semantic Scholar: 5 papers, 25 citations, h-index 2 [web: https://api.semanticscholar.org/graph/v1/author/search?query=George%20Michoulis]
- Scholar blocks nothing today; WebFetch and curl both returned the full profile.

---

## 7. Awards

| When | Award | Issuer | Detail | Source |
|---|---|---|---|---|
| 2020 – 2022 | DeepMind Scholarship | Aristotle University of Thessaloniki / DeepMind Technologies Ltd | Fully funded MSc. The old live site adds that these scholarships support students from underrepresented groups studying AI and adjacent fields. | [legacy:Resume.tsx] [live-site] [web: https://jm-euconst.auth.gr/center/en/the-center-of-excellence/interns/] |
| 06/2022 | 3rd place, Infinitech Hackathon | Crowdpolicy | An open-innovation action of the Infinitech project. The hackathon ran remotely on 16–17 June 2022 (web summary, unverified). I found no public winners list. | [legacy:Resume.tsx] [web: https://crowdhackathon.com/infinitech/] |
| 2020 – 2021 | Basic Research 2020-21 funding | Research Committee, University of Macedonia | "Received funding… under the Basic Research 2020-21 funding programme" | [legacy:Resume.tsx] [live-site] |
| (same) | "1st Place, Basic Research Awards (UoM), for Verde Academic Verification DApp" | University of Macedonia | The README's wording differs from the site's; see Conflicts | [github] |
| 2025 (inferred) | Move / Sui Bootcamp Thessaloniki award | not stated on the scan | The file is only the "Move Bootcamp Thessaloniki" logo, with no name, date or award text. The year is inferred from his `sui-move-bootcamp` fork (created 2025-05-20) and a TechPro Academy Sui & Move Bootcamp in Thessaloniki, 19–30 May 2025. | [cert:Move-Sui-First-Thessaloniki-Bootacamp-Award_Move-Bootcamp-Thessaloniki.png] [github] [web: https://www.techproacademy.gr/sui-move-bootcamp/] (unverified) |
| 2014 – 2015 (dated 26 Oct 2015) | Βραβείο Προόδου («Αιέν Αριστεύειν») (Progress Award, the old site's "Excellence Award") | Greek Ministry of Education, Research and Religious Affairs | First in his class in the final (Γ') year at 1st ΓΕΛ Kalamarias, overall grade 18.8/20 | [cert:Award_Academic-Achievement.jpg] [legacy:Resume.tsx] |

---

## 8. Certificates

The 34 files in `public/img/renamed/`. Details come from reading each scan. Titles are in sentence case. For the gallery, keep to title, issuer and year.

**Degrees and awards (4):** MSc Data and Web Science (AUTH, 2022); BSc Applied Informatics (UoM, conferred 2021; the file is misnamed "Computer Science"); Progress Award (2015); Move Bootcamp Thessaloniki. See above. [cert:*]

**Languages (2)**
- Certificate of Proficiency in English (ECPE), Michigan Language Assessment, **level C2**, test date 20 May 2018, Thessaloniki [cert:English-Certificate_English-Certificate-English-Proficiency.jpg]
- TOEIC Listening & Reading, ETS, **total 860** (Listening 460, Reading 400), 26 May 2018, Hellenic American Union, Thessaloniki [cert:Certificate-Of-Achievement_TOEIC-Listening-Reading-Test.jpg]

**Technical courses and programmes**
- Accelerated CCNA (Cisco Certified Network Associate): 132 hours, 30 Oct 2019 – 12 Jun 2020, Lifelong Learning Centre, University of Thessaly [cert:Certificate-Of-Completion_CCNA-Cisco-Certified-Network-Associate.jpg]
- Networking Essentials: Cisco Networking Academy "Verified" badge, no date shown [cert:Certificate-Of-Completion_Networking-Essentials.png]
- Cloud Engineering (Azure IaaS, App Service & Functions, Storage, Networking, Databases, Governance): 90 hours, 25 Nov – 20 Dec 2024, Code.Hub (issued 21 Dec 2024) [cert:Certificate-Of-Completion_Cloud-Engineering.png]
- Certified Rust Developer: W3Schools, issued 29 Dec 2025 [cert:Certificate-Of-Completion_Rust-Developer.png]
- Machine Learning and Deep Neural Networks (CVML short course): 17 hours, 1.5 ECTS, 27–28 Apr 2021, AUTH Center for Education and Lifelong Learning [cert:Certificate-Of-Completion_Machine-Learning-And-Deep-Neural-Networks.jpg]
- Advanced Ethical Hacking: 48-hour online seminar, Audax Cybersecurity, 12/2021 [cert:Certificate-Of-Completion_Advanced-Ethical-Hacking.png]
- Cybersecurity eLearning Academy: 20-hour penetration-tester course, College Link, 16/04/2023 [cert:Certificate-Of-Completion_Cybersecurity-ELearning-Academy.jpg]
- Introduction to Digital Currencies (MOOC): University of Nicosia IFF, 30/4/2020, exam grade 89.33 [cert:Certificate-Of-Achievement_Introduction-To-Digital-Currencies.jpg]
- NFT Talents Program: Frankfurt School Blockchain Center, issued 11 Oct 2022 [cert:Certificate-Of-Completion_NFT-Talents-Program.jpg]
- How to Get Published with IEEE: IEEE, 27 Feb 2020 [cert:Certificate-Of-Completion_How-To-Get-Published-With-IEEE.jpg]
- Software Development for Telecommunication Networks: 5-hour programme, Intracom Telecom, 8 May 2019 [cert:Certificate-Of-Completion_Software-Development-For-Telecommunication-Networks.jpg]
- GNU/Linux command line course: University of Macedonia Applied Informatics with GreekLUG, 6–21 May 2017 [cert:Certificate-Of-Participation_GNULinux-Command-Line.jpg]
- The Hour of Code: Code.org, 16/12/2013 [cert:Certificate-Of-Completion_The-Hour-Of-Code.jpg]

**Business and entrepreneurship**
- Founding, funding and development of startups (the file says "Entrepreneurship…"): 90 hours, 3 ECTS, Athens University of Economics and Business Lifelong Learning Centre, academic year 2022–23, «Άριστα» 87/100, 30 May 2023 [cert:Certificate-Of-Completion_Entrepreneurship-Funding-And-Development-Of-New-Enterprises.png]
- «Μίγμα Marketing και Brand»: National and Kapodistrian University of Athens (ΕΚΠΑ) e-learning, 5 Dec 2022 – 6 Feb 2023 [cert:Certificate-Of-Participation_MIGMA-MARKETING-KAI-BRAND.png]
- Discover Customer: PepsiCo School, 18 Jul 2018 [cert:Certificate-Of-Completion_Discover-Customer.jpg]
- Grow Greek Tourism Online (Google) digital-skills seminar, 13/10/2017 [cert:Certificate-Of-Completion_Digital-Skills-For-Tourism.jpg]
- How to Design & Build a Website: Grow Greek Tourism Online (Google), 20/04/2018 [cert:Certificate-Of-Completion_How-To-Design-Build-A-Website.jpg]

**Events and workshops (participation)**
- Blockchain for the legal industry: how is the Corona virus crisis making adoption more imminent? Block.co webinar powered by UNIC, 28 Apr 2020 [cert:Certificate-Of-Participation_Blockchain-For-The-Legal-Industry-How-Is-The.jpg]
- Blockchain in Education: Remote Learning, Social Distancing, and the Certification Case. Block.co / UNIC webinar, 19 May 2020 [cert:Certificate-Of-Participation_Blockchain-In-Education-Remote-Learning-Social-Distancing-And.jpg]
- Launch Event & RippleX Workshop: UNIC IFF Decentralized Learning Series, 11 Nov 2020 [cert:Certificate-Of-Participation_Launch-Event-RippleX-Workshop.jpg]
- VeChain ToolChain: Digital Transformation of the Healthcare Industry. UNIC IFF & VeChain, 15 Dec 2020 [cert:Certificate-Of-Participation_VeChain-ToolChain-Digital-Transformation-Of-The-Healthcare-Industry.jpg]
- Data Analytics to Strengthen Healthcare Cybersecurity (CUREX project): AUTH Data & Web Science MSc, 22 Mar 2021 [cert:Certificate-Of-Participation_Data-Analytics-To-Strengthen-Healthcare-Cybersecurity.jpg]
- Processing Data in the Fog: the RAINBOW fog computing platform. AUTH Data & Web Science MSc, 4 Apr 2022 [cert:Certificate-Of-Participation_Processing-Data-In-The-Fog-The-Example-Of.jpg]
- First EY Cyber Day, at EY offices (no date shown) [cert:Certificate-Of-Participation_EY-Cyber-Day.jpg]
- skg.code project: creation of a real estate chatbot, Oct–Dec 2019 [cert:Certificate-Of-Participation_Skgcode-Project-Creation-Of-A-Real-Estate-Chatbot.jpg]
- Hydrobot marine educational robotics programme: Eugenides Foundation, school year 2014–15 [cert:Certificate-Of-Participation_Marine-Educational-Robotics-Hydrobot-Program.jpg]
- Internship: Center for European Legal Culture, AUTH (see Experience) [cert:Certificate-Of-Completion_Aristoteleio-University-Of-Thessaloniki-European-Legal-Culture-Program.jpg]

---

## 9. Projects / sites

**Built or contributed to (portfolio screenshots in `public/img/portfolio/`, linked from the old site)** [legacy:Portfolio.tsx]
- **VerDe** (verde.uom.gr): his Ethereum credential-verification system from UoM. The screenshot shows the VerDe site with About, Demo, Publications, Team and Contact pages. The host didn't respond on 2026-09-30. [legacy:Portfolio.tsx] [scholar]
- **BBF, the Blockchain Benchmarking Framework** (bbf-gui.ddns.net): "aims at the deployment and evaluation of different blockchain protocols". The screenshot lists sponsors University of Nicosia, Ripple University Blockchain Research Initiative and XRP Ledger, plus "BBF Core" and "BBF UI" repos. His `Enterprise-Flask-Dashboard` repo describes "a web application portal, on top of an already developed blockchain benchmarking framework". The host didn't respond on 2026-09-30. [legacy:Portfolio.tsx] [github]
- **UNIC on-chain metaverse course site** (metau.unic.ac.cy): the screenshot says "The future of education is now: Decentralised, On-Chain and in the Metaverse" and has a Connect Wallet button. It is live (HTTP 200). [legacy:Portfolio.tsx]
- **UNIC Accelerate** (stg.accelerate.unic.ac.cy): the screenshot shows the staging login page [legacy:Portfolio.tsx]
- **MarLab** (marlab.ode.uom.gr), **CELC** (celc.web.auth.gr), **EUDEM** (eudem.polsci.auth.gr): freelance WordPress sites [legacy:Resume.tsx]

**GitHub** (48 public repos, 2 gists, 14 followers, account since 2017-06-11, "hireable") [github]
- Pinned: NFT-Marketplace (JS), MSc_Projects (Python), DTI-Graph-Embeddings (Jupyter), BSc-Computer-Science-Portfolio (C), CURE-Spark-Clustering (Scala), gender_equality_observatory (a fork) [github]
- README "Featured projects": NFT-Marketplace (React, Hardhat, Solidity, Arweave storage); Verde-Core (Solidity, Ethereum, React); Enterprise-Flask-Dashboard (Flask, Docker, Gulp); Fabric-Asset-Marketplace (Hyperledger Fabric, Node.js, chaincode); NextGen-AI-Learning (Next.js, OpenAI API, adaptive e-learning); Decentralized-Voting (React, Solidity, Web3.js); CURE-Spark-Clustering (Scala, Spark); Real-Estate-Marketplace (Vue.js, Mapbox, chatbot, a fork of a team repo from 2019-10) [github]
- Other original repos: `ledgerly` (Go REST microservice: CRUD, JWT, Kafka, PostgreSQL, Docker Compose, 2026); `Asset_Fractionalization` (Rust, 2026); `CoinGekoFullStack` (TypeScript, https://coin-geko-full-stack.vercel.app, 2026); `cryptobloom` ("Meetup's example of usage of modern web3 tools like wagmi, viem and appkit", 2026); `quantum-course-notebooks` ("Executable Qiskit notebooks for the KDVM EKETA quantum computing course", 2026); `Bitcoin-Anomaly-Detection`; `Nouns-DAO-Clone`; `Blockchain-Analytics-Dash` (TS); `Scala-Dominance-Analysis`; `Humor-NLP-Research` / `AI-Comedian-LSTM`; `Docx-to-H5P-Pipeline`; `Google-Forms-Automation`; `pokedex_marketplace`; `LFcourse` (https://lfcourse.vercel.app); `Royal-BlackJack-Java` (2017) [github]
- Stars are negligible (at most 1 on any original repo). Don't show star counts. [github]
- Languages across original repos: JavaScript, TypeScript, Python/Jupyter, Scala, Solidity, Go, Rust, Java, C, PHP [github]
- Security-learning forks: ethernaut, security-and-auditing-full-course-s23, secureum-mind_map, smart-contract-security [github]

**On this site** (not external): `/garden/` (Zen Garden notes) and `/play/` (Ledger Run platformer CV) [repo:scripts/ideas-qa/brief.md]

---

## 10. Talks / teaching

- Lecturer at University of Derby / Mediterranean College, 2023–2025: Networks & Security, Web Scripting, Application Development [legacy:Resume.tsx]
- "Actively represented the institution in events and public speaking on Web3 and edge technologies" [legacy:Resume.tsx]. I found no event pages naming specific talks (unverified beyond his own text).
- GEC'22 (4th Summit on Gender Equality in Computing, AUTH), 16 June 2022: two poster flash talks [web: https://gec22.auth.gr/program/]
- Sidroco: dissemination "through presentations, workshops, and international events" [live-site]
- A meetup demo repo, `cryptobloom` (wagmi, viem, AppKit) [github]. Which meetup is not stated (unverified).
- `quantum-course-notebooks` for the KDVM EKETA (CERTH) quantum computing course [github]. The course page names another instructor, so his role is unclear (unverified). [web: https://training.certh.gr/courses/quantum/]

---

## 11. Technical skills

- From his own README: Python, TypeScript, Java, Rust · React, Next.js, Vue.js, Tailwind · Node.js, Flask, FastAPI, Scala · Solidity, Hyperledger Fabric, Hardhat, Sui Move · PyTorch, TensorFlow, Spark, Pandas · Docker, Kubernetes, AWS, Azure [github]
- From his roles: Solidity, ethers/viem, TypeScript, React/Next.js, Node, cloud deployment, security tooling and audit workflows [legacy:Resume.tsx]; Next.js, Flask, NestJS, Docker, shell scripting, Gulp.js, jQuery [legacy:Resume.tsx] [repo:git a1e9117]; Hyperledger Fabric, Moodle LMS [legacy:Resume.tsx]; WordPress, video editing [legacy:Resume.tsx] [web: https://jm-euconst.auth.gr/center/en/the-center-of-excellence/interns/]; Dialogflow, Vue.js, Firebase [legacy:Resume.tsx]
- From the research: graph embeddings, deep learning, big data (Scala/Spark), NLP, BPMN process modelling, blockchain benchmarking (Ethereum, Base, IOTA, Sui, Fabric), fractional NFTs, DAO governance analysis [scholar] [legacy:Whatido.tsx]
- Also Go, Kafka, PostgreSQL, JWT (`ledgerly`), Qiskit (`quantum-course-notebooks`) [github]
- Old live site self-rated bars: HTML/CSS/JavaScript 90, Solidity 85, Python 87, WordPress 80, Docker 75, Bash 70, Machine Learning 70, Scientific Research 95 [live-site]. These are self-assessed. **Don't reuse the percentages.**
- web3.career skill tags: Agile, API, backend, blockchain, Docker, Ethereum, full-stack, JavaScript, machine learning, Next.js, Python, React, smart contracts, Solidity, Web3.js [web: https://web3.career/@gmichoulis]

---

## 12. Soft-skill evidence

- **Teaching:** Derby / Mediterranean College lecturer. Hands-on labs; oral exams, projects, personal feedback; "Championed inclusivity and fairness in assessment". [legacy:Resume.tsx] [live-site]
- **Research:** 7 formal publications plus 2 posters. 56 citations and an h-index of 3. First author on VerDe (2020), FraMark (2024) and the DCOSS-IoT benchmark (2026). [scholar]
- **Curiosity:** "the Hacker attitude, which is to enjoy building and breaking things to understand how they work" [legacy:Whatido.tsx]
- **Lifelong learning:** "lifelong learning is my way of life" [legacy:Whatido.tsx]. 34 files on the certificate wall, spanning 2013 (Hour of Code) to 2025 (Rust). [cert:*]
- **Clients:** freelance WordPress work, meeting clients about design and function, 2018–2021 [legacy:Resume.tsx]
- **Cross-team and international work:** coordinated multinational EU projects and wrote Horizon/MSCA/KA2 proposals at Sidroco [live-site]; co-author of a Horizon Europe NANCY deliverable [web: https://nancy-project.eu/wp-content/uploads/2025/01/NANCY_D3.3_NANCY_AI-based_B-RAN_Orchestration_v1.0.pdf]; coordinated cross-functional teams at UNIC [legacy:Resume.tsx]
- **Languages:** English C2 (ECPE 2018), TOEIC 860 [cert:English-Certificate_English-Certificate-English-Proficiency.jpg] [cert:Certificate-Of-Achievement_TOEIC-Listening-Reading-Test.jpg]; Greek is his mother tongue (implied by Greek degrees and publications, not stated anywhere); "Learn Foreign Languages" is listed as an activity [legacy:Activities.tsx]
- **Interdisciplinary range:** the legal-culture internship and the Jean Monnet Chair video and web work [web: https://jm-euconst.auth.gr/center/en/the-center-of-excellence/interns/]; business courses (AUEB startups 87/100, marketing) [cert:*]
- **Competitive building:** 3rd place at Infinitech 2022 and the Move bootcamp award [legacy:Resume.tsx] [cert:Move-Sui-First-Thessaloniki-Bootacamp-Award_Move-Bootcamp-Thessaloniki.png]

---

## 13. Activities / volunteering

- Workout; Keep updated with the latest news; Learn Foreign Languages; Watch Anime; Theatre Acting and Watching Theatre; Active Citizen / Politicized [legacy:Activities.tsx] [live-site]
- Volunteer web developer, MKI Hellas (chatbot, Vue.js, Firebase) [legacy:Resume.tsx]; the skg.code real-estate chatbot, Oct–Dec 2019 [cert:Certificate-Of-Participation_Skgcode-Project-Creation-Of-A-Real-Estate-Chatbot.jpg]
- As a school student: the Hydrobot marine robotics programme (2014–15) and the Hour of Code (2013) [cert:*]
- Hackathons and bootcamps: Infinitech 2022 (3rd place), Move/Sui Bootcamp Thessaloniki [legacy:Resume.tsx] [cert:*]
- Quote used on the old site: "We can only see a short distance ahead, but we can see plenty there that needs to be done." (Alan Turing) [legacy:Blockquote.tsx]

---

## 14. Name variants (all found in real sources)

- **Georgios Michoulis**: ORCID given name, IET chapter, GEC'22 programme, TOEIC, NFT Talents, Intracom, AUTH CELLL, skg.code [web: https://orcid.org/0000-0002-5139-448X] [web: https://gec22.auth.gr/program/] [cert:*]
- **Γεώργιος Μιχούλης**: AUTH repository record ("Μιχούλης, Γεώργιος"), UoM and AUTH degrees, many Greek certificates [web: https://api.datacite.org/dois/10.26262/heal.auth.ir.338875] [cert:1Master-Degree_1Master-Degree-Data-And-Web-Science.jpg]
- **Giorgos Michoulis** [cert:Certificate-Of-Completion_Cloud-Engineering.png]
- **Mixoylis George** (Greeklish) [cert:Certificate-Of-Completion_The-Hour-Of-Code.jpg]
- **George Mihoulis** (the Facebook URL slug) [legacy:Footer.tsx]
- Handles: `gmixoulis` (GitHub), `GeorgeMicou` (X), `gmichoulis` (web3.career, Telegram, git user) [github] [web: https://web3.career/@gmichoulis]
- The certificates and records also print his patronymic and hometown. They are deliberately left out here as private.

---

## 15. Conflicts between sources

1. **MSc thesis topic (important).** `About.tsx` says "thesis on graph embedding-based machine learning for fraud detection in blockchain networks", and `brief.md` repeats it. The AUTH repository (DOI 10.26262/heal.auth.ir.338875), Scholar, the old live site, the 2023–24 `index.xml` and the GitHub README all name the thesis **"Graph Embedding and Node Features for Drug-Target Interaction Prediction"**. The repository record is authoritative. Say "MSc thesis on graph embeddings (drug–target interaction prediction)". Keep "blockchain fraud detection" only if George confirms it was separate work; his `Bitcoin-Anomaly-Detection` repo (2024) may be that work (unverified).
2. **MKI Hellas date.** "October 2018" [legacy:Resume.tsx]; "2018 – 2021" [repo:git a1e9117, 8be56e1]; the MKI-signed skg.code chatbot certificate is dated **Oct–Dec 2019** [cert].
3. **Sidroco dates and title.** Site: 2024–2026, "Blockchain Developer & Researcher". ORCID: 2024–2025, "Blockchain Researcher". README: "Blockchain Researcher & Full-Stack Developer". web3.career: "full stack developer at Sidroco".
4. **UNIC IFF dates.** Site and web3.career: 2022–2024. ORCID: 2022–2022. UNIC staff page title: "Full Stack Developer".
5. **Basic Research 2020-21.** The site says he "received funding… under the Basic Research 2020-21 funding programme". The README says "1st Place, Basic Research Awards (UoM) for Verde". Use the site wording unless he confirms a placing.
6. **Citation counts.** `publications.json` (and `brief.md`) have 32 / 7 / 1 for the SIMPAT, MARBLE and FraMark papers. Scholar today has **34 / 8 / 2**. `publications.json` also lacks the 2026 DCOSS-IoT paper. Re-run the auto-update.
7. **Paper count.** The brief says "8 papers". Scholar lists 13 items: 7 formal publications (including 2026), 2 GEC posters, 1 student-conference paper, 2 theses and 1 booklet by another author.
8. **"Two Greek-language theses (2020 and 2021)"** in brief.md. Only 2020 is a thesis; the 2021 item is a paper at the Management Science and Technology Students' Conference.
9. **Paper titles in brief.md.** FraMark's real title says "for **a** 5G Network Management". ICCE's is "a **comprehensive** survey on blockchain **marketplace** utilizing…". "Data security for smart cities" is an IET book chapter, not an unlabeled item.
10. **BSc end date.** 2015–2020 on the site and ORCID. The degree was conferred 23 Feb 2021 (issued 10 Apr 2021). Not a real conflict: the course ended 2020 and the graduation formalities followed.
11. **BSc name in files.** `1Bachelor-Degree_Bachelor-Degree-Computer-Science.jpg` and the repo `BSc-Computer-Science-Portfolio` say "Computer Science". The degree scan says Εφαρμοσμένη Πληροφορική (**Applied Informatics**).
12. **MSc grade.** The README says "GPA 4.0". The degree scan shows «ΑΡΙΣΤΑ» (Excellent, 8.5–10) with no numeric grade. Say "graduated with Excellent" and treat "GPA 4.0" as unverified.
13. **Live site vs source.** george-michoulis.com still serves an older build without the Cyberscope role and with longer role descriptions. `legacy/src-react` has Cyberscope and trimmed text.
14. **Move/Sui award.** Only a logo image. It shows no award wording, name or year, so "award" and "2025" rest on the filename and inference.
15. **Scholar author strings.** "SP George Michoulis" and "KV George Michoulis" are Scholar parse artefacts (S. Petridou and K. Vergidis). The GEC programme gives the correct order for the Higher Education poster: Michoulis, Nousias, Basagiannis, Petridou.

---

## 16. New facts not yet on the finalist pages

This is the delta against `brief.md` and `brief-7-finalists.md`.

**Corrections to apply first**
- MSc thesis = "Graph Embedding and Node Features for Drug-Target Interaction Prediction", not blockchain fraud detection (conflict 1).
- Updated metrics: **56 citations, h-index 3, i10-index 2**. The most cited paper now has **34** (not 32). Compound has 8, FraMark 2.
- The 2021 Greek item is a student-conference paper, not a thesis. Fix the FraMark and ICCE titles.

**New research facts**
- New first-author paper: *Benchmarking blockchain technologies for agricultural applications*, IEEE DCOSS-IoT 2026, pp. 505–512, DOI 10.1109/DCOSS-IoT69657.2026.00085.
- DOIs for every formal paper (section 5); SIMPAT is a journal article (Elsevier, vol. 121); MARBLE 2023 was held in London (Springer LNOR, pp. 152–168).
- "Data security for smart cities" is an IET book chapter (*Enabling Technologies for Sustainable Smart Cities*, 2025, pp. 161–202).
- A second GEC'22 poster: *A Gender Equality Observatory on Scientific Research*. Both GEC posters were given as flash talks on 16 June 2022.
- Co-author of the Horizon Europe **NANCY** deliverable D3.3 (Dec 2024).
- ORCID iD **0000-0002-5139-448X** and a Semantic Scholar profile (add both to `sameAs`); a ResearchGate profile exists too.
- Scholar interests: Computer science, Blockchain, Ethereum, Deep Learning. README interests: zero-knowledge proofs and graph neural networks (PyTorch).

**New experience and education facts**
- Internship at AUTH's Center for European Legal Culture, 1 Oct 2019 – 31 May 2020. WordPress developer and video editor for the Jean Monnet Chair for European Constitutional Law and Culture. This explains the CELC/EUDEM sites.
- Sidroco detail: helped write Horizon/MSCA/KA2 proposals that secured EU funding; presentations, workshops and international events.
- UNIC detail: agile sprints with Asana/Trello; frontend team lead. The UNIC staff page lists him as "Full Stack Developer, Institute For the Future".
- Lecturer detail: labs covered coding, networking and cryptography; oral exams and personal feedback.
- MSc awarded 27 Mar 2022 with "Excellent"; BSc grade "Very good", conferred Feb 2021.
- Course lists: MSc (Blockchain, Big Data Scala–Spark, Advanced ML, Web Data Mining, NLP) and BSc (Cryptography, Computer Architecture, OS, Neural Networks, Java OOP, Blockchain, Big Data Mining).
- The MKI Hellas volunteer work links to the skg.code real-estate chatbot project, Oct–Dec 2019 (date conflict 2).

**New skills and certificate facts**
- **English C2** (Michigan ECPE, 2018) and **TOEIC 860** (2018). Use these for the Languages soft skill instead of "TOEIC and a proficiency certificate".
- Certificate detail: CCNA 132 h (University of Thessaly, 2019–20); Azure Cloud Engineering 90 h (Code.Hub, 2024); Certified Rust Developer (W3Schools, Dec 2025); ML & Deep Neural Networks (AUTH, 2021, 1.5 ECTS); Advanced Ethical Hacking 48 h (2021); pen-testing academy (2023); NFT Talents (Frankfurt School Blockchain Center, 2022); Intro to Digital Currencies (UNIC, 2020, 89.33); startups course (AUEB, 2023, 87/100, 3 ECTS).
- The Excellence Award is the Ministry of Education **Βραβείο Προόδου**: first in his final-year class with 18.8/20 (2015).
- Stack from his README: Java, Rust, Vue, Tailwind, FastAPI, Hardhat, Sui Move, PyTorch, TensorFlow, Kubernetes, AWS, Azure. Recent work adds Go, Kafka and PostgreSQL (`ledgerly`, 2026).

**New project facts**
- BBF (Blockchain Benchmarking Framework) GUI: benchmarks blockchain protocols; the screenshot shows UNIC, Ripple UBRI and XRP Ledger as sponsors.
- metau.unic.ac.cy is UNIC's on-chain, in-the-metaverse course site (it's live).
- accelerate.unic.ac.cy is a UNIC platform; the screenshot shows only its login page.

**Identity facts**
- Name variants: Georgios Michoulis and **Γεώργιος Μιχούλης** (from the AUTH repository and his degrees).
- Scholar shows a verified mc-class.gr email; GitHub, Scholar and the old site still point to `gmixoulis.github.io`.

**Status:** DONE_WITH_CONCERNS. Every requested source was covered except these, which were blocked: the LinkedIn MCP returned no headline field and linkedin.com returned HTTP 999, and DBLP, ResearchGate, AUTH IKEE and the UoM repository all returned 403 or bot walls. The MSc-thesis conflict needs George's confirmation before the brief's "blockchain fraud detection" line is used again.

## 17. Owner confirmations (George, 2026-09-30): these override every source above
- MSc thesis: **"Graph Embedding and Node Features for Drug-Target Interaction Prediction"** only. Drop "blockchain fraud detection" everywhere.
- Basic Research 2020-21: **"1st place, Basic Research Awards (University of Macedonia), for the VerDe dApp"**, the README wording, not "funding".
- MKI Hellas volunteer web developer: **Oct – Dec 2019**.
- Sidroco Holdings: **2024 – 2026**, as on the site.
