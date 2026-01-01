'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Clock, Scroll, Filter, RotateCcw, MapPin, Globe } from 'lucide-react'
import Link from 'next/link'
import { getPosts, getProfile, getEras } from '@/lib/data'
import { cn } from '@/lib/utils'

interface HistoricalEvent {
  year: number
  event: string
  detail: string
  category: string
  era: string
  location?: string
}

// Comprehensive historical events across all eras
const historicalEvents: Record<string, HistoricalEvent[]> = {
  // === AMERICAN REVOLUTION (1775-1783) ===
  '01-01': [
    { year: 1776, event: 'Continental Army flag raised', detail: 'Washington raises the Grand Union Flag at Prospect Hill, Cambridge.', category: 'military', era: 'american-revolution', location: 'Cambridge, Massachusetts' },
    { year: 49, event: 'Julius Caesar crosses the Rubicon', detail: '"Alea iacta est" - The die is cast. Civil war begins.', category: 'military', era: 'ancient-rome', location: 'Rubicon River, Italy' },
    { year: 1863, event: 'Emancipation Proclamation takes effect', detail: 'All slaves in rebel states declared free. The war becomes a war for freedom.', category: 'politics', era: 'american-civil-war', location: 'Washington, D.C.' }
  ],
  '01-10': [
    { year: 1776, event: 'Common Sense published', detail: 'Thomas Paine\'s pamphlet argues for independence. It will sell 500,000 copies.', category: 'culture', era: 'american-revolution', location: 'Philadelphia' }
  ],
  '01-27': [
    { year: 1945, event: 'Auschwitz liberated', detail: 'Soviet troops liberate the Auschwitz concentration camp, revealing Nazi atrocities.', category: 'military', era: 'world-war-2', location: 'Poland' }
  ],
  '01-30': [
    { year: 1933, event: 'Hitler becomes Chancellor', detail: 'Adolf Hitler appointed Chancellor of Germany, beginning the Nazi regime.', category: 'politics', era: 'world-war-2', location: 'Berlin' },
    { year: 1948, event: 'Gandhi assassinated', detail: 'Mahatma Gandhi shot by Nathuram Godse in New Delhi.', category: 'other', era: 'civil-rights', location: 'New Delhi, India' }
  ],

  // === FEBRUARY ===
  '02-01': [
    { year: 1960, event: 'Greensboro sit-ins begin', detail: 'Four Black students sit at Woolworth\'s whites-only lunch counter.', category: 'politics', era: 'civil-rights', location: 'Greensboro, North Carolina' }
  ],
  '02-11': [
    { year: 1990, event: 'Nelson Mandela released', detail: 'After 27 years, Nelson Mandela walks free from Victor Verster Prison.', category: 'politics', era: 'civil-rights', location: 'Cape Town, South Africa' }
  ],
  '02-21': [
    { year: 1965, event: 'Malcolm X assassinated', detail: 'Malcolm X shot at the Audubon Ballroom in Manhattan.', category: 'other', era: 'civil-rights', location: 'New York City' }
  ],

  // === MARCH ===
  '03-07': [
    { year: 1965, event: 'Bloody Sunday', detail: 'Alabama state troopers attack civil rights marchers at Edmund Pettus Bridge.', category: 'politics', era: 'civil-rights', location: 'Selma, Alabama' }
  ],
  '03-15': [
    { year: -44, event: 'Assassination of Julius Caesar', detail: 'Caesar stabbed 23 times by senators including Brutus in the Theatre of Pompey.', category: 'politics', era: 'ancient-rome', location: 'Rome' }
  ],
  '03-17': [
    { year: 1776, event: 'British evacuate Boston', detail: 'After 11-month siege, 11,000 British troops and 1,000 Loyalists leave by ship.', category: 'military', era: 'american-revolution', location: 'Boston' }
  ],

  // === APRIL ===
  '04-04': [
    { year: 1968, event: 'Martin Luther King Jr. assassinated', detail: 'MLK shot at the Lorraine Motel in Memphis, Tennessee.', category: 'other', era: 'civil-rights', location: 'Memphis, Tennessee' }
  ],
  '04-06': [
    { year: 1917, event: 'United States enters WWI', detail: 'Congress declares war on Germany, joining the Allied Powers.', category: 'politics', era: 'world-war-1', location: 'Washington, D.C.' }
  ],
  '04-12': [
    { year: 1861, event: 'Fort Sumter attacked', detail: 'Confederate forces fire on Fort Sumter, beginning the American Civil War.', category: 'military', era: 'american-civil-war', location: 'Charleston, South Carolina' },
    { year: 1961, event: 'Yuri Gagarin in space', detail: 'First human in space orbits Earth. "Poyekhali!" (Let\'s go!) The Earth is blue.', category: 'science', era: 'cold-war', location: 'Baikonur, Kazakhstan' }
  ],
  '04-15': [
    { year: 1912, event: 'Titanic sinks', detail: 'RMS Titanic sinks after hitting an iceberg, killing over 1,500 people.', category: 'other', era: 'industrial-revolution', location: 'North Atlantic Ocean' },
    { year: 1452, event: 'Leonardo da Vinci born', detail: 'The Renaissance polymath born in Vinci, Republic of Florence.', category: 'culture', era: 'renaissance', location: 'Vinci, Italy' }
  ],
  '04-19': [
    { year: 1775, event: 'Battles of Lexington & Concord', detail: 'The "shot heard round the world" begins the American Revolution.', category: 'military', era: 'american-revolution', location: 'Massachusetts' }
  ],
  '04-28': [
    { year: 1789, event: 'Mutiny on the Bounty', detail: 'Fletcher Christian leads mutiny against Captain William Bligh.', category: 'military', era: 'industrial-revolution', location: 'Pacific Ocean' }
  ],

  // === MAY ===
  '05-08': [
    { year: 1945, event: 'V-E Day', detail: 'Victory in Europe - Nazi Germany surrenders unconditionally.', category: 'military', era: 'world-war-2', location: 'Berlin' }
  ],
  '05-10': [
    { year: 1940, event: 'Churchill becomes Prime Minister', detail: 'Winston Churchill replaces Neville Chamberlain as PM of the United Kingdom.', category: 'politics', era: 'world-war-2', location: 'London' }
  ],
  '05-17': [
    { year: 1954, event: 'Brown v. Board of Education', detail: 'Supreme Court rules segregation in public schools unconstitutional.', category: 'politics', era: 'civil-rights', location: 'Washington, D.C.' }
  ],

  // === JUNE ===
  '06-04': [
    { year: 1942, event: 'Battle of Midway begins', detail: 'Decisive naval battle that turns the tide in the Pacific.', category: 'military', era: 'world-war-2', location: 'Midway Atoll' }
  ],
  '06-06': [
    { year: 1944, event: 'D-Day', detail: 'Allied forces land on Normandy beaches. Over 156,000 troops deployed.', category: 'military', era: 'world-war-2', location: 'Normandy, France' }
  ],
  '06-12': [
    { year: 1963, event: 'Medgar Evers assassinated', detail: 'Civil rights leader shot in his driveway in Jackson, Mississippi.', category: 'other', era: 'civil-rights', location: 'Jackson, Mississippi' },
    { year: 1987, event: '"Tear down this wall!"', detail: 'Reagan challenges Gorbachev at Brandenburg Gate. Two years later, the Wall falls.', category: 'politics', era: 'cold-war', location: 'Berlin' }
  ],
  '06-17': [
    { year: 1775, event: 'Battle of Bunker Hill', detail: '"Don\'t fire until you see the whites of their eyes." British win but suffer 1,000 casualties.', category: 'military', era: 'american-revolution', location: 'Charlestown, Massachusetts' }
  ],
  '06-28': [
    { year: 1914, event: 'Archduke Franz Ferdinand assassinated', detail: 'Gavrilo Princip assassinates the heir to the Austro-Hungarian throne, triggering WWI.', category: 'politics', era: 'world-war-1', location: 'Sarajevo' }
  ],

  // === JULY ===
  '07-01': [
    { year: 1916, event: 'Battle of the Somme begins', detail: 'British suffer 57,470 casualties on the first day alone.', category: 'military', era: 'world-war-1', location: 'Somme, France' }
  ],
  '07-04': [
    { year: 1776, event: 'Declaration of Independence adopted', detail: 'Continental Congress formally adopts the Declaration. Only Hancock signs today.', category: 'politics', era: 'american-revolution', location: 'Philadelphia' },
    { year: 1826, event: 'Adams and Jefferson die', detail: 'Both Founding Fathers die on the 50th anniversary of the Declaration.', category: 'other', era: 'industrial-revolution', location: 'USA' }
  ],
  '07-14': [
    { year: 1789, event: 'Storming of the Bastille', detail: 'Parisian revolutionaries storm the Bastille fortress-prison, sparking the Revolution.', category: 'military', era: 'french-revolution', location: 'Paris' }
  ],
  '07-20': [
    { year: 1944, event: 'Operation Valkyrie', detail: 'German officers attempt to assassinate Hitler. The plot fails.', category: 'military', era: 'world-war-2', location: 'East Prussia' },
    { year: 1969, event: 'Moon landing', detail: 'Apollo 11 lands on the Moon. "That\'s one small step for man..."', category: 'science', era: 'cold-war', location: 'Sea of Tranquility, Moon' }
  ],

  // === AUGUST ===
  '08-06': [
    { year: 1945, event: 'Atomic bomb dropped on Hiroshima', detail: '"Little Boy" kills approximately 80,000 people instantly.', category: 'military', era: 'world-war-2', location: 'Hiroshima, Japan' }
  ],
  '08-09': [
    { year: 1945, event: 'Atomic bomb dropped on Nagasaki', detail: '"Fat Man" kills approximately 40,000 people. Japan surrenders days later.', category: 'military', era: 'world-war-2', location: 'Nagasaki, Japan' }
  ],
  '08-24': [
    { year: 79, event: 'Vesuvius erupts', detail: 'Mount Vesuvius buries Pompeii and Herculaneum, killing thousands.', category: 'other', era: 'ancient-rome', location: 'Pompeii, Italy' },
    { year: 410, event: 'Sack of Rome', detail: 'Visigoths under Alaric I sack Rome for the first time in 800 years.', category: 'military', era: 'ancient-rome', location: 'Rome' }
  ],
  '08-27': [
    { year: 1776, event: 'Battle of Long Island', detail: 'Largest battle of the Revolutionary War. British outflank Americans.', category: 'military', era: 'american-revolution', location: 'Brooklyn' }
  ],
  '08-28': [
    { year: 1963, event: 'March on Washington', detail: 'MLK delivers "I Have a Dream" speech to 250,000 people.', category: 'politics', era: 'civil-rights', location: 'Washington, D.C.' }
  ],

  // === SEPTEMBER ===
  '09-01': [
    { year: 1939, event: 'Germany invades Poland', detail: 'Nazi Germany attacks Poland, beginning World War II.', category: 'military', era: 'world-war-2', location: 'Poland' }
  ],
  '09-02': [
    { year: 1945, event: 'V-J Day', detail: 'Japan formally surrenders aboard USS Missouri, ending World War II.', category: 'military', era: 'world-war-2', location: 'Tokyo Bay, Japan' },
    { year: -31, event: 'Battle of Actium', detail: 'Octavian defeats Antony and Cleopatra. Rome gains control of Egypt.', category: 'military', era: 'ancient-egypt', location: 'Actium, Greece' }
  ],
  '09-11': [
    { year: 1776, event: 'Staten Island Peace Conference', detail: 'Adams, Franklin, Rutledge meet Howe. Talks fail.', category: 'diplomacy', era: 'american-revolution', location: 'Staten Island' }
  ],
  '09-22': [
    { year: 1776, event: 'Nathan Hale executed', detail: '"I only regret that I have but one life to lose for my country."', category: 'military', era: 'american-revolution', location: 'New York' },
    { year: -480, event: 'Battle of Salamis', detail: 'Greek navy defeats Persian fleet. Turning point of the Persian Wars.', category: 'military', era: 'ancient-greece', location: 'Salamis, Greece' }
  ],

  // === OCTOBER ===
  '10-12': [
    { year: 1492, event: 'Columbus reaches the Americas', detail: 'Christopher Columbus lands in the Bahamas, believing he reached Asia.', category: 'other', era: 'renaissance', location: 'San Salvador, Bahamas' }
  ],
  '10-14': [
    { year: 1066, event: 'Battle of Hastings', detail: 'William the Conqueror defeats King Harold II, changing English history.', category: 'military', era: 'viking-age', location: 'Hastings, England' }
  ],
  '10-19': [
    { year: 1781, event: 'British surrender at Yorktown', detail: 'Cornwallis surrenders 8,000 troops. American Revolution effectively won.', category: 'military', era: 'american-revolution', location: 'Yorktown, Virginia' }
  ],
  '10-21': [
    { year: 1805, event: 'Battle of Trafalgar', detail: 'Nelson defeats Franco-Spanish fleet. "England expects every man to do his duty."', category: 'military', era: 'french-revolution', location: 'Cape Trafalgar, Spain' }
  ],
  '10-31': [
    { year: 1517, event: '95 Theses posted', detail: 'Martin Luther posts his 95 Theses, beginning the Protestant Reformation.', category: 'culture', era: 'renaissance', location: 'Wittenberg, Germany' }
  ],

  // === NOVEMBER ===
  '11-09': [
    { year: 1989, event: 'Berlin Wall falls', detail: 'East Germany opens the border, beginning German reunification.', category: 'politics', era: 'cold-war', location: 'Berlin' },
    { year: 1799, event: 'Napoleon\'s coup', detail: 'Napoleon Bonaparte seizes power in the coup of 18 Brumaire.', category: 'politics', era: 'french-revolution', location: 'Paris' }
  ],
  '11-11': [
    { year: 1918, event: 'Armistice Day', detail: 'World War I ends at 11am. "The war to end all wars" concludes.', category: 'military', era: 'world-war-1', location: 'Compiègne, France' }
  ],
  '11-22': [
    { year: 1963, event: 'JFK assassinated', detail: 'President John F. Kennedy shot in Dallas, Texas.', category: 'politics', era: 'civil-rights', location: 'Dallas, Texas' }
  ],

  // === DECEMBER ===
  '12-01': [
    { year: 1955, event: 'Rosa Parks refuses to give up seat', detail: 'Rosa Parks arrested in Montgomery, sparking the bus boycott.', category: 'politics', era: 'civil-rights', location: 'Montgomery, Alabama' }
  ],
  '12-07': [
    { year: 1941, event: 'Attack on Pearl Harbor', detail: 'Japan attacks Pearl Harbor. 2,403 Americans killed. "A date which will live in infamy."', category: 'military', era: 'world-war-2', location: 'Pearl Harbor, Hawaii' }
  ],
  '12-16': [
    { year: 1773, event: 'Boston Tea Party', detail: 'Sons of Liberty dump 342 chests of tea into Boston Harbor.', category: 'politics', era: 'american-revolution', location: 'Boston' },
    { year: 1944, event: 'Battle of the Bulge begins', detail: 'Germany\'s last major offensive on the Western Front.', category: 'military', era: 'world-war-2', location: 'Ardennes, Belgium' }
  ],
  '12-25': [
    { year: 1776, event: 'Washington crosses Delaware', detail: 'Christmas night crossing with 2,400 troops for surprise attack on Trenton.', category: 'military', era: 'american-revolution', location: 'Delaware River' },
    { year: 800, event: 'Charlemagne crowned Emperor', detail: 'Pope Leo III crowns Charlemagne as Holy Roman Emperor.', category: 'politics', era: 'viking-age', location: 'Rome' }
  ],
  '12-26': [
    { year: 1776, event: 'Battle of Trenton', detail: 'Washington captures 900 Hessians. Only 4 Americans wounded. Turning point.', category: 'military', era: 'american-revolution', location: 'Trenton, New Jersey' },
    { year: 1991, event: 'Soviet Union dissolves', detail: 'Soviet flag lowered over Kremlin for the last time. Cold War ends.', category: 'politics', era: 'cold-war', location: 'Moscow' }
  ],

  // === ANCIENT ROME ADDITIONS ===
  '02-15': [
    { year: -44, event: 'Lupercalia festival', detail: 'Ancient Roman festival of fertility. Mark Antony offers Caesar a crown.', category: 'culture', era: 'ancient-rome', location: 'Rome' }
  ],
  '08-19': [
    { year: 14, event: 'Augustus dies', detail: 'First Roman Emperor dies at 75. "Have I played the part well?"', category: 'politics', era: 'ancient-rome', location: 'Nola, Italy' }
  ],

  // === ANCIENT GREECE ===
  '09-12': [
    { year: -490, event: 'Battle of Marathon', detail: 'Athenians defeat Persian invasion force. Pheidippides runs 26 miles to Athens.', category: 'military', era: 'ancient-greece', location: 'Marathon, Greece' }
  ],
  '08-11': [
    { year: -480, event: 'Battle of Thermopylae begins', detail: '300 Spartans under Leonidas face the Persian army at the Hot Gates.', category: 'military', era: 'ancient-greece', location: 'Thermopylae, Greece' }
  ],

  // === VIKING AGE ===
  '06-08': [
    { year: 793, event: 'Lindisfarne raid', detail: 'Vikings raid the monastery at Lindisfarne, beginning the Viking Age.', category: 'military', era: 'viking-age', location: 'Lindisfarne, England' }
  ],
  '09-25': [
    { year: 1066, event: 'Battle of Stamford Bridge', detail: 'Harold Godwinson defeats Harald Hardrada, ending Viking invasion.', category: 'military', era: 'viking-age', location: 'Stamford Bridge, England' }
  ],

  // === INDUSTRIAL REVOLUTION ===
  '09-15': [
    { year: 1830, event: 'Liverpool-Manchester Railway opens', detail: 'First inter-city railway opens. Politician killed by train at opening.', category: 'science', era: 'industrial-revolution', location: 'Liverpool, England' }
  ],

  // === FRENCH REVOLUTION ===
  '01-21': [
    { year: 1793, event: 'Louis XVI executed', detail: 'King of France guillotined in Paris. "I die innocent of all the crimes laid to my charge."', category: 'politics', era: 'french-revolution', location: 'Paris' }
  ],
  '07-27': [
    { year: 1794, event: 'Fall of Robespierre', detail: 'Robespierre arrested during the Thermidorian Reaction. Guillotined the next day.', category: 'politics', era: 'french-revolution', location: 'Paris' }
  ],
  '10-16': [
    { year: 1793, event: 'Marie Antoinette executed', detail: 'Former Queen of France guillotined in Paris.', category: 'politics', era: 'french-revolution', location: 'Paris' },
    { year: 1962, event: 'Cuban Missile Crisis begins', detail: 'Kennedy informed of Soviet missiles in Cuba. World comes closest to nuclear war.', category: 'military', era: 'cold-war', location: 'Washington, D.C.' }
  ],
  '12-02': [
    { year: 1804, event: 'Napoleon crowned Emperor', detail: 'Napoleon crowns himself Emperor at Notre-Dame Cathedral.', category: 'politics', era: 'french-revolution', location: 'Paris' }
  ],

  // === RENAISSANCE ===
  '03-06': [
    { year: 1475, event: 'Michelangelo born', detail: 'Renaissance sculptor and painter born in Caprese, Tuscany.', category: 'culture', era: 'renaissance', location: 'Caprese, Italy' }
  ],
  '04-23': [
    { year: 1564, event: 'Shakespeare born', detail: 'William Shakespeare born in Stratford-upon-Avon.', category: 'culture', era: 'renaissance', location: 'Stratford-upon-Avon, England' },
    { year: 1616, event: 'Shakespeare dies', detail: 'William Shakespeare dies on his 52nd birthday.', category: 'culture', era: 'renaissance', location: 'Stratford-upon-Avon, England' }
  ],
  '05-02': [
    { year: 1519, event: 'Leonardo da Vinci dies', detail: 'Renaissance master dies at Amboise, France, aged 67.', category: 'culture', era: 'renaissance', location: 'Amboise, France' }
  ],

  // === MEDIEVAL CRUSADES (1095-1291) ===
  '11-27': [
    { year: 1095, event: 'Council of Clermont', detail: 'Pope Urban II calls for the First Crusade. "Deus vult!" - God wills it.', category: 'politics', era: 'medieval-crusades', location: 'Clermont, France' }
  ],
  '07-15': [
    { year: 1099, event: 'Fall of Jerusalem', detail: 'Crusaders capture Jerusalem after a five-week siege. Bloody massacre follows.', category: 'military', era: 'medieval-crusades', location: 'Jerusalem' }
  ],
  '07-03': [
    { year: 1187, event: 'Battle of Hattin', detail: 'Saladin destroys the Crusader army. King Guy captured. True Cross lost.', category: 'military', era: 'medieval-crusades', location: 'Horns of Hattin, Palestine' },
    { year: 1863, event: 'Pickett\'s Charge', detail: '12,500 Confederates charge across open ground. "It is all my fault," Lee says.', category: 'military', era: 'american-civil-war', location: 'Gettysburg, Pennsylvania' }
  ],
  '10-02': [
    { year: 1187, event: 'Saladin recaptures Jerusalem', detail: 'After 88 years of Crusader rule, Jerusalem falls to Saladin. Unlike 1099, no massacre.', category: 'military', era: 'medieval-crusades', location: 'Jerusalem' }
  ],
  '06-10': [
    { year: 1190, event: 'Frederick Barbarossa drowns', detail: 'Holy Roman Emperor drowns crossing the Saleph River. Third Crusade loses its largest army.', category: 'other', era: 'medieval-crusades', location: 'Saleph River, Turkey' }
  ],
  '09-07': [
    { year: 1191, event: 'Battle of Arsuf', detail: 'Richard the Lionheart defeats Saladin in open battle. Disciplined march saves the day.', category: 'military', era: 'medieval-crusades', location: 'Arsuf, Palestine' }
  ],
  '04-13': [
    { year: 1204, event: 'Sack of Constantinople', detail: 'Fourth Crusade attacks fellow Christians. Constantinople looted for three days.', category: 'military', era: 'medieval-crusades', location: 'Constantinople' }
  ],
  '05-18': [
    { year: 1291, event: 'Fall of Acre', detail: 'Last major Crusader stronghold falls to the Mamluks. End of the Crusader states.', category: 'military', era: 'medieval-crusades', location: 'Acre, Palestine' }
  ],
  '11-25': [
    { year: 1177, event: 'Battle of Montgisard', detail: 'Baldwin IV defeats Saladin despite being outnumbered. The Leper King\'s greatest victory.', category: 'military', era: 'medieval-crusades', location: 'Montgisard, Palestine' }
  ],

  // === ANCIENT EGYPT ===
  '08-12': [
    { year: -30, event: 'Death of Cleopatra', detail: 'Last pharaoh of Egypt dies, likely by asp bite. End of Ptolemaic Egypt.', category: 'politics', era: 'ancient-egypt', location: 'Alexandria, Egypt' }
  ],
  '08-02': [
    { year: -30, event: 'Death of Mark Antony', detail: 'Roman general stabs himself after false report of Cleopatra\'s death.', category: 'military', era: 'ancient-egypt', location: 'Alexandria, Egypt' }
  ],
  '05-26': [
    { year: -1274, event: 'Battle of Kadesh', detail: 'Ramesses II fights the Hittites. Both sides claim victory. First recorded peace treaty follows.', category: 'military', era: 'ancient-egypt', location: 'Kadesh, Syria' }
  ],
  '02-18': [
    { year: -1336, event: 'Akhenaten abolishes old gods', detail: 'Pharaoh Akhenaten outlaws traditional Egyptian gods. Only the Aten may be worshipped.', category: 'politics', era: 'ancient-egypt', location: 'Akhetaten, Egypt' }
  ],
  '01-07': [
    { year: -2566, event: 'Great Pyramid completed', detail: 'After 20 years, Khufu\'s Great Pyramid is finished. The tallest structure for 3,800 years.', category: 'culture', era: 'ancient-egypt', location: 'Giza, Egypt' }
  ],
  '11-04': [
    { year: 1922, event: 'Tutankhamun\'s tomb discovered', detail: 'Howard Carter finds the intact tomb. "Can you see anything?" "Yes, wonderful things."', category: 'science', era: 'ancient-egypt', location: 'Valley of the Kings, Egypt' }
  ],
  '01-17': [
    { year: -1458, event: 'Death of Hatshepsut', detail: 'Female pharaoh dies after 22 years of prosperous rule. Stepson Thutmose III takes full power.', category: 'politics', era: 'ancient-egypt', location: 'Thebes, Egypt' }
  ],

  // === AMERICAN CIVIL WAR (1861-1865) ===
  '12-20': [
    { year: 1860, event: 'South Carolina secedes', detail: 'First state to leave the Union. Six more follow within weeks.', category: 'politics', era: 'american-civil-war', location: 'Charleston, South Carolina' }
  ],
  '04-14': [
    { year: 1865, event: 'Lincoln assassinated', detail: 'John Wilkes Booth shoots Lincoln at Ford\'s Theatre. President dies next morning.', category: 'politics', era: 'american-civil-war', location: 'Washington, D.C.' }
  ],
  '04-09': [
    { year: 1865, event: 'Lee surrenders at Appomattox', detail: 'Robert E. Lee surrenders the Army of Northern Virginia to Ulysses S. Grant.', category: 'military', era: 'american-civil-war', location: 'Appomattox Court House, Virginia' }
  ],
  '07-02': [
    { year: 1863, event: 'Battle of Gettysburg - Day 2', detail: 'Little Round Top, Devil\'s Den, the Peach Orchard. 20th Maine holds the line.', category: 'military', era: 'american-civil-war', location: 'Gettysburg, Pennsylvania' }
  ],
  '09-17': [
    { year: 1862, event: 'Battle of Antietam', detail: 'Bloodiest single day in American history. 23,000 casualties. Lee retreats to Virginia.', category: 'military', era: 'american-civil-war', location: 'Sharpsburg, Maryland' }
  ],
  '11-19': [
    { year: 1863, event: 'Gettysburg Address', detail: '"Four score and seven years ago..." Lincoln redefines the war\'s purpose in 272 words.', category: 'politics', era: 'american-civil-war', location: 'Gettysburg, Pennsylvania' }
  ],
  '11-15': [
    { year: 1864, event: 'Sherman begins March to the Sea', detail: '"I can make Georgia howl." 60,000 troops leave Atlanta for Savannah.', category: 'military', era: 'american-civil-war', location: 'Atlanta, Georgia' }
  ],
  '03-04': [
    { year: 1865, event: 'Lincoln\'s Second Inaugural', detail: '"With malice toward none, with charity for all..." Lincoln calls for reconciliation.', category: 'politics', era: 'american-civil-war', location: 'Washington, D.C.' }
  ],

  // === COLD WAR & SPACE RACE (1947-1991) ===
  '10-04': [
    { year: 1957, event: 'Sputnik launched', detail: 'Soviet Union launches first artificial satellite. The Space Race begins.', category: 'science', era: 'cold-war', location: 'Baikonur, Kazakhstan' }
  ],
  '05-05': [
    { year: 1961, event: 'Alan Shepard in space', detail: 'First American in space. 15-minute suborbital flight aboard Freedom 7.', category: 'science', era: 'cold-war', location: 'Cape Canaveral, Florida' }
  ],
  '10-28': [
    { year: 1962, event: 'Cuban Missile Crisis ends', detail: 'Khrushchev agrees to remove missiles. We were one phone call away from armageddon.', category: 'diplomacy', era: 'cold-war', location: 'Moscow' }
  ],
  '08-13': [
    { year: 1961, event: 'Berlin Wall construction begins', detail: 'East Germany builds wall overnight. Families separated for 28 years.', category: 'politics', era: 'cold-war', location: 'Berlin' },
    { year: 1521, event: 'Fall of Tenochtitlan', detail: 'Aztec capital falls after 75-day siege. Cortés conquers the empire.', category: 'military', era: 'age-of-exploration', location: 'Tenochtitlan, Mexico' }
  ],
  '01-28': [
    { year: 1986, event: 'Challenger disaster', detail: 'Space Shuttle Challenger breaks apart 73 seconds after launch. Seven crew killed.', category: 'other', era: 'cold-war', location: 'Cape Canaveral, Florida' }
  ],
  '02-20': [
    { year: 1962, event: 'John Glenn orbits Earth', detail: 'First American to orbit Earth. Three orbits in Friendship 7.', category: 'science', era: 'cold-war', location: 'Cape Canaveral, Florida' }
  ],
  '07-21': [
    { year: 1969, event: 'Armstrong and Aldrin walk on Moon', detail: 'First moonwalk lasts 2.5 hours. Experiments deployed, samples collected.', category: 'science', era: 'cold-war', location: 'Sea of Tranquility, Moon' }
  ],

  // === AGE OF EXPLORATION (1415-1600) ===
  '08-21': [
    { year: 1415, event: 'Portuguese capture Ceuta', detail: 'Prince Henry the Navigator\'s first expedition. Age of Exploration begins.', category: 'military', era: 'age-of-exploration', location: 'Ceuta, Morocco' }
  ],
  '08-03': [
    { year: 1492, event: 'Columbus sets sail', detail: 'Three ships leave Palos de la Frontera. 70 days to the New World.', category: 'other', era: 'age-of-exploration', location: 'Palos de la Frontera, Spain' }
  ],
  '05-20': [
    { year: 1498, event: 'Vasco da Gama reaches India', detail: 'First European to reach India by sea. The spice trade will never be the same.', category: 'other', era: 'age-of-exploration', location: 'Calicut, India' }
  ],
  '09-20': [
    { year: 1519, event: 'Magellan expedition begins', detail: 'Five ships and 270 men leave Seville. Only 18 will return.', category: 'other', era: 'age-of-exploration', location: 'Seville, Spain' }
  ],
  '04-27': [
    { year: 1521, event: 'Magellan killed in Philippines', detail: 'Ferdinand Magellan dies in battle with locals on Mactan Island.', category: 'military', era: 'age-of-exploration', location: 'Mactan Island, Philippines' }
  ],
  '09-06': [
    { year: 1522, event: 'First circumnavigation complete', detail: 'Victoria returns to Spain. Of 270 men who left, 18 survive.', category: 'other', era: 'age-of-exploration', location: 'Sanlúcar de Barrameda, Spain' }
  ],
  '11-08': [
    { year: 1519, event: 'Cortés meets Montezuma', detail: 'Spanish conquistador enters Tenochtitlan. Montezuma welcomes him as a guest.', category: 'diplomacy', era: 'age-of-exploration', location: 'Tenochtitlan, Mexico' }
  ],
  '07-11': [
    { year: 1405, event: 'Zheng He\'s first voyage', detail: 'Chinese treasure fleet of 300 ships sets sail. The largest naval expedition in history.', category: 'other', era: 'age-of-exploration', location: 'Nanjing, China' }
  ],
  '04-22': [
    { year: 1500, event: 'Pedro Cabral discovers Brazil', detail: 'Portuguese fleet lands in Brazil, claiming it for Portugal.', category: 'other', era: 'age-of-exploration', location: 'Porto Seguro, Brazil' }
  ],
  '06-07': [
    { year: 1494, event: 'Treaty of Tordesillas', detail: 'Spain and Portugal divide the New World between them. Pope-approved colonialism.', category: 'diplomacy', era: 'age-of-exploration', location: 'Tordesillas, Spain' }
  ],
}

