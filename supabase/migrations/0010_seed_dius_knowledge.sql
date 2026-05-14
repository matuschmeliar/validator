-- Seed: DIUS knowledge base from Obsidian export.
-- Active by default: core knowledge (01) + architecture vocabulary (02).
-- Inactive (toggle in /knowledge): navigation MOCs (00) + concrete idea samples (03).

-- Idempotent: skip rows whose title already exists.

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb1$[Index] HOME$kb1$, $kb1$
---
title: HOME
tags: [moc, index, home]
created: 2026-05-11
---

# JRVS Vault — HOME

> **Cesta je cieľ.**
> — Patrik Tkáč, DiusAI

Toto je centrálny vault projektu **JARVIS / DIUS AI**. Slúži ako živá báza poznania pre víziu, architektúru, projekty a postavy. Otvor v Obsidiani cez **Open folder as vault**.

## Mapa obsahu

- [[MOC - Knowledge Base]] — Zdrojové dokumenty (Patrik, Rasťo)
- [[MOC - Architektúra]] — Komponenty Jarvisa (JCB, ECB, Skill, …)
- [[MOC - Vízie]] — Brainstorm vizionárskych ideí
- [[MOC - Projekty]] — Konkrétne biznisy postavené na Jarvisovi
- [[MOC - Postavy]] — Ľudia v projekte

## Rýchle linky

- [[Vízia - Patrik Tkáč 2023]]
- [[Architektúra - Rasťo Rejdovian v2]]
- [[Od našich]] — pilotný projekt, 3000 klientov

## Princípy

1. **Zospodu nahor** — začíname od reálnych klientov a ich dát.
2. **Osobné dáta = najväčšia hodnota.**
3. **LLM je derivácia ľudského vedomia** — extrakt z jazyka.
4. **Agenti = postupná algoritmizácia ľudského bytia.**
5. **Cesta je cieľ.**

## Tagy

`#vízia` `#architektúra` `#projekt` `#postava` `#zdroj`
`#dáta` `#etika` `#humanoid` `#after-life` `#komunita`
`#horizont/now` `#horizont/krátky` `#horizont/stredný` `#horizont/sci-fi`

$kb1$, false, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb1$[Index] HOME$kb1$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb2$[Index] MOC - Architektúra$kb2$, $kb2$
---
title: MOC - Architektúra
tags: [moc, architektúra]
---

# MOC — Architektúra

Komponenty Jarvisa podľa [[Architektúra - Rasťo Rejdovian v2]].

## Riadiace komponenty
- [[JCB]] — Jarvis Core Beacon (hlavný systémový prompt)
- [[ECB]] — Enhanced Core Beacon (ľudský popis správania)
- [[Trigger]] — spúšťač akcií
- [[Orchestrácia]] — skladač komponentov
- [[DIO]] — Dynamické Inštrukčné Okno

## Komponenty činnosti (od najväčšieho)
- [[Skill]] — ucelená schopnosť
- [[Command]] — konkrétna akcia
- [[Agent]] — asynchrónna činnosť na pozadí
- [[Tool]] — najmenšia jednotka

## Pamäť a dáta
- [[Dátová mapa]] — vrcholová pamäť
- [[Pamäť - STM a LTM]]
- [[XDCS - GDCS PDCS SDCS]]

← [[HOME]]

$kb2$, false, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb2$[Index] MOC - Architektúra$kb2$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb3$[Index] MOC - Knowledge Base$kb3$, $kb3$
---
title: MOC - Knowledge Base
tags: [moc, zdroj]
---

# MOC — Knowledge Base

Zdrojové dokumenty, z ktorých všetko vychádza.

- [[Vízia - Patrik Tkáč 2023]] — manifest, vízia, ekosystém, oblasti (PDA/PDS/LLM/LTM/Agent/IO)
- [[Architektúra - Rasťo Rejdovian v2]] — technická architektúra (JCB, ECB, Skill, Command, Agent, Tool, DM, Pamäť)

← [[HOME]]

