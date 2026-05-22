// Curated canonical kill list — kept in lockstep with
// transform/seeds/dexter_kills.csv. In a production deployment the
// front end would query gold.fct_kill directly (or a static export of
// it); here we ship a typed mirror so /kills, /victims, /methods, etc.
// render without a live Snowflake connection.

export type Canon = "original" | "new_blood" | "original_sin";

export type MethodKey =
  | "lethal_injection_m99"
  | "knife"
  | "strangulation"
  | "bone_saw"
  | "firearm"
  | "fire"
  | "explosion"
  | "blunt_force"
  | "drowning"
  | "fall"
  | "mercy"
  | "other";

export type LocationKey =
  | "boat_marina"
  | "open_water"
  | "kill_room"
  | "iron_lake_woods"
  | "residence"
  | "warehouse"
  | "hotel_motel"
  | "police_facility"
  | "vehicle_road"
  | "other";

export type DisposalKey =
  | "open_water"
  | "iron_lake"
  | "fire"
  | "buried"
  | "left_at_scene"
  | "other";

export type VictimType =
  | "serial_killer"
  | "murderer"
  | "predator"
  | "trafficker"
  | "other_violent"
  | "unknown";

export type Kill = {
  id: string;
  canon: Canon;
  season: number;
  episode: number;
  episodeTitle: string;
  victim: string;
  victimType: VictimType;
  method: MethodKey;
  location: LocationKey;
  disposal: DisposalKey;
  priorCrimes: string;
  codeCompliant: boolean;
  arc: string;
  wiki: string;
};