const categoryColors: Record<string, string> = {
  military: 'bg-red-500',
  politics: 'bg-blue-500',
  diplomacy: 'bg-purple-500',
  culture: 'bg-amber-500',
  science: 'bg-green-500',
  other: 'bg-gray-500',
}

const categoryLabels: Record<string, string> = {
  military: 'Military',
  politics: 'Politics',
  diplomacy: 'Diplomacy',
  culture: 'Culture',
  science: 'Science',
  other: 'Other',
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function OnThisDayPage() {
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedEra, setSelectedEra] = useState<string>('all')
  const [mounted, setMounted] = useState(false)

  const allEras = useMemo(() => getEras(), [])

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setSelectedMonth(now.getMonth())
    setSelectedDay(now.getDate())
  }, [])

  const dateKey = `${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

  // Get all events for this date, filtered by era
  const events = useMemo(() => {
    const allEvents = historicalEvents[dateKey] || []
    if (selectedEra === 'all') {
      return allEvents.sort((a, b) => b.year - a.year)
    }
    return allEvents.filter(e => e.era === selectedEra).sort((a, b) => b.year - a.year)
  }, [dateKey, selectedEra])

  const daysInMonth = new Date(2000, selectedMonth + 1, 0).getDate() // Use non-leap year as base

  const goToPrevDay = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1)
    } else if (selectedMonth > 0) {
      setSelectedMonth(selectedMonth - 1)
      setSelectedDay(new Date(2000, selectedMonth, 0).getDate())
    } else {
      setSelectedMonth(11)
      setSelectedDay(31)
    }
  }

  const goToNextDay = () => {
    if (selectedDay < daysInMonth) {
      setSelectedDay(selectedDay + 1)
    } else if (selectedMonth < 11) {
      setSelectedMonth(selectedMonth + 1)
      setSelectedDay(1)
    } else {
      setSelectedMonth(0)
      setSelectedDay(1)
    }
  }

  const goToToday = () => {
    const now = new Date()
    setSelectedMonth(now.getMonth())
    setSelectedDay(now.getDate())
  }

  // Get posts from this date (any year)
  const allPosts = useMemo(() => getPosts(), [])
  const postsOnDate = useMemo(() => {
    return allPosts.filter(post => {
      const postDate = new Date(post.timestamp)
      const matchesDate = postDate.getMonth() === selectedMonth && postDate.getDate() === selectedDay
      const matchesEra = selectedEra === 'all' || post.era === selectedEra
      return matchesDate && matchesEra
    }).slice(0, 8)
  }, [allPosts, selectedMonth, selectedDay, selectedEra])

  // Format year display (handle BCE)
  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BCE`
    if (year < 100) return `${year} CE`
    return year.toString()
  }

  // Count events by era for the badge
  const eventCountByEra = useMemo(() => {
    const allEvents = historicalEvents[dateKey] || []
    const counts: Record<string, number> = { all: allEvents.length }
    allEvents.forEach(e => {
      counts[e.era] = (counts[e.era] || 0) + 1
    })
    return counts
  }, [dateKey])

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            On This Day
          </h1>
        </div>
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const isToday = (() => {
    const now = new Date()
    return now.getMonth() === selectedMonth && now.getDate() === selectedDay
  })()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            On This Day
            {isToday && (
              <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">Today</span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore what happened on any day across all of history
          </p>
        </div>
      </div>

      {/* Date Picker */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goToPrevDay}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(Number(e.target.value))
                const newDaysInMonth = new Date(2000, Number(e.target.value) + 1, 0).getDate()
                if (selectedDay > newDaysInMonth) {
                  setSelectedDay(newDaysInMonth)
                }
              }}
              className="px-3 py-2 rounded-md border border-border bg-background font-semibold"
              aria-label="Select month"
            >
              {months.map((month, i) => (
                <option key={month} value={i}>{month}</option>
              ))}
            </select>

            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="px-3 py-2 rounded-md border border-border bg-background font-semibold"
              aria-label="Select day"
            >
              {Array.from({ length: daysInMonth }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <button
            onClick={goToNextDay}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-3">
          {!isToday && (
            <button
              onClick={goToToday}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Jump to today
            </button>
          )}
        </div>
      </div>

      {/* Era Filter */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Era</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEra('all')}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full transition-colors",
              selectedEra === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            All Eras
            {eventCountByEra['all'] > 0 && (
              <span className="ml-1 opacity-70">({eventCountByEra['all']})</span>
            )}
          </button>
          {allEras.map(era => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-colors",
                selectedEra === era.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {era.shortName}
              {eventCountByEra[era.id] > 0 && (
                <span className="ml-1 opacity-70">({eventCountByEra[era.id]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Scroll className="h-5 w-5 text-primary" />
          Historical Events on {months[selectedMonth]} {selectedDay}
          <span className="text-sm font-normal text-muted-foreground">
            ({events.length} {events.length === 1 ? 'event' : 'events'})
          </span>
        </h2>

        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, i) => {
              const era = allEras.find(e => e.id === event.era)
              return (
                <div key={`${event.year}-${i}`} className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-3 h-3 rounded-full mt-1.5 shrink-0", categoryColors[event.category])} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-primary">{formatYear(event.year)}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {categoryLabels[event.category] || event.category}
                        </span>
                        {era && (
                          <Link
                            href={`/era/${era.id}`}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {era.shortName}
                          </Link>
                        )}
                      </div>
                      <h3 className="font-bold text-lg">{event.event}</h3>
                      <p className="text-muted-foreground mt-1">{event.detail}</p>
                      {event.location && (
                        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium">No recorded events</p>
            <p className="text-muted-foreground">
              {selectedEra === 'all'
                ? `${months[selectedMonth]} ${selectedDay} was a quieter day in recorded history`
                : `No ${allEras.find(e => e.id === selectedEra)?.name || selectedEra} events on this date`
              }
            </p>
            {selectedEra !== 'all' && (
              <button
                onClick={() => setSelectedEra('all')}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Show all eras
              </button>
            )}
          </div>
        )}
      </div>

      {/* Posts from this day */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          What people were posting
          <span className="text-sm font-normal text-muted-foreground">
            ({postsOnDate.length} {postsOnDate.length === 1 ? 'post' : 'posts'})
          </span>
        </h2>

        {postsOnDate.length > 0 ? (
          <div className="space-y-3">
            {postsOnDate.map(post => {
              const profile = getProfile(post.authorId)
              const era = allEras.find(e => e.id === post.era)
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                      {profile?.displayName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{profile?.displayName || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{profile?.handle}</p>
                    </div>
                    {era && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted shrink-0">
                        {era.shortName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm line-clamp-2">{post.content}</p>
                  {post.location?.name && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {post.location.name}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No posts from this date in our collection.</p>
            <Link href="/" className="text-primary hover:underline text-sm">
              Browse all posts
            </Link>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4">
        <h3 className="font-semibold mb-3">Event Categories</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", color)} />
              <span className="text-sm">{categoryLabels[category] || category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