$kb3$, false, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb3$[Index] MOC - Knowledge Base$kb3$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb4$[Index] MOC - Postavy$kb4$, $kb4$
---
title: MOC - Postavy
tags: [moc, postava]
---

# MOC — Postavy

- [[Patrik Tkáč]] — zakladateľ, vizionár
- [[Rasťo Rejdovian]] — autor architektúry v2
- [[Marek Rosa]] — mentor, GoodAI
- [[Robotechvision - Martin a Peter]] — HW/I/O partneri
- [[Garabík - SAV]] — slovenský LLM

← [[HOME]]

$kb4$, false, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb4$[Index] MOC - Postavy$kb4$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb5$[Index] MOC - Projekty$kb5$, $kb5$
---
title: MOC - Projekty
tags: [moc, projekt]
---

# MOC — Projekty

- [[Od našich]] — pilot, ~3000 klientov, potraviny
- [[Rodina J&T]] — ďalší stupeň rozšírenia (stovky tisíc)
- [[DiusAI - core firma]]

← [[HOME]]

$kb5$, false, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb5$[Index] MOC - Projekty$kb5$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb6$[Index] MOC - Vízie$kb6$, $kb6$
---
title: MOC - Vízie
tags: [moc, vízia]
---

# MOC — Vízie

Vizionárske idey rozdelené do troch smerov. Otvor [[HOME]] pre filozofické ukotvenie. Každá idea má frontmatter so smerom a horizontom.

## A) Využitie dát a ich kombinácie
- [[Idea - Data Wills]]
- [[Idea - Memory Mesh]]
- [[Idea - Posthumous Voice]]
- [[Idea - Family Data Trust]]
- [[Idea - Generational Wisdom Index]]
- [[Idea - Klikový životopis]]
- [[Idea - Data Dividend]]
- [[Idea - Sensory Diary]]
- [[Idea - Empathy Layer]]
- [[Idea - Conflict Resolver]]
- [[Idea - Health Twin]]
- [[Idea - Combined Memory]]

## B) Posun architektúry samotnej
- [[Idea - Personal LLM Distillation]]
- [[Idea - Federated Skill Marketplace]]
- [[Idea - Sleeping Agents]]
- [[Idea - Self-Auditing ECB]]
- [[Idea - Co-Embodiment Protocol]]
- [[Idea - Negotiation Bus]]
- [[Idea - Soul Vector]]
- [[Idea - Genetic Skills]]
- [[Idea - Time-shifted Jarvis]]
- [[Idea - Dream Layer]]
- [[Idea - Constitutional ECB]]
- [[Idea - Multi-User Cohabitation]]

## C) Spoločenské a filozofické vízie
- [[Idea - Personal Data Bill of Rights]]
- [[Idea - Robot Funeral and Inheritance]]
- [[Idea - Jarvis School]]
- [[Idea - Civic Jarvis]]
- [[Idea - Anti-loneliness Layer]]
- [[Idea - End of Bureaucracy]]
- [[Idea - Robot Citizenship Tiers]]
- [[Idea - Klonovaný odkaz]]
- [[Idea - Reality Provenance]]
- [[Idea - Family Constitution]]

← [[HOME]]

$kb6$, false, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb6$[Index] MOC - Vízie$kb6$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb7$Architektúra - Rasťo Rejdovian v2$kb7$, $kb7$
---
title: Architektúra - Rasťo Rejdovian v2
author: Rasťo Rejdovian
version: 2.0
date: 2025-06-17
tags: [zdroj, architektúra]
---

# Architektúra — Komponenty systému (v2.0)

Autor: [[Rasťo Rejdovian]] · 2025-06-17

## Úvod
Logický popis komponentov, ich funkcií, vzájomných interakcií a orchestrácie. Skladám sa z vlastných komponentov, externých služieb (volania API), infraštruktúry a HW. Každý komponent má svoj [[ECB]]. Najväčší komponent je [[Skill]], najmenší je [[Tool]].

