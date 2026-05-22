import type { Canon } from "./kills";

export type Antagonist = {
  qid: string;
  name: string;
  alias: string;
  canon: Canon;
  season: number;
  portrayedBy: string;
  description: string;
};

export const antagonists: Antagonist[] = [
  { qid: "Q1063232",   name: "Brian Moser",     alias: "Ice Truck Killer",      canon: "original",     season: 1, portrayedBy: "Christian Camargo", description: "Serial killer who freezes prostitutes and dismembers them. Dexter's biological brother." },
  { qid: "Q5260054",   name: "James Doakes",    alias: "Bay Harbor Butcher (framed)", canon: "original", season: 2, portrayedBy: "Erik King",      description: "Miami Metro sergeant who suspects Dexter; framed posthumously as the Bay Harbor Butcher." },
  { qid: "Q1936213",   name: "Miguel Prado",    alias: "The Friend",            canon: "original",     season: 3, portrayedBy: "Jimmy Smits",       description: "Miami ADA who befriends Dexter then turns murderous after being mentored." },
  { qid: "Q1928568",   name: "Arthur Mitchell", alias: "Trinity Killer",        canon: "original",     season: 4, portrayedBy: "John Lithgow",      description: "Family-man serial killer who murdered in three-step rituals across thirty years." },
  { qid: "Q5860421",   name: "Jordan Chase",    alias: "The Mentor",            canon: "original",     season: 5, portrayedBy: "Jonny Lee Miller",  description: "Self-help guru and ringleader of the Barrel Girls rape-murders." },
  { qid: "Q5965021",   name: "Travis Marshall", alias: "Doomsday Killer",       canon: "original",     season: 6, portrayedBy: "Colin Hanks",       description: "Religious fanatic who staged tableau murders based on Revelation." },
  { qid: "Q7777121",   name: "Isaak Sirko",     alias: "The Ukrainian",         canon: "original",     season: 7, portrayedBy: "Ray Stevenson",     description: "Koshka Brotherhood lieutenant hunting Dexter for Viktor's death." },
  { qid: "Q7777122",   name: "Hannah McKay",    alias: "The Poisoner",          canon: "original",     season: 7, portrayedBy: "Yvonne Strahovski", description: "Florist and poisoner who falls in love with Dexter; the only major antagonist who escapes the show alive." },
  { qid: "Q7777123",   name: "Oliver Saxon",    alias: "Brain Surgeon",         canon: "original",     season: 8, portrayedBy: "Darri Ingolfsson",  description: "Serial killer who removes pieces of victims' brains; son of Evelyn Vogel." },
  { qid: "Q108991213", name: "Kurt Caldwell",   alias: "Iron Lake Trapper",     canon: "new_blood",    season: 1, portrayedBy: "Clancy Brown",      description: "Town benefactor in Iron Lake who lures and murders runaway women in his basement." },
  { qid: "Q124800001", name: "Aaron Spencer",   alias: "The Teacher",           canon: "original_sin", season: 1, portrayedBy: "Patrick Gibson",    description: "Predator high school teacher; Dexter's first kill under Harry's guidance." },
];