export const kills: Kill[] = [
  // ─── Original — Season 1: Ice Truck Killer arc ───────────────────
  { id: "k001", canon: "original", season: 1, episode: 1,  episodeTitle: "Dexter",                      victim: "Mike Donovan",     victimType: "predator",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Pedophile choir director; killed three boys.",                                                       codeCompliant: true,  arc: "Pilot kill",                                       wiki: "https://dexter.fandom.com/wiki/Mike_Donovan" },
  { id: "k002", canon: "original", season: 1, episode: 2,  episodeTitle: "Crocodile",                   victim: "Jamie Jaworski",   victimType: "predator",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Rape and murder; produced violent rape videos.",                                                     codeCompliant: true,  arc: "Ice Truck Killer arc",                             wiki: "https://dexter.fandom.com/wiki/Jamie_Jaworski" },
  { id: "k003", canon: "original", season: 1, episode: 3,  episodeTitle: "Popping Cherry",              victim: "Matt Chambers",    victimType: "murderer",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Serial drunk driver; killed four people across states under multiple aliases.",                       codeCompliant: true,  arc: "Ice Truck Killer arc",                             wiki: "https://dexter.fandom.com/wiki/Matt_Chambers" },
  { id: "k004", canon: "original", season: 1, episode: 4,  episodeTitle: "Let's Give the Boy a Hand",   victim: "Jorge Castillo",   victimType: "trafficker",    method: "knife",        location: "warehouse",      disposal: "open_water",     priorCrimes: "Human trafficker; murdered Cuban refugees for profit.",                                              codeCompliant: true,  arc: "Ice Truck Killer arc",                             wiki: "https://dexter.fandom.com/wiki/Jorge_Castillo" },
  { id: "k005", canon: "original", season: 1, episode: 4,  episodeTitle: "Let's Give the Boy a Hand",   victim: "Valerie Castillo", victimType: "trafficker",    method: "knife",        location: "warehouse",      disposal: "open_water",     priorCrimes: "Human trafficker; accomplice in refugee murders.",                                                   codeCompliant: true,  arc: "Ice Truck Killer arc",                             wiki: "https://dexter.fandom.com/wiki/Valerie_Castillo" },
  { id: "k006", canon: "original", season: 1, episode: 5,  episodeTitle: "Love American Style",         victim: "Jeremy Downs",     victimType: "serial_killer", method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Serial killer; killed multiple boys including his original attacker.",                               codeCompliant: true,  arc: "Ice Truck Killer arc",                             wiki: "https://dexter.fandom.com/wiki/Jeremy_Downs" },
  { id: "k007", canon: "original", season: 1, episode: 12, episodeTitle: "Born Free",                   victim: "Brian Moser",      victimType: "serial_killer", method: "knife",        location: "kill_room",      disposal: "left_at_scene",  priorCrimes: "Ice Truck Killer; serial killer; Dexter's biological brother.",                                       codeCompliant: false, arc: "Ice Truck Killer arc (finale)",                    wiki: "https://dexter.fandom.com/wiki/Brian_Moser" },

  // ─── Original — Season 2: Bay Harbor Butcher arc ─────────────────
  { id: "k008", canon: "original", season: 2, episode: 1,  episodeTitle: "It's Alive!",                 victim: "Little Chino",     victimType: "murderer",      method: "knife",        location: "warehouse",      disposal: "open_water",     priorCrimes: "Gang enforcer; multiple murders for the 29th Street Kings.",                                          codeCompliant: true,  arc: "Bay Harbor Butcher arc",                           wiki: "https://dexter.fandom.com/wiki/Little_Chino" },
  { id: "k009", canon: "original", season: 2, episode: 3,  episodeTitle: "An Inconvenient Lie",         victim: "Roger Hicks",      victimType: "serial_killer", method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Serial killer; murdered three brides on their honeymoons.",                                           codeCompliant: true,  arc: "Bay Harbor Butcher arc",                           wiki: "https://dexter.fandom.com/wiki/Roger_Hicks" },
  { id: "k010", canon: "original", season: 2, episode: 5,  episodeTitle: "The Dark Defender",           victim: "Jimenez",          victimType: "murderer",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Cuban torturer; murdered Camilla's husband and others during the Castro regime.",                     codeCompliant: true,  arc: "Bay Harbor Butcher arc",                           wiki: "https://dexter.fandom.com/wiki/Jimenez" },
  { id: "k011", canon: "original", season: 2, episode: 12, episodeTitle: "The British Invasion",        victim: "Lila West",        victimType: "murderer",      method: "knife",        location: "residence",      disposal: "left_at_scene",  priorCrimes: "Arsonist; murdered Sergeant Doakes; kidnapped Astor and Cody.",                                       codeCompliant: true,  arc: "Bay Harbor Butcher arc (finale)",                  wiki: "https://dexter.fandom.com/wiki/Lila_West" },

  // ─── Original — Season 3: Miguel Prado arc ───────────────────────
  { id: "k012", canon: "original", season: 3, episode: 1,  episodeTitle: "Our Father",                  victim: "Oscar Prado",      victimType: "other_violent", method: "knife",        location: "residence",      disposal: "left_at_scene",  priorCrimes: "Drug dealer; pulled knife on Dexter during a stakeout. Accidental, self-defense.",                    codeCompliant: false, arc: "Miguel Prado arc; uninvestigated target",          wiki: "https://dexter.fandom.com/wiki/Oscar_Prado" },
  { id: "k013", canon: "original", season: 3, episode: 2,  episodeTitle: "Finding Freebo",              victim: "Freebo",           victimType: "murderer",      method: "knife",        location: "residence",      disposal: "open_water",     priorCrimes: "Drug dealer; murdered two college girls and walked.",                                                 codeCompliant: true,  arc: "Miguel Prado arc",                                 wiki: "https://dexter.fandom.com/wiki/Freebo" },
  { id: "k014", canon: "original", season: 3, episode: 4,  episodeTitle: "All in the Family",           victim: "Ethan Turner",     victimType: "serial_killer", method: "knife",        location: "hotel_motel",    disposal: "open_water",     priorCrimes: "Black widower; murdered three wives for inheritance.",                                                codeCompliant: true,  arc: "Miguel Prado arc",                                 wiki: "https://dexter.fandom.com/wiki/Ethan_Turner" },
  { id: "k015", canon: "original", season: 3, episode: 5,  episodeTitle: "Turning Biminese",            victim: "Clemson Galt",     victimType: "murderer",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Aryan Brotherhood enforcer; multiple murders.",                                                       codeCompliant: true,  arc: "Miguel Prado arc",                                 wiki: "https://dexter.fandom.com/wiki/Clemson_Galt" },
  { id: "k016", canon: "original", season: 3, episode: 7,  episodeTitle: "Easy as Pie",                 victim: "Nathan Marten",    victimType: "predator",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Pedophile photographer; targeted Astor in a park.",                                                   codeCompliant: true,  arc: "Miguel Prado arc",                                 wiki: "https://dexter.fandom.com/wiki/Nathan_Marten" },
  { id: "k017", canon: "original", season: 3, episode: 9,  episodeTitle: "About Last Night",            victim: "Billy Fleeter",    victimType: "murderer",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Bookie and hitman; murdered debtors who couldn't pay.",                                               codeCompliant: true,  arc: "Miguel Prado arc",                                 wiki: "https://dexter.fandom.com/wiki/Billy_Fleeter" },
  { id: "k018", canon: "original", season: 3, episode: 11, episodeTitle: "I Had a Dream",               victim: "Miguel Prado",     victimType: "murderer",      method: "strangulation", location: "hotel_motel",   disposal: "open_water",     priorCrimes: "Corrupt ADA; murdered Ellen Wolf; ordered hits.",                                                     codeCompliant: true,  arc: "Miguel Prado arc",                                 wiki: "https://dexter.fandom.com/wiki/Miguel_Prado" },
  { id: "k019", canon: "original", season: 3, episode: 12, episodeTitle: "Do You Take Dexter Morgan?",  victim: "George King",      victimType: "murderer",      method: "knife",        location: "vehicle_road",   disposal: "left_at_scene",  priorCrimes: "The Skinner; former Nicaraguan secret police torturer; multiple murders.",                            codeCompliant: true,  arc: "Miguel Prado arc (Skinner finale)",                wiki: "https://dexter.fandom.com/wiki/George_King" },

  // ─── Original — Season 4: Trinity arc ────────────────────────────
  { id: "k020", canon: "original", season: 4, episode: 1,  episodeTitle: "Living the Dream",            victim: "Benny Gomez",      victimType: "murderer",      method: "strangulation", location: "warehouse",     disposal: "open_water",     priorCrimes: "Retired boxer; beat two opponents to death in the ring.",                                             codeCompliant: true,  arc: "Trinity arc",                                      wiki: "https://dexter.fandom.com/wiki/Benny_Gomez" },
  { id: "k021", canon: "original", season: 4, episode: 3,  episodeTitle: "Blinded by the Light",        victim: "Zoey Kruger",      victimType: "murderer",      method: "knife",        location: "residence",      disposal: "open_water",     priorCrimes: "Corrupt cop; murdered her own husband and child.",                                                    codeCompliant: true,  arc: "Trinity arc",                                      wiki: "https://dexter.fandom.com/wiki/Zoey_Kruger" },
  { id: "k022", canon: "original", season: 4, episode: 5,  episodeTitle: "Dirty Harry",                 victim: "Jonathan Farrow",  victimType: "unknown",       method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Celebrity photographer; framed as serial rapist. Actually innocent.",                                 codeCompliant: false, arc: "Trinity arc; innocent victim — major code violation", wiki: "https://dexter.fandom.com/wiki/Jonathan_Farrow" },
  { id: "k023", canon: "original", season: 4, episode: 8,  episodeTitle: "Road Kill",                   victim: "Stan Beaudry",     victimType: "serial_killer", method: "knife",        location: "vehicle_road",   disposal: "open_water",     priorCrimes: "Trucker; murdered prostitutes along his route; staged as a Trinity decoy after.",                     codeCompliant: true,  arc: "Trinity arc",                                      wiki: "https://dexter.fandom.com/wiki/Stan_Beaudry" },
  { id: "k024", canon: "original", season: 4, episode: 12, episodeTitle: "The Getaway",                 victim: "Arthur Mitchell",  victimType: "serial_killer", method: "blunt_force",  location: "kill_room",      disposal: "open_water",     priorCrimes: "Trinity Killer; over thirty murders across multiple states over thirty years.",                       codeCompliant: true,  arc: "Trinity arc (finale)",                             wiki: "https://dexter.fandom.com/wiki/Arthur_Mitchell" },

  // ─── Original — Season 5: Barrel Girls arc ───────────────────────
  { id: "k025", canon: "original", season: 5, episode: 1,  episodeTitle: "My Bad",                      victim: "Boyd Fowler",      victimType: "serial_killer", method: "knife",        location: "kill_room",      disposal: "buried",          priorCrimes: "Septic worker; murdered four women — the Barrel Girls.",                                              codeCompliant: true,  arc: "Barrel Girls arc",                                 wiki: "https://dexter.fandom.com/wiki/Boyd_Fowler" },
  { id: "k026", canon: "original", season: 5, episode: 4,  episodeTitle: "Beauty and the Beast",        victim: "Lance Robinson",   victimType: "predator",      method: "knife",        location: "residence",      disposal: "open_water",     priorCrimes: "Predator who targeted women through dating sites with violent intent.",                               codeCompliant: true,  arc: "Barrel Girls arc",                                 wiki: "https://dexter.fandom.com/wiki/Lance_Robinson" },
  { id: "k027", canon: "original", season: 5, episode: 9,  episodeTitle: "Teenage Wasteland",           victim: "Cole Harmon",      victimType: "predator",      method: "strangulation", location: "kill_room",     disposal: "open_water",     priorCrimes: "Bodyguard and Barrel Girls accomplice; participated in rape and torture.",                            codeCompliant: true,  arc: "Barrel Girls arc",                                 wiki: "https://dexter.fandom.com/wiki/Cole_Harmon" },
  { id: "k028", canon: "original", season: 5, episode: 10, episodeTitle: "In the Beginning",            victim: "Dan Mendell",      victimType: "predator",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Barrel Girls rapist; participated in five known rapes.",                                              codeCompliant: true,  arc: "Barrel Girls arc",                                 wiki: "https://dexter.fandom.com/wiki/Dan_Mendell" },
  { id: "k029", canon: "original", season: 5, episode: 11, episodeTitle: "Hop a Freighter",             victim: "Alex Tilden",      victimType: "predator",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Barrel Girls rapist; participated in multiple torture-rapes.",                                        codeCompliant: true,  arc: "Barrel Girls arc",                                 wiki: "https://dexter.fandom.com/wiki/Alex_Tilden" },
  { id: "k030", canon: "original", season: 5, episode: 12, episodeTitle: "The Big One",                 victim: "Jordan Chase",     victimType: "serial_killer", method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Self-help guru; mastermind of the Barrel Girls rape-murders.",                                        codeCompliant: true,  arc: "Barrel Girls arc (finale)",                        wiki: "https://dexter.fandom.com/wiki/Jordan_Chase" },

  // ─── Original — Season 6: Doomsday arc ───────────────────────────
  { id: "k031", canon: "original", season: 6, episode: 1,  episodeTitle: "Those Kinds of Things",       victim: "Julio Benes",      victimType: "murderer",      method: "knife",        location: "boat_marina",    disposal: "open_water",     priorCrimes: "Gunrunner; murdered competitors and witnesses.",                                                      codeCompliant: true,  arc: "Doomsday arc",                                     wiki: "https://dexter.fandom.com/wiki/Julio_Benes" },
  { id: "k032", canon: "original", season: 6, episode: 2,  episodeTitle: "Once Upon a Time...",         victim: "Walter Kenney",    victimType: "serial_killer", method: "knife",        location: "residence",      disposal: "open_water",     priorCrimes: "The Tooth Fairy; retired serial killer; murdered nine women decades earlier.",                        codeCompliant: true,  arc: "Doomsday arc",                                     wiki: "https://dexter.fandom.com/wiki/Walter_Kenney" },
  { id: "k033", canon: "original", season: 6, episode: 12, episodeTitle: "This is the Way the World Ends", victim: "Travis Marshall", victimType: "serial_killer", method: "knife",      location: "other",          disposal: "open_water",     priorCrimes: "Doomsday Killer; tableau murderer; killed multiple including Brother Sam.",                          codeCompliant: true,  arc: "Doomsday arc (finale)",                            wiki: "https://dexter.fandom.com/wiki/Travis_Marshall" },

  // ─── Original — Season 7: Hannah / Sirko ─────────────────────────
  { id: "k034", canon: "original", season: 7, episode: 1,  episodeTitle: "Are You...?",                 victim: "Viktor Baskov",    victimType: "murderer",      method: "strangulation", location: "other",         disposal: "fire",            priorCrimes: "Koshka Brotherhood enforcer; murdered Mike Anderson and others.",                                     codeCompliant: true,  arc: "Hannah / Sirko arc",                               wiki: "https://dexter.fandom.com/wiki/Viktor_Baskov" },
  { id: "k035", canon: "original", season: 7, episode: 6,  episodeTitle: "Do the Wrong Thing",          victim: "Ray Speltzer",     victimType: "serial_killer", method: "knife",        location: "residence",      disposal: "open_water",     priorCrimes: "Sledgehammer killer; murdered at least three women in his maze.",                                     codeCompliant: true,  arc: "Hannah / Sirko arc",                               wiki: "https://dexter.fandom.com/wiki/Ray_Speltzer" },
  { id: "k036", canon: "original", season: 7, episode: 12, episodeTitle: "Surprise Motherfucker",       victim: "Hector Estrada",   victimType: "murderer",      method: "knife",        location: "warehouse",      disposal: "open_water",     priorCrimes: "Drug lord; ordered the murder of Dexter's mother Laura Moser.",                                       codeCompliant: true,  arc: "Hannah arc",                                       wiki: "https://dexter.fandom.com/wiki/Hector_Estrada" },

  // ─── Original — Season 8: Brain Surgeon ──────────────────────────
  { id: "k037", canon: "original", season: 8, episode: 2,  episodeTitle: "Every Silver Lining...",      victim: "Andrew Briggs",    victimType: "murderer",      method: "knife",        location: "kill_room",      disposal: "open_water",     priorCrimes: "Fence and killer; murdered competitors during heists.",                                               codeCompliant: true,  arc: "Brain Surgeon arc",                                wiki: "https://dexter.fandom.com/wiki/Andrew_Briggs" },
  { id: "k038", canon: "original", season: 8, episode: 10, episodeTitle: "Goodbye Miami",               victim: "A.J. Yates",       victimType: "serial_killer", method: "knife",        location: "residence",      disposal: "open_water",     priorCrimes: "Serial killer; murdered six women; kept toenails as trophies.",                                        codeCompliant: true,  arc: "Brain Surgeon arc",                                wiki: "https://dexter.fandom.com/wiki/Albert_Jose_Yates" },
  { id: "k039", canon: "original", season: 8, episode: 12, episodeTitle: "Remember the Monsters?",      victim: "Oliver Saxon",     victimType: "serial_killer", method: "strangulation", location: "police_facility", disposal: "left_at_scene", priorCrimes: "Brain Surgeon; serial killer; son of Evelyn Vogel; killed Vogel and shot Debra.",                  codeCompliant: false, arc: "Brain Surgeon arc (finale); code violated - improvised in police facility", wiki: "https://dexter.fandom.com/wiki/Oliver_Saxon" },
  { id: "k040", canon: "original", season: 8, episode: 12, episodeTitle: "Remember the Monsters?",      victim: "Debra Morgan",     victimType: "unknown",       method: "mercy",        location: "other",          disposal: "open_water",     priorCrimes: "Dexter's sister; permanent vegetative state from gunshot. Not a target — act of mercy.",              codeCompliant: false, arc: "Brain Surgeon arc (finale); not a code kill",      wiki: "https://dexter.fandom.com/wiki/Debra_Morgan" },

  // ─── New Blood ───────────────────────────────────────────────────
  { id: "k041", canon: "new_blood", season: 1, episode: 1,  episodeTitle: "Cold Snap",                  victim: "Matt Caldwell",    victimType: "murderer",      method: "firearm",      location: "iron_lake_woods", disposal: "iron_lake",      priorCrimes: "Privileged hunter; killed five in a 2018 boating accident he caused; got off.",                       codeCompliant: true,  arc: "New Blood",                                        wiki: "https://dexter.fandom.com/wiki/Matt_Caldwell" },
  { id: "k042", canon: "new_blood", season: 1, episode: 5,  episodeTitle: "Runaway",                    victim: "Jasper Hodge",     victimType: "trafficker",    method: "lethal_injection_m99", location: "other",  disposal: "left_at_scene",  priorCrimes: "Drug dealer; sold the fentanyl that killed Iris years earlier.",                                      codeCompliant: false, arc: "New Blood; ambiguous code compliance",             wiki: "https://dexter.fandom.com/wiki/Jasper_Hodge" },
  { id: "k043", canon: "new_blood", season: 1, episode: 10, episodeTitle: "Sins of the Father",         victim: "Kurt Caldwell",    victimType: "serial_killer", method: "firearm",      location: "kill_room",      disposal: "iron_lake",      priorCrimes: "Iron Lake serial killer; murdered at least eight runaway women over decades.",                        codeCompliant: true,  arc: "New Blood (finale)",                               wiki: "https://dexter.fandom.com/wiki/Kurt_Caldwell" },

  // ─── Original Sin (prequel) ──────────────────────────────────────
  { id: "k044", canon: "original_sin", season: 1, episode: 1,  episodeTitle: "Pilot",                    victim: "Aaron Spencer",    victimType: "predator",      method: "strangulation", location: "residence",     disposal: "open_water",     priorCrimes: "Pedophile teacher; abused multiple students at Miami Senior High.",                                   codeCompliant: true,  arc: "Origin kill under Harry's tutelage",               wiki: "https://dexter.fandom.com/wiki/Aaron_Spencer" },
  { id: "k045", canon: "original_sin", season: 1, episode: 3,  episodeTitle: "Then We Fight Like a Family", victim: "Levi Reed",    victimType: "murderer",      method: "knife",        location: "other",          disposal: "open_water",     priorCrimes: "Teenage sociopath; murdered two classmates and his own father.",                                      codeCompliant: true,  arc: "Original Sin; first solo planning",                wiki: "https://dexter.fandom.com/wiki/Levi_Reed" },
  { id: "k046", canon: "original_sin", season: 1, episode: 5,  episodeTitle: "Blood Drive",              victim: "Nurse Mary",       victimType: "serial_killer", method: "lethal_injection_m99", location: "other",  disposal: "open_water",     priorCrimes: "Angel of death nurse; murdered at least twelve elderly patients.",                                     codeCompliant: true,  arc: "Original Sin; first use of M99",                   wiki: "https://dexter.fandom.com/wiki/Nurse_Mary" },
  { id: "k047", canon: "original_sin", season: 1, episode: 7,  episodeTitle: "Pretty in Pink",           victim: "Tony Ferrer",      victimType: "trafficker",    method: "knife",        location: "vehicle_road",   disposal: "open_water",     priorCrimes: "Drug dealer; murdered three witnesses and a teenage girl.",                                            codeCompliant: true,  arc: "Original Sin",                                     wiki: "https://dexter.fandom.com/wiki/Tony_Ferrer" },
  { id: "k048", canon: "original_sin", season: 1, episode: 10, episodeTitle: "Just Dexter",              victim: "Tanya Martin",     victimType: "serial_killer", method: "knife",        location: "warehouse",      disposal: "open_water",     priorCrimes: "Tamiami Slasher; murdered five along the Tamiami Trail.",                                              codeCompliant: true,  arc: "Original Sin (finale)",                            wiki: "https://dexter.fandom.com/wiki/Tanya_Martin" },
];

export const canonLabels: Record<Canon, string> = {
  original:     "Original (S1–S8)",
  new_blood:    "New Blood",
  original_sin: "Original Sin",
};

export const methodLabels: Record<MethodKey, string> = {
  lethal_injection_m99: "Lethal injection (M99)",
  knife:                "Knife / blade",
  strangulation:        "Strangulation",
  bone_saw:             "Bone saw",
  firearm:              "Firearm",
  fire:                 "Fire",
  explosion:            "Explosion",
  blunt_force:          "Blunt force",
  drowning:             "Drowning",
  fall:                 "Fall",
  mercy:                "Mercy (non-target)",
  other:                "Other",
};

export const locationLabels: Record<LocationKey, string> = {
  boat_marina:     "Boat / marina",
  open_water:      "Open water",
  kill_room:       "Kill room (sealed)",
  iron_lake_woods: "Iron Lake woods",
  residence:       "Residence",
  warehouse:       "Warehouse",
  hotel_motel:     "Hotel / motel",
  police_facility: "Police facility",
  vehicle_road:    "Vehicle / road",
  other:           "Other",
};

export const disposalLabels: Record<DisposalKey, string> = {
  open_water:    "Open water",
  iron_lake:     "Iron Lake",
  fire:          "Fire / incinerated",
  buried:        "Buried",
  left_at_scene: "Left at scene",
  other:         "Other",
};

export const victimTypeLabels: Record<VictimType, string> = {
  serial_killer: "Serial killer",
  murderer:      "Murderer",
  predator:      "Predator",
  trafficker:    "Trafficker",
  other_violent: "Other violent",
  unknown:       "Unknown",
};