## Komponenty
- [[JCB]] — Jarvis Core Beacon, hlavný systémový prompt
- [[ECB]] — Enhanced Core Beacon, ľudský popis správania komponentu
- [[Trigger]] — spúšťač akcií (systémový / skillový / Q-P od užívateľa)
- [[Skill]] — ucelená činnosť s očakávaným výsledkom (interná / externá)
- [[Command]] — konkrétna akcia (napr. "Otvor dvere v Od našich")
- [[Agent]] — asynchrónna činnosť na pozadí, neinteraguje priamo s userom
- [[Tool]] — najmenšia jednotka (napr. kód + API)
- [[Dátová mapa]] — vrcholová pamäť (objekty/atribúty/hodnoty)
- [[Pamäť - STM a LTM]] — krátkodobá relácia + dlhodobá LTM
- [[XDCS - GDCS PDCS SDCS]] — Extended Data Current Status
- [[Orchestrácia]] — skladač
- [[DIO]] — Dynamické Inštrukčné Okno

## Vzťahy (textový diagram)

```
[Q/P užívateľa] → [Trigger] → [Orchestrácia]
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
   [Dátová mapa]              [Skill/Command/Agent]      [JCB + XDCS]
   - JCB                          │                          │
   - ECB                          ├─ Tool                    │
   - DATA                         ├─ Tool                    │
   - SKILL                        └─ Tool                    │
   - AGENT                                                   │
   - TOOL                                                    ▼
                                                          [DIO]
                                                       (finálny prompt)
                                                            │
                                                            ▼
                                                       [Odpoveď userovi]
```

## LTM štruktúra
- **RawQA (RQA)** — surové Q/A + timestamp + ID
- **BQA** — bloky Q/A párov podľa pravidiel
- **DRQA** — derivát konkrétneho RQA (sumarizácia, analýza)
- **DBQA** — derivát BQA (analógia)
- **DM** — [[Dátová mapa]]
- **DPHOTO** — deriváty z fotografií
- **XDCS** — Extended Data Current Status ([[XDCS - GDCS PDCS SDCS]])

→ otvorené otázky a smery posunu: [[Idea - Self-Auditing ECB]], [[Idea - Constitutional ECB]], [[Idea - Sleeping Agents]], [[Idea - Dream Layer]]

$kb7$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb7$Architektúra - Rasťo Rejdovian v2$kb7$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb8$Vízia - Patrik Tkáč 2023$kb8$, $kb8$
---
title: Vízia - Patrik Tkáč 2023
author: Patrik Tkáč
org: DiusAI
year: 2023
location: Bratislava
tags: [zdroj, vízia, manifest]
---

# Vízia — JARVIS, DIUS a umelá inteligencia

> Komerčný a zároveň OPEN projekt na zlepšenie ľudského života a života spoločnosti.

Autor: [[Patrik Tkáč]] · 2023 · Bratislava · [[DiusAI - core firma]]

## Kapitoly
- Projekt JARVIS — osobný digitálny robot so všeobecnou AI
- DIUS — core decision system, "Jarvis brain"
- [[PDA - Personal Data Acquisition]]
- [[PDS - Personal Data Storage]]
- LLM — large language models
- LTM — long term memory
- AGENT — agents
- I/O — Input/Output, HW + SW
- A ešte jedna vec ...

## Projekt JARVIS
Vzor: **Jarvis (Iron Man)** a **TARS (Interstellar)**. Robot = software + hardware + dáta. Cieľ: stavať osobného asistenta s vedomím, že "filmové" roboty sú dnes ešte vízia, ale general AI bude hrať veľmi významnú úlohu — a my chceme byť pri tom. Priebežné výsledky a produkty budú užitočné komunite aj komerčne.

## DIUS — Domáci Informačno-Užitočný Systém
Mozog Jarvisa. Patrik priznáva, že syntéza nižších oblastí (dáta + agenti + LLM + LTM) až ukáže, čo považujeme za "CORE / mozog". Slovo DIUS vymyslel ako 11-ročný, keď natiahol drôt cez byt na spínač v inej miestnosti — prvý krok k inteligentnej domácnosti.

