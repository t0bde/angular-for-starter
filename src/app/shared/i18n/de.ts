import type { TranslationKey } from './en';

export const de: Record<TranslationKey, string> = {
  'app.title': 'Living Systems Lab',
  'app.navLabel': 'Seiten des Labors für lebende Systeme',
  'app.language': 'Sprache',
  'app.footerLegal': 'Impressum & Datenschutz',
  'nav.meadow': 'Wiesenmacher',
  'nav.life': 'Conways Spiel des Lebens',
  'nav.howItWorks': 'So funktioniert es',

  'common.speed': 'Simulationsgeschwindigkeit',
  'speed.slow': 'langsam',
  'speed.normal': 'normal',
  'speed.fast': 'schnell',
  'common.pause': 'Pause',

  'meadow.eyebrow': 'Labor für lebende Systeme',
  'meadow.heading': 'Wiesenmacher',
  'meadow.day': 'Tag {day}',
  'meadow.simulation': 'Ökosystem-Simulation',
  'meadow.behaviorLabel': 'Verhalten der Arten einstellen',
  'meadow.behaviorHeading': 'Verhalten der Arten',
  'meadow.plantGrowth': 'Wachstumsrate der Pflanzen',
  'meadow.herbivoreReproduction': 'Vermehrung der Pflanzenfresser',
  'meadow.herbivoreAggression': 'Aggression der Pflanzenfresser',
  'meadow.predatorReproduction': 'Vermehrung der Raubtiere',
  'meadow.predatorAggression': 'Aggression der Raubtiere',
  'meadow.msgNoPredators': 'Hier gibt es keine Raubtiere. Pflanzenfresser können schnell wachsen.',
  'meadow.msgNoHerbivores':
    'Raubtiere brauchen Pflanzenfresser. Behalte ihre Energie genau im Blick.',
  'meadow.msgScarce': 'Pflanzen sind knapp. Pflanzenfresser verlieren eventuell Energie.',
  'meadow.msgActive':
    'Die Nahrungskette ist aktiv. Beobachte, wie jede Gruppe die nächste beeinflusst.',

  'species.plant': 'Pflanze',
  'species.herbivore': 'Pflanzenfresser',
  'species.predator': 'Raubtier',
  'species.empty': 'Radierer',
  'species.emptyCell': 'leer',
  'species.herbivoreCell': 'Pflanzenfresser',
  'species.plantCell': 'Pflanze',
  'species.predatorCell': 'Raubtier',
  'meadow.cellLabel': 'Zeile {row}, Spalte {column}: {name}',

  'controls.runHeading': 'Wiese starten',
  'controls.play': 'Start',
  'controls.next': 'Weiter',
  'controls.advance': 'Einen Tag weiter',
  'controls.reset': 'Zurücksetzen',
  'controls.resetMeadow': 'Ausgewogene Wiese zurücksetzen',
  'controls.speedHeading': 'Geschwindigkeit',
  'controls.storyHeading': 'Geschichte starten',
  'controls.balanced': 'Ausgewogen',
  'controls.greenMeadow': 'Grüne Wiese',
  'controls.predatorBoom': 'Raubtier-Boom',
  'controls.paintHeading': 'Wiese bemalen',

  'population.label': 'Bestandsübersicht',
  'population.plants': 'Pflanzen',
  'population.herbivores': 'Pflanzenfresser',
  'population.predators': 'Raubtiere',

  'lesson.meadowClue': 'Wiesen-Hinweis',
  'lesson.foodChain':
    'Nahrungskette: Pflanzen ernähren Pflanzenfresser, die wiederum Raubtiere ernähren',
  'lesson.feeds': 'ernährt',

  'life.eyebrow': 'Garten der zellulären Automaten · B3/S23',
  'life.heading': 'Conways Spiel des Lebens',
  'life.seed': 'Startmuster: {name}',
  'life.gen': 'Gen. {generation}',
  'life.simulation': 'Simulation von Conways Spiel des Lebens',
  'life.msgQuiet':
    'Der Boden ist still. Wähle ein Methusalem-Startmuster oder klicke auf Felder, um eine neue Kolonie zu pflanzen.',
  'life.msgPlanted':
    'Startmuster gepflanzt: {name} ({alive} Zellen). Drücke Start oder Schritt, um es keimen zu sehen!',
  'life.msgEquilibrium':
    'Gleichgewicht erreicht! Nur noch stabile Muster bleiben im Garten übrig.',
  'life.msgRapid':
    'Schnelles Keimen: Neue Triebe sprießen auf dem freien Boden.',
  'life.msgMature':
    'Ältere Zellgruppen stabilisieren die Kolonie, während Oszillatoren und Gleiter sich nach außen ausbreiten.',

  'lifeControls.label': 'Gartensteuerung',
  'lifeControls.germinate': 'Keimen lassen',
  'lifeControls.step': 'Schritt',
  'lifeControls.replant': 'Neu pflanzen',
  'lifeControls.clear': 'Leeren',
  'lifeControls.growthSpeed': 'Wachstumsgeschwindigkeit',
  'lifeControls.wrap': 'Umlaufende Ränder (Torus)',
  'lifeControls.seedField': 'Startmuster-Feld',
  'lifeControls.seedGroup': 'Methusalem-Startmuster',
  'lifeControls.cells': '{count} Zellen',
  'lifeControls.brush': 'Pflanzpinsel',
  'lifeControls.brushGroup': 'Werkzeuge des Pflanzpinsels',
  'brush.single': 'Einzelne Zelle (Umschalten)',
  'brush.acorn': 'Eichel-Muster (7)',
  'brush.glider': 'Gleiter-Trieb (5)',
  'brush.blinker': 'Blinker-Reihe (3)',
  'brush.eraser': 'Entfernen / Löschen',
  'seed.acorn.label': 'Eichel-Muster',
  'seed.acorn.description':
    'Ein winziges Muster aus 7 Zellen, aus dem über Tausende von Generationen Gleiter und stabile Muster entstehen.',
  'seed.r-pentomino.label': 'R-Pentomino',
  'seed.r-pentomino.description':
    'Conways klassischer Trieb aus 5 Zellen, der in lebhafte, langlebige Aktivität ausbricht.',
  'seed.diehard.label': 'Diehard-Muster',
  'seed.diehard.description':
    'Eine kurzlebige Blüte aus 7 Zellen, die 130 Generationen gedeiht, bevor sie verschwindet.',
  'seed.rabbits.label': 'Kaninchen-Muster',
  'seed.rabbits.description':
    'Ein Startcluster aus 9 Zellen, das sich schnell zu einer dichten Zellwiese vermehrt.',
  'seed.glider-fleet.label': 'Gleiter-Armada',
  'seed.glider-fleet.description':
    'Drei synchronisierte Gleiter, die diagonal durch den Garten driften.',

  'lifeGrid.label': 'Gitter des Zellgartens',
  'lifeGrid.emptySoil': 'Zeile {row}, Spalte {column}: leerer Boden',
  'lifeGrid.cell': 'Zeile {row}, Spalte {column}: {stage} (Alter {age})',
  'stage.sprout': 'frischer Trieb',
  'stage.flora': 'wachsende Pflanze',
  'stage.perennial': 'alte Zelle',
  'lifeGrid.legend': 'Legende der Wachstumsstufen',
  'lifeGrid.legendSprout': 'Frischer Trieb (Alter 1 · entsteht bei 3 Nachbarn)',
  'lifeGrid.legendFlora': 'Wachsende Pflanze (Alter 2–5)',
  'lifeGrid.legendPerennial': 'Alte Zelle (Alter 6+ · stabil)',

  'lifeLesson.label': 'Conways Regeln des Lebens',
  'lifeLesson.eyebrow': 'Feldbeobachtung',
  'lifeLesson.birth': 'Geburt (B3)',
  'lifeLesson.birthText': '3 Nachbarn lassen einen Trieb sprießen',
  'lifeLesson.survival': 'Überleben (S23)',
  'lifeLesson.survivalText': '2–3 Nachbarn: die Zelle gedeiht',
  'lifeLesson.decay': 'Verfall',
  'lifeLesson.decayText': '<2 oder >3 Nachbarn: die Zelle welkt',

  'lifeStats.label': 'Kennzahlen der Kolonie',
  'lifeStats.living': 'Lebende Zellen',
  'lifeStats.sprouts': 'Frische Triebe (Alter 1)',
  'lifeStats.perennials': 'Alte Zellen (Alter 6+)',
  'lifeStats.withered': 'Verwelkt im letzten Schritt',

  'howItWorks.eyebrow': 'Hintergrund',
  'howItWorks.heading': 'So funktioniert Conways Spiel des Lebens',
  'howItWorks.summaryHeading': 'Die Idee',
  'howItWorks.summary1':
    'Conways Spiel des Lebens ist ein zellulärer Automat, den der Mathematiker John Horton Conway 1970 entwickelt hat. Ein Raster aus Zellen, die entweder lebendig oder tot sind, entwickelt sich in diskreten Schritten weiter, den Generationen.',
  'howItWorks.summary2':
    'Es gibt keine Spieler und kein Ziel. Jede Zelle folgt denselben einfachen lokalen Regeln, und trotzdem können Muster entstehen, die sich bewegen, schwingen, wachsen oder verschwinden.',
  'howItWorks.showHeading': 'Was diese Seite zeigt',
  'howItWorks.showIntro':
    'Die Simulation auf der Seite Conways Spiel des Lebens wendet diese Regeln auf ein lebendiges Raster an:',
  'howItWorks.showGrid':
    'Zellen-Garten: Jedes Feld ist eine Zelle. Ihre Farbe zeigt die Wachstumsstufe: frischer Trieb, wachsende Pflanze oder Dauerbewuchs.',
  'howItWorks.showStats':
    'Kennzahlen: lebende Zellen, frische Triebe (Alter 1), Dauerpflanzen (Alter 6+) und Zellen, die im letzten Schritt verwelkt sind.',
  'howItWorks.showControls':
    'Steuerung: Keimen (Ablauf starten), einen Schritt weiter, zurücksetzen, leeren und Wachstumsgeschwindigkeit einstellen.',
  'howItWorks.showSeeds':
    'Startsamen: klassische Methusalem-Muster wie Acorn, R-Pentomino, Diehard, Rabbits und die Gleiter-Armada.',
  'howItWorks.showBrush':
    'Pflanzpinsel: einzelne Zellen, Gleiter, Blinker oder Acorn setzen oder Zellen entfernen.',
  'howItWorks.algoHeading': 'Der Algorithmus',
  'howItWorks.algoIntro':
    'Jede Generation wird in einem Durchgang aus dem aktuellen Zustand berechnet, sodass sich alle Zellen gleichzeitig ändern:',
  'howItWorks.algoNeighbors':
    'Nachbarn zählen: Für jede Zelle wird gezählt, wie viele ihrer 8 Nachbarn (waagerecht, senkrecht und diagonal) lebendig sind.',
  'howItWorks.algoWrap':
    'Ränder: Mit aktivierten Umlaufrändern (Standard) wirkt das Raster wie ein Torus, der linke Rand grenzt also an den rechten und der obere an den unteren. Sonst zählen Zellen außerhalb des Rasters als tot.',
  'howItWorks.algoBirth': 'Geburt: Eine tote Zelle mit genau 3 lebenden Nachbarn wird lebendig.',
  'howItWorks.algoSurvival': 'Überleben: Eine lebende Zelle mit 2 oder 3 lebenden Nachbarn bleibt lebendig.',
  'howItWorks.algoDeath':
    'Tod: Eine lebende Zelle mit weniger als 2 (Unterbevölkerung) oder mehr als 3 (Überbevölkerung) lebenden Nachbarn stirbt.',
  'howItWorks.algoNotation': 'Kurz geschrieben lautet die Regel B3/S23: Geburt bei 3, Überleben bei 2 oder 3.',
  'howItWorks.stageAge1': 'Alter 1',
  'howItWorks.stageAge2To5': 'Alter 2–5',
  'howItWorks.stageAge6Plus': 'Alter 6+',
  'howItWorks.diagramBefore': 'Mitte · vorher',
  'howItWorks.diagramAfter': 'Mitte · nachher',
  'howItWorks.diagramNeighborsTag': '8er-Moore-Nachbarschaft',
  'howItWorks.diagramTorusTag': 'Oben ↔ Unten · Links ↔ Rechts',
  'howItWorks.diagramBirthTag': '3 Nachbarn → Geburt (B3)',
  'howItWorks.diagramSurvivalTag': '2–3 Nachbarn → Überleben (S23)',
  'howItWorks.diagramDeathTag': '<2 oder >3 Nachbarn → Tod',
  'howItWorks.tryIt': 'Im Simulator ausprobieren',
};
