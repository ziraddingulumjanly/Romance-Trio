export type GrammarRow = { en:string; fr:string; it:string; es:string };
export type Lesson = {
 slug:string;title:string;eyebrow:string;icon:string;color:string;description:string;
 intro:string; rows:GrammarRow[]; notes:string[]; example?:GrammarRow;
};
export const GRAMMAR:Lesson[] = [
 {slug:'articles',title:'Articles',eyebrow:'THE FOUNDATION',icon:'BookOpen',color:'violet',description:'The, a, an — and how gender changes everything.',intro:'Definite articles mean “the”; indefinite articles mean “a/an”. In Romance languages they usually agree with a noun’s gender and number.',rows:[
 {en:'the · masculine singular',fr:'le / l’',it:'il / lo / l’',es:'el'},
 {en:'the · feminine singular',fr:'la / l’',it:'la / l’',es:'la'},
 {en:'the · masculine plural',fr:'les',it:'i / gli',es:'los'},
 {en:'the · feminine plural',fr:'les',it:'le',es:'las'},
 {en:'a · masculine',fr:'un',it:'un / uno',es:'un'},
 {en:'a · feminine',fr:'une',it:'una / un’',es:'una'}
 ],notes:['Italian article selection depends on the following sound: il libro, lo studente, l’amico.','French l’ appears before a vowel or mute h; Spanish el does not elide.','Spanish feminine nouns beginning with stressed a/ha may use el in singular: el agua fría.'],example:{en:'The house is beautiful.',fr:'La maison est belle.',it:'La casa è bella.',es:'La casa es hermosa.'}},
 {slug:'nouns',title:'Nouns & Gender',eyebrow:'BUILDING BLOCKS',icon:'Users',color:'blue',description:'Masculine, feminine, and the plural.',intro:'French, Italian and Spanish grammatical nouns are generally masculine or feminine. Articles and adjectives adapt to the noun.',rows:[
 {en:'a house',fr:'une maison (f)',it:'una casa (f)',es:'una casa (f)'},
 {en:'a book',fr:'un livre (m)',it:'un libro (m)',es:'un libro (m)'},
 {en:'the friends · mixed/masc.',fr:'les amis',it:'gli amici',es:'los amigos'},
 {en:'the friends · feminine',fr:'les amies',it:'le amiche',es:'las amigas'},
 {en:'the cities',fr:'les villes',it:'le città',es:'las ciudades'},
 {en:'the flowers',fr:'les fleurs',it:'i fiori',es:'las flores'}
 ],notes:['French plurals often add written -s; the ending is frequently silent.','Italian nouns often change -o → -i or -a → -e, with exceptions.','Spanish plurals generally add -s or -es. Always learn a noun together with its article.']},
 {slug:'verbs',title:'Verbs',eyebrow:'ACTIONS & MEANING',icon:'Activity',color:'rose',description:'Essential verbs and their infinitives.',intro:'Most Romance-language verbs conjugate according to person, number, tense, and mood. Start with common infinitives, then present-tense forms.',rows:[
 {en:'to be',fr:'être',it:'essere',es:'ser / estar'},
 {en:'to have',fr:'avoir',it:'avere',es:'tener'},
 {en:'to speak',fr:'parler',it:'parlare',es:'hablar'},
 {en:'to eat',fr:'manger',it:'mangiare',es:'comer'},
 {en:'to live',fr:'vivre',it:'vivere',es:'vivir'},
 {en:'I speak',fr:'je parle',it:'(io) parlo',es:'(yo) hablo'},
 {en:'we speak',fr:'nous parlons',it:'(noi) parliamo',es:'(nosotros) hablamos'}
 ],notes:['Spanish has two common verbs for “to be”: ser and estar; their uses differ.','Italian and Spanish regularly omit personal pronouns when the verb ending identifies the subject.','French usually needs an explicit subject pronoun.'],example:{en:'I speak three languages.',fr:'Je parle trois langues.',it:'Parlo tre lingue.',es:'Hablo tres idiomas.'}},
 {slug:'numbers',title:'Numbers',eyebrow:'COUNT & MEASURE',icon:'Hash',color:'green',description:'From one to a thousand, side by side.',intro:'Many number words share Latin roots, but their pronunciation and formation differ — especially French numbers above sixty.',rows:[
 {en:'one',fr:'un / une',it:'uno / una',es:'uno / una'},
 {en:'two',fr:'deux',it:'due',es:'dos'},
 {en:'three',fr:'trois',it:'tre',es:'tres'},
 {en:'four',fr:'quatre',it:'quattro',es:'cuatro'},
 {en:'five',fr:'cinq',it:'cinque',es:'cinco'},
 {en:'ten',fr:'dix',it:'dieci',es:'diez'},
 {en:'twenty',fr:'vingt',it:'venti',es:'veinte'},
 {en:'seventy',fr:'soixante-dix',it:'settanta',es:'setenta'},
 {en:'eighty',fr:'quatre-vingts',it:'ottanta',es:'ochenta'},
 {en:'one hundred',fr:'cent',it:'cento',es:'cien'}
 ],notes:['Standard metropolitan French uses soixante-dix (70) and quatre-vingts (80).','Numbers agree with gender in some contexts, such as une/una.','The Spanish form cien changes to ciento before many following numbers.']},
 {slug:'pronouns',title:'Pronouns',eyebrow:'WHO DOES WHAT',icon:'MessageCircle',color:'orange',description:'I, you, he, she, we, they.',intro:'Subject pronouns represent the person performing an action. Italian and Spanish often leave them unspoken.',rows:[
 {en:'I',fr:'je / j’',it:'io',es:'yo'},
 {en:'you · informal singular',fr:'tu',it:'tu',es:'tú'},
 {en:'he',fr:'il',it:'lui / egli',es:'él'},
 {en:'she',fr:'elle',it:'lei',es:'ella'},
 {en:'we',fr:'nous',it:'noi',es:'nosotros / nosotras'},
 {en:'you · plural / formal',fr:'vous',it:'voi / Lei (formal singular)',es:'ustedes / vosotros(as) (Spain informal plural)'},
 {en:'they · masculine/mixed',fr:'ils',it:'loro',es:'ellos'},
 {en:'they · feminine',fr:'elles',it:'loro',es:'ellas'}
 ],notes:['French vous can be plural or formal singular.','Italian Lei is a formal singular address, while voi is plural.','Spanish ustedes is plural; vosotros/vosotras is also used for informal plural in much of Spain.']},
 {slug:'cognates',title:'Cognates',eyebrow:'SHARED ROOTS',icon:'Link2',color:'violet',description:'Recognize related words across all four languages.',intro:'Cognates come from a shared historical source. Common Latin-derived word families make many new words easier to recognize.',rows:[
 {en:'important',fr:'important',it:'importante',es:'importante'},
 {en:'different',fr:'différent',it:'differente',es:'diferente'},
 {en:'intelligent',fr:'intelligent',it:'intelligente',es:'inteligente'},
 {en:'nation',fr:'nation',it:'nazione',es:'nación'},
 {en:'university',fr:'université',it:'università',es:'universidad'},
 {en:'possible',fr:'possible',it:'possibile',es:'posible'},
 {en:'democracy',fr:'démocratie',it:'democrazia',es:'democracia'},
 {en:'culture',fr:'culture',it:'cultura',es:'cultura'}
 ],notes:['English -tion often corresponds to Italian -zione and Spanish -ción.','English -ity often corresponds to French -ité, Italian -ità, and Spanish -idad.','These are tendencies, not universal conversion rules; compare meaning as well as spelling.']},
 {slug:'prepositions',title:'Prepositions',eyebrow:'SMALL WORDS, BIG ROLE',icon:'GitCompareArrows',color:'blue',description:'Of, to, from, in, with, for, and more.',intro:'Prepositions connect nouns and ideas. Their meanings overlap, but no single preposition translates perfectly in every context.',rows:[
 {en:'of',fr:'de',it:'di',es:'de'},
 {en:'to',fr:'à',it:'a',es:'a'},
 {en:'from',fr:'de / depuis',it:'da',es:'de / desde'},
 {en:'in',fr:'dans / en',it:'in',es:'en'},
 {en:'with',fr:'avec',it:'con',es:'con'},
 {en:'without',fr:'sans',it:'senza',es:'sin'},
 {en:'between',fr:'entre',it:'tra / fra',es:'entre'},
 {en:'for',fr:'pour',it:'per',es:'para / por'}
 ],notes:['“Of the” can become du (French), del (Italian), or del (Spanish) in some masculine-singular cases.','“To the” can become au (French), al (Italian), or al (Spanish).','Choose the correct preposition from its phrase and meaning, not by translating it alone.']},
 {slug:'adjectives',title:'Adjectives',eyebrow:'DESCRIBE ANYTHING',icon:'Palette',color:'green',description:'Beautiful, new, small — gender and agreement.',intro:'Adjectives often agree with the gender and number of the noun. Placement also differs among languages and particular adjectives.',rows:[
 {en:'beautiful · masculine',fr:'beau',it:'bello',es:'bonito'},
 {en:'beautiful · feminine',fr:'belle',it:'bella',es:'bonita'},
 {en:'small · masculine',fr:'petit',it:'piccolo',es:'pequeño'},
 {en:'small · feminine',fr:'petite',it:'piccola',es:'pequeña'},
 {en:'important',fr:'important / importante',it:'importante',es:'importante'},
 {en:'interesting',fr:'intéressant / intéressante',it:'interessante',es:'interesante'}
 ],notes:['Many Italian and Spanish adjectives ending in -e have the same form for both genders.','French adjectives can appear before or after a noun, depending on the adjective.','Spanish and Italian adjectives commonly follow nouns, but there are important exceptions.']},
 {slug:'questions',title:'Questions',eyebrow:'START A CONVERSATION',icon:'CircleHelp',color:'orange',description:'Who, what, when, where, and why.',intro:'Question words are essential for speaking. Notice that Spanish uses opening question marks.',rows:[
 {en:'who?',fr:'qui ?',it:'chi?',es:'¿quién?'},
 {en:'what?',fr:'quoi ? / que ?',it:'che cosa?',es:'¿qué?'},
 {en:'when?',fr:'quand ?',it:'quando?',es:'¿cuándo?'},
 {en:'where?',fr:'où ?',it:'dove?',es:'¿dónde?'},
 {en:'why?',fr:'pourquoi ?',it:'perché?',es:'¿por qué?'},
 {en:'how?',fr:'comment ?',it:'come?',es:'¿cómo?'},
 {en:'how much?',fr:'combien ?',it:'quanto?',es:'¿cuánto?'}
 ],notes:['Spanish uses ¿ at the beginning of written direct questions.','French questions can use est-ce que, inversion, or rising intonation.','Question structure is context-dependent; word-for-word matching is only a starting point.']},
 {slug:'negation',title:'Negation',eyebrow:'SAY NO',icon:'Ban',color:'rose',description:'Not, never, nothing, and nobody.',intro:'Negation has a similar purpose in all three languages, but the position of negative words differs.',rows:[
 {en:'I do not know.',fr:'Je ne sais pas.',it:'Non lo so.',es:'No lo sé.'},
 {en:'I do not understand.',fr:'Je ne comprends pas.',it:'Non capisco.',es:'No entiendo.'},
 {en:'never',fr:'jamais',it:'mai',es:'nunca'},
 {en:'nothing',fr:'rien',it:'niente',es:'nada'},
 {en:'nobody',fr:'personne',it:'nessuno',es:'nadie'}
 ],notes:['Standard written French often surrounds the conjugated verb with ne ... pas.','Italian commonly places non before the verb.','Spanish commonly places no before the verb; negative concord is normal in some constructions.']},
 {slug:'tenses',title:'Essential Tenses',eyebrow:'TALK ABOUT TIME',icon:'Clock3',color:'blue',description:'Present, past, and future at a glance.',intro:'Each language expresses time through several verb forms. These examples illustrate common ways to express present, past, and future.',rows:[
 {en:'I speak.',fr:'Je parle.',it:'Parlo.',es:'Hablo.'},
 {en:'I spoke.',fr:'J’ai parlé.',it:'Ho parlato.',es:'Hablé.'},
 {en:'I will speak.',fr:'Je parlerai.',it:'Parlerò.',es:'Hablaré.'},
 {en:'I am going to speak.',fr:'Je vais parler.',it:'Sto per parlare.',es:'Voy a hablar.'},
 {en:'I was speaking.',fr:'Je parlais.',it:'Parlavo.',es:'Hablaba.'}
 ],notes:['Simple English “spoke” may require different past tenses depending on context.','Italian spoken and written past-tense choices can differ by region and register.','French futur proche and Spanish ir a + infinitive often express near-future intent.']},
 {slug:'sentence-structure',title:'Sentence Structure',eyebrow:'PUT IT TOGETHER',icon:'AlignLeft',color:'green',description:'Order words naturally and clearly.',intro:'Simple affirmative sentences typically follow subject–verb–object order, with frequent subject omission in Italian and Spanish.',rows:[
 {en:'I read a book.',fr:'Je lis un livre.',it:'Leggo un libro.',es:'Leo un libro.'},
 {en:'She drinks water.',fr:'Elle boit de l’eau.',it:'Lei beve acqua.',es:'Ella bebe agua.'},
 {en:'We live in Rome.',fr:'Nous habitons à Rome.',it:'Viviamo a Roma.',es:'Vivimos en Roma.'},
 {en:'The red house',fr:'la maison rouge',it:'la casa rossa',es:'la casa roja'},
 {en:'A beautiful city',fr:'une belle ville',it:'una bella città',es:'una ciudad bonita'}
 ],notes:['French generally requires subject pronouns; Italian and Spanish generally allow subject omission.','Adjective position varies by adjective and language.','Articles, prepositions, and noun agreement often matter more than literal word order.']},
 {slug:'false-friends',title:'False Friends',eyebrow:'LOOKS CAN DECEIVE',icon:'AlertTriangle',color:'rose',description:'Similar-looking words with different meanings.',intro:'Related languages have words that look familiar but do not mean the same thing. These traps are worth learning early.',rows:[
 {en:'actually',fr:'en fait',it:'in realtà',es:'en realidad'},
 {en:'currently',fr:'actuellement',it:'attualmente',es:'actualmente'},
 {en:'library (place for books)',fr:'bibliothèque',it:'biblioteca',es:'biblioteca'},
 {en:'bookshop',fr:'librairie',it:'libreria',es:'librería'},
 {en:'embarrassed',fr:'gêné',it:'imbarazzato',es:'avergonzado'},
 {en:'pregnant',fr:'enceinte',it:'incinta',es:'embarazada'}
 ],notes:['French librairie and Spanish librería mean a bookshop, not a public library.','Spanish embarazada means pregnant, not embarrassed.','French actuellement and Spanish actualmente mean currently, not actually.']},
 {slug:'adverbs',title:'Adverbs',eyebrow:'ADD DETAIL',icon:'ListFilter',color:'violet',description:'Quickly, slowly, carefully, and more.',intro:'Many English -ly adverbs correspond to French -ment and Italian/Spanish -mente, although the exact formations vary.',rows:[
 {en:'normally',fr:'normalement',it:'normalmente',es:'normalmente'},
 {en:'quickly',fr:'rapidement',it:'rapidamente',es:'rápidamente'},
 {en:'slowly',fr:'lentement',it:'lentamente',es:'lentamente'},
 {en:'carefully',fr:'attentivement',it:'attentamente',es:'cuidadosamente'},
 {en:'easily',fr:'facilement',it:'facilmente',es:'fácilmente'},
 {en:'really',fr:'vraiment',it:'davvero',es:'realmente'}
 ],notes:['Italian and Spanish frequently use -mente endings.','French often uses -ment, but spelling changes and irregular forms are common.','Not every English word ending in -ly can be converted by a suffix rule.']}

 ,{slug:'possessives',title:'Possessives',eyebrow:'WHOSE IS IT?',icon:'House',color:'blue',description:'My, your, our — express ownership naturally.',intro:'Possessive words adapt to gender and number in different ways. French and Italian forms generally agree with the thing possessed, while short Spanish possessives normally do not mark gender.',rows:[
 {en:'my book',fr:'mon livre',it:'il mio libro',es:'mi libro'},
 {en:'my house',fr:'ma maison',it:'la mia casa',es:'mi casa'},
 {en:'your book · informal',fr:'ton livre',it:'il tuo libro',es:'tu libro'},
 {en:'our friends',fr:'nos amis',it:'i nostri amici',es:'nuestros amigos'},
 {en:'her sister',fr:'sa sœur',it:'sua sorella',es:'su hermana'},
 {en:'their house',fr:'leur maison',it:'la loro casa',es:'su casa'}
 ],notes:['French possessives agree with the possessed noun, not necessarily with the possessor.','Italian possessives often require an article, with notable family-member exceptions.','Spanish short possessives mi, tu, su normally precede the noun.']},
 {slug:'conjunctions',title:'Conjunctions',eyebrow:'LINK YOUR THOUGHTS',icon:'Link2',color:'violet',description:'And, but, because, although, if.',intro:'Conjunctions connect ideas and enable more natural, complete sentences. A few apparent lookalikes have different grammatical behavior.',rows:[
 {en:'and',fr:'et',it:'e',es:'y'},
 {en:'or',fr:'ou',it:'o',es:'o'},
 {en:'but',fr:'mais',it:'ma',es:'pero'},
 {en:'because',fr:'parce que',it:'perché',es:'porque'},
 {en:'if',fr:'si',it:'se',es:'si'},
 {en:'when',fr:'quand',it:'quando',es:'cuando'},
 {en:'although',fr:'bien que',it:'sebbene',es:'aunque'},
 {en:'while',fr:'pendant que',it:'mentre',es:'mientras'}
 ],notes:['Spanish y changes to e before some words beginning with an i sound.','French bien que normally introduces the subjunctive.','Italian perché can mean because or why, depending on use.']},
 {slug:'comparisons',title:'Comparisons',eyebrow:'COMPARE & DESCRIBE',icon:'GitCompareArrows',color:'green',description:'More than, less than, as ... as, the best.',intro:'Comparatives and superlatives help you describe differences and preferences across all three languages.',rows:[
 {en:'bigger than',fr:'plus grand que',it:'più grande di',es:'más grande que'},
 {en:'more interesting',fr:'plus intéressant',it:'più interessante',es:'más interesante'},
 {en:'less expensive',fr:'moins cher',it:'meno costoso',es:'menos caro'},
 {en:'as important as',fr:'aussi important que',it:'importante quanto',es:'tan importante como'},
 {en:'the best · masculine',fr:'le meilleur',it:'il migliore',es:'el mejor'},
 {en:'the worst · masculine',fr:'le pire',it:'il peggiore',es:'el peor'}
 ],notes:['Adjectives can change for gender and number: plus grande, più grande, más grande.','Italian comparative constructions can take di or che depending on what is compared.','Expressions are illustrative; some comparative constructions change in complete sentences.']},
 {slug:'imperatives',title:'Imperatives',eyebrow:'EVERYDAY INSTRUCTIONS',icon:'MessageCircle',color:'orange',description:'Come, listen, wait, and let’s go.',intro:'Imperatives express directions, invitations or requests. Forms change by familiarity and grammatical person.',rows:[
 {en:'Listen! · informal singular',fr:'Écoute !',it:'Ascolta!',es:'¡Escucha!'},
 {en:'Come! · informal singular',fr:'Viens !',it:'Vieni!',es:'¡Ven!'},
 {en:'Wait! · informal singular',fr:'Attends !',it:'Aspetta!',es:'¡Espera!'},
 {en:'Let’s go!',fr:'Allons-y !',it:'Andiamo!',es:'¡Vamos!'},
 {en:'Speak slowly. · informal',fr:'Parle lentement.',it:'Parla lentamente.',es:'Habla despacio.'}
 ],notes:['French informal singular imperative forms often omit a final -s for -er verbs.','Italian has different informal singular and formal imperative forms.','Spanish uses opening exclamation marks for exclamatory commands and has different negative imperatives.']}

];
export const FEATURED_LESSONS = ['articles','nouns','verbs','numbers','pronouns','cognates'];