**Vízia:** Ľudia majú osobných digitálnych robotov. Architektúra = osobné dáta + zručnosti + všeobecné dáta + komerčné dáta + špeciálne spôsoby pamäte + tisícky agentov + LLM + senzory. Robot je prítomný **naraz** vo viacerých zariadeniach (mobil, kuchynský robot na kolieskach, pes-strážca, dron s termokamerou, samoriadiace auto). Neprepína sa — je všade naraz cez wifi / cloud, alebo kopíruje časť seba do menšieho zariadenia.

Pôsobí počas života majiteľa **aj po jeho odchode** — v súlade s právom a ochranou dát.

→ pozri [[Idea - Data Wills]], [[Idea - Posthumous Voice]], [[Idea - Klonovaný odkaz]]

## PDA / PDS — Personal Data Acquisition / Storage
**Príbeh:** Patrika pred rokom takmer prešlo auto. Uvedomil si — nemal žiadne pripravené dáta na pokračovanie odkazu po smrti. Možno nič, možno všetko — podstatné je mať možnosť sa rozhodnúť.

**Drsný sen:** Po odchode by sa aktivovali (alebo spali do podmienenej chvíle) digitálne ruky robota s mojím podpisom. Legislatívne, morálne, citové prekážky — ale "nemusí byť všetko hneď, cesta je cieľ".

**Hodnota dát dnes:** Kliky na linky = osobné vlastníctvo, ktoré reprezentuje osobnosť a dokumentuje život. Patrik chce, aby jeho digitálny asistent tieto dáta **mal — on a iba on**.

**Najbližšie kroky:**
1. Popis ekosystému osobných dát.
2. Mapovanie existujúcich zariadení a protistrán.
3. Návrh štruktúr pre uchovávanie + vyššie vrstvy kombinovaných dát.

**Tím potrebný:** Pedagóg · neurovedec · dátový znalec · technológ · právnik.

→ [[Idea - Memory Mesh]], [[Idea - Klikový životopis]], [[Idea - Data Dividend]]

## LLM
Definícia: matematický model súvislosti tokenov a pravdepodobnosti ich výberu. Umožňuje komunikáciu s počítačom **ľudskou rečou**. Sledujeme všetky relevantné modely (nielen OpenAI).

**Konkrét:** spolupráca s [[Garabík - SAV]] — slovenský open-source LLM, neskôr komerčný s vlastnými dátami (IKAR).

→ [[Idea - Personal LLM Distillation]], [[Idea - Soul Vector]]

## LTM
Patrik priznáva: "neviem, či to správne hovorím, ale stačí sa spýtať chatu GPT". Verí, že LTM nie je oblasťou jedného finálneho objavu, je to dlhá cesta — a **práve preto** v nej môžeme robiť prevratné objavy aj bez miliárd. Nájdeme jedného/viacerých významných vedcov.

## AGENT
**Agenti = algoritmy**, kým nie je AGI. Drvivá väčšina toho, čo bude vyzerať inteligentne, bude v skutočnosti činnosť agentov.

Tri vrstvy agentov:
1. **Systémoví** — chod základného OS robota
2. **Auto-generovaní** — výstup deep learningu
3. **Tretie strany** — celý nový ekosystém producentov

Príklady z dokumentu: poloha (GPS, prepojenia, predikcie pohybu) · databázy (vinný lístok, nákup vína) · nákup v Od našich (interaktívna rekonštrukcia košíka hlasom) · telefón ako I/O · účtovníctvo a audit (musí zmiznúť ako ľudská činnosť) · **interakcie medzi asistentmi rôznych ľudí — kombinovaná spomienka, nová hodnota.**

→ [[Idea - Combined Memory]], [[Idea - Federated Skill Marketplace]]

## I/O
Partneri: [[Robotechvision - Martin a Peter]]. Robot je všade: inteligentné reproduktory, tablety, dron s infrakamerou (Jarvis sa "posiela do vzduchu"). Sledujeme samoriadiace autá, drony, bicykle, lode, lietadlá. Patrik píše, že vývoj **vlastného humanoidného robota** je otázkou osobnej cti.

**Interface obsesia:** Patrik nechápe, ako Android nedobehol Apple v UX. Komunikácia s robotom musí byť multimédiá — text, zvuk, obrázky, videá, emotikony, nekonečné kombinácie. Aj Neuralink.

## A ešte jedna vec...
[[Marek Rosa]] povedal Patrikovi: celý GPT-4 sa zmestí do polovičky pamäte 1TB iPhonu. Stovky miliárd slov → pol terabajtu. **Definícia Patrika:** "Je to derivácia ľudského vedomia. Matematický extrakt ľudského vyjadrovania."

**Vízia:** Keď podobne preženieme superpočítačom dáta **jedného človeka** (alebo komunity) → vyleziie nám **extrakt esencie konkrétnej osoby**. Kvalita = kvalita vstupných dát.

A potom: tvoj osobný LLM model sa prepojí / fine-tuninguje s tým všeobecným (alebo špecifickými) → dočasne, podľa potreby.

> Budúcnosti zdar a CESTA je cieľ. — Patrik Tkáč

→ [[Idea - Soul Vector]], [[Idea - Personal LLM Distillation]]

$kb8$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb8$Vízia - Patrik Tkáč 2023$kb8$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb9$Agent$kb9$, $kb9$
---
title: Agent
tags: [architektúra]
type: komponent
---

# Agent

**Asynchrónna činnosť na pozadí.** Nekomunikuje priamo s užívateľom. Má svoj [[ECB]], môže byť spustený [[Trigger]]om alebo iným komponentom. Výsledok dáva späť do [[Dátová mapa|Dátovej mapy]] alebo do iného [[Skill]]u.

Tri vrstvy (podľa [[Vízia - Patrik Tkáč 2023]]):
1. **Systémoví** — chod základného OS robota
2. **Auto-generovaní** — výstup deep learningu
3. **Tretie strany** — celý nový ekosystém producentov

→ Otvorené smery: [[Idea - Sleeping Agents]], [[Idea - Negotiation Bus]]

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb9$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb9$Agent$kb9$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb10$Command$kb10$, $kb10$
---
title: Command
tags: [architektúra]
type: komponent
---

# Command

Konkrétna akcia — napríklad **"Otvor dvere v predajni Od našich"**. Má svoj [[ECB]], využíva [[Tool]]y a dáta z [[Dátová mapa|Dátovej mapy]].

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb10$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb10$Command$kb10$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb11$DIO$kb11$, $kb11$
---
title: DIO
tags: [architektúra]
---

# DIO — Dynamické Inštrukčné Okno

Finálny prompt, ktorý ide do LLM. Skladá sa z:
- [[JCB]]
- [[XDCS - GDCS PDCS SDCS|XDCS]]
- relevantné [[ECB]] aktívneho komponentu
- dát z [[Dátová mapa|DM]] a [[Pamäť - STM a LTM|STM/LTM]]
- aktuálne Q/P užívateľa

DIO je výstup [[Orchestrácia|Orchestrácie]].

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb11$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb11$DIO$kb11$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb12$Dátová mapa$kb12$, $kb12$
---
title: Dátová mapa
tags: [architektúra, pamäť]
alias: DM
---

# Dátová mapa (DM)

**Vrcholová pamäť** Jarvisa. Objekty, ich atribúty, hodnoty a vzťahy. Obsahuje:
- [[JCB]]
- [[ECB]] (registry)
- DATA
- SKILL / AGENT / TOOL registries
- profil užívateľa, zariadenia, miesta, dokumenty, ...

DM je zdroj pravdy pre [[Orchestrácia]] a vstup do [[DIO]].

→ Otvorené smery: [[Idea - Memory Mesh]], [[Idea - Combined Memory]], [[Idea - Family Data Trust]]

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb12$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb12$Dátová mapa$kb12$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb13$ECB$kb13$, $kb13$
---
title: ECB
tags: [architektúra, core]
type: komponent
---

# ECB — Enhanced Core Beacon

**Ľudský** popis správania jednotlivých komponentov, ktorý definuje kompetentná osoba zodpovedná za danú oblasť. Môže ísť o [[JCB]], [[Skill]], [[Command]], [[Agent]], [[Tool]] alebo iný objekt z [[Dátová mapa|Dátovej mapy]].

ECB môže obsahovať:
- spôsob komunikácie pre daný komponent,
- postupnosť krokov,
- dáta potrebné z Dátovej mapy alebo nutnosť ich vyžiadania od užívateľa,
- popis a postupnosť volania iných komponentov.

ECBčka sú objekty v Dátovej mape, registrované v **ECB_Registry**.

→ Otvorené smery: [[Idea - Self-Auditing ECB]], [[Idea - Constitutional ECB]]

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb13$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb13$ECB$kb13$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb14$JCB$kb14$, $kb14$
---
title: JCB
tags: [architektúra, core]
type: komponent
---

# JCB — Jarvis Core Beacon

Hlavný systémový prompt. Skladá sa zo základných pravidiel správania a komunikácie s užívateľom. **Vstupuje do každej komunikácie / aktivity.** Spúšťaný vstupom od užívateľa (Q/P) alebo iným [[Trigger]]om. JCB je objekt v [[Dátová mapa|Dátovej mape]].

Spolu s [[XDCS - GDCS PDCS SDCS|XDCS]] formuje finálne [[DIO]].

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb14$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb14$JCB$kb14$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb15$Orchestrácia$kb15$, $kb15$
---
title: Orchestrácia
tags: [architektúra]
---

# Orchestrácia

Skladač komponentov. Príjme [[Trigger]], rozhodne ktoré [[Skill]]y / [[Command]]y / [[Agent]]i / [[Tool]]y zavolá, v akom poradí, s akými dátami z [[Dátová mapa|DM]] a [[Pamäť - STM a LTM|STM/LTM]]. Výsledok skladá do [[DIO]].

→ Otvorené smery: [[Idea - Negotiation Bus]], [[Idea - Self-Auditing ECB]]

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb15$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb15$Orchestrácia$kb15$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb16$Pamäť - STM a LTM$kb16$, $kb16$
---
title: Pamäť - STM a LTM
tags: [architektúra, pamäť]
---

# Pamäť — STM a LTM

## STM — Short Term Memory
Krátkodobá pamäť aktuálnej relácie. Slúži pre [[Orchestrácia|Orchestráciu]] a [[DIO]] aby zachoval kontext konverzácie.

## LTM — Long Term Memory
Dlhodobá pamäť. Štruktúry podľa [[Architektúra - Rasťo Rejdovian v2|architektúry v2]]:
- **RawQA (RQA)** — surové Q/A
- **BQA** — bloky Q/A párov
- **DRQA** — derivát RQA (sumarizácia, analýza)
- **DBQA** — derivát BQA
- **DM** — [[Dátová mapa]]
- **DPHOTO** — deriváty z fotografií
- **XDCS** — [[XDCS - GDCS PDCS SDCS]]

Podľa [[Vízia - Patrik Tkáč 2023|Patrika]]: LTM nie je oblasť jedného objavu, je to dlhá cesta — preto sa oplatí investovať aj bez miliárd.

→ Otvorené smery: [[Idea - Dream Layer]], [[Idea - Time-shifted Jarvis]], [[Idea - Sensory Diary]]

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb16$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb16$Pamäť - STM a LTM$kb16$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb17$Skill$kb17$, $kb17$
---
title: Skill
tags: [architektúra]
type: komponent
size: najväčší
---

# Skill

Schopnosť vykonať **ucelenú aktivitu s očakávaným výsledkom**. Má svoj [[ECB]]. Realizovaný kombináciou viacerých [[Command]]ov, [[Agent]]ov, [[Tool]]ov + dát z [[Pamäť - STM a LTM|STM]], [[Dátová mapa|Dátovej mapy]] alebo vyžiadaných od užívateľa.

Druhy:
- **Interné** — vyvíjané v [[DiusAI - core firma]]
- **Externé** — 3. strana dohodnutým rozhraním

→ Otvorené smery: [[Idea - Federated Skill Marketplace]], [[Idea - Genetic Skills]]

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb17$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb17$Skill$kb17$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb18$Tool$kb18$, $kb18$
---
title: Tool
tags: [architektúra]
type: komponent
size: najmenší
---

# Tool

Najmenšia jednotka. Typicky **kúsok kódu + volanie API**. Má svoj [[ECB]]. Používa sa v rámci [[Skill]]u, [[Command]]u alebo [[Agent]]a.

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb18$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb18$Tool$kb18$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb19$Trigger$kb19$, $kb19$
---
title: Trigger
tags: [architektúra]
type: komponent
---

# Trigger

Detekcia zámeru a spúšťač ďalších akcií. Druhý krok po Q/P od užívateľa; **prvý**, ak ide o skillový alebo systémový trigger.

Typy:
- **Systémový** — interný stav, čas, udalosť
- **Skillový** — výstup [[Skill]]u
- **Užívateľský** — Q/P od človeka

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb19$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb19$Trigger$kb19$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb20$XDCS - GDCS PDCS SDCS$kb20$, $kb20$
---
title: XDCS - GDCS PDCS SDCS
tags: [architektúra, pamäť]
---

# XDCS — Extended Data Current Status

Súhrnný status / kontext, ktorý sa zapisuje do [[DIO]] popri [[JCB]].

Varianty:
- **GDCS** — General DCS (všeobecný stav)
- **PDCS** — Personal DCS (osobný stav užívateľa)
- **SDCS** — Skill / Situational DCS (špecifický pre [[Skill]] alebo situáciu)

Slúži ako "stav sveta v tomto momente" — to, čo musí mať LLM v zornom poli.

← [[Architektúra - Rasťo Rejdovian v2]] · [[MOC - Architektúra]]

$kb20$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb20$XDCS - GDCS PDCS SDCS$kb20$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb21$Idea - Genetic Skills$kb21$, $kb21$
---
title: Idea - Genetic Skills
smer: B - Posun architektúry
horizont: stredný
tags: [vízia, skill, evolúcia]
---

# Genetic Skills

[[Skill]]y sa **párujú a mutujú**. Z dvoch úspešných skillov vznikne tretí (kombinácia ich ECB), beží sandbox audit, ak prejde — ide do [[Idea - Federated Skill Marketplace|marketplace]]. Evolučný tlak: reputácia a počet úspešných použití.

Súvisí: [[Idea - Self-Auditing ECB]]

$kb21$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb21$Idea - Genetic Skills$kb21$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb22$Idea - Negotiation Bus$kb22$, $kb22$
---
title: Idea - Negotiation Bus
smer: B - Posun architektúry
horizont: krátky
tags: [vízia, agent, negotiation]
---

# Negotiation Bus

Štandardizovaný **agent-to-agent protokol** pre vyjednávanie medzi Jarvismi rôznych ľudí (a firiem). Príklad: môj Jarvis vyjednáva s tvojím termín stretnutia, alebo s Jarvisom Tesco-a zľavu. Bez ľudského kliku.

Súvisí: [[Idea - Combined Memory]], [[Idea - Data Dividend]], [[Idea - Federated Skill Marketplace]]

$kb22$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb22$Idea - Negotiation Bus$kb22$);

insert into knowledge_documents (title, content_md, active, uploaded_by_email)
select $kb23$Idea - Personal LLM Distillation$kb23$, $kb23$

$kb23$, true, 'system@dius'
where not exists (select 1 from knowledge_documents where title = $kb23$Idea - Personal LLM Distillation$kb23$);

