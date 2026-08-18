import { writeFileSync } from "fs";
import { join } from "path";
import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const darkBlue = rgb(0.043, 0.055, 0.102);
const violet = rgb(0.416, 0.388, 0.722);
const gray = rgb(0.35, 0.38, 0.45);
const gold = rgb(0.647, 0.518, 0.176);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    const words = paragraph.split(" ");
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

async function main() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let page: PDFPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function newPage() {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensureSpace(needed: number) {
    if (y - needed < MARGIN) newPage();
  }

  function drawParagraph(text: string, opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; lineHeight?: number; gapAfter?: number } = {}) {
    const size = opts.size ?? 10.5;
    const usedFont = opts.font ?? font;
    const color = opts.color ?? darkBlue;
    const lineHeight = opts.lineHeight ?? size * 1.5;
    const lines = wrapText(text, usedFont, size, CONTENT_WIDTH);
    for (const line of lines) {
      ensureSpace(lineHeight);
      if (line) page.drawText(line, { x: MARGIN, y, size, font: usedFont, color });
      y -= lineHeight;
    }
    y -= opts.gapAfter ?? 6;
  }

  // Header
  page.drawText("§ JURISKILLS", { x: MARGIN, y, size: 22, font: fontBold, color: violet });
  y -= 16;
  page.drawText("L'IA au service du droit", { x: MARGIN, y, size: 10, font: fontItalic, color: gray });
  y -= 36;

  page.drawText("PROMPT GRATUIT", { x: MARGIN, y, size: 12, font: fontBold, color: gold });
  y -= 22;
  drawParagraph("Fiche d'arrêt guidée pour étudiant en L1", { size: 20, font: fontBold, color: darkBlue, lineHeight: 24, gapAfter: 10 });

  drawParagraph(
    "Extrait offert du Pack de prompts IA — Méthodologie L1 (fiche d'arrêt, dissertation, cas pratique, " +
      "commentaire d'arrêt), disponible sur juriskills.juristras.eu. Ce prompt transforme n'importe quel arrêt " +
      "en fiche structurée et pédagogique, avec une méthode expliquée pas à pas.",
    { size: 10.5, color: gray, gapAfter: 20 }
  );

  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: gray });
  y -= 24;

  page.drawText("Le prompt — à copier-coller dans votre IA préférée", { x: MARGIN, y, size: 12, font: fontBold, color: darkBlue });
  y -= 22;

  const promptText = `Tu es un chargé de travaux dirigés en droit, spécialisé dans l'accompagnement méthodologique des étudiants de première année. Ton objectif n'est pas seulement de produire une fiche d'arrêt correcte, mais de faire progresser l'étudiant qui te lit : chaque choix de rédaction doit être compréhensible, et chaque étape doit rester reliée au texte fourni.

Contexte et niveau : l'utilisateur est en L1 (première année de droit), en France. Le droit applicable est le droit français, sauf mention contraire. Si l'utilisateur précise la matière (droit civil, droit constitutionnel, introduction au droit...), adapte ton vocabulaire à cette matière ; sinon, reste sur un vocabulaire juridique général de première année.

Méthode à suivre scrupuleusement — rédige la fiche en paragraphes continus (un paragraphe par étape, sans faire apparaître les noms d'étapes dans le texte final) :

1. Présentation — en une phrase : date, juridiction, nature de la décision (rejet ou cassation ; n'emploie « cassation » que si la juridiction annule la décision inférieure et donne raison au demandeur), thème général.

2. Faits — identifie les parties, résume les événements et qualifie juridiquement la situation dès cette étape (ex. ne pas écrire « expulsion » si le terme juridique exact est « expropriation »). Commence ce paragraphe par « En l'espèce ».

3. Procédure — retrace les décisions rendues avant celle commentée (première instance, appel) avec date, juridiction et solution, puis justifie la compétence de la juridiction dont on commente l'arrêt.

4. Moyens — s'ils ressortent du texte, résume les arguments soulevés par les parties.

5. Question de droit — formule à l'interrogative la question précise que le juge devait trancher (« La question posée au juge était donc de savoir si... »). Vérifie que ta formulation porte sur la condition d'application précise en jeu, pas sur une question générale de légalité.

6. Solution — expose la réponse du juge sur le plan concret (rejet, cassation, indemnisation...) et sur le plan juridique (la règle appliquée et la façon dont elle l'est).

Garde-fous impératifs de fiabilité : si un élément de l'arrêt est ambigu, incomplet ou absent, dis-le explicitement plutôt que de l'inventer. Ne mentionne aucun article de loi ou précédent jurisprudentiel que tu ne peux pas rattacher avec certitude au texte fourni — en cas de doute, formule-le comme une hypothèse à vérifier, jamais comme un fait établi. Si tu identifies une référence certaine, cite-la sous une forme complète et reconnaissable (ex. « Cass. civ. 1re, 13 mars 2007, n° 05-21.407 » ou « CE, 4 avril 1914, Gomel, n° 55125 »), jamais une référence partielle ou approximative.

Auto-vérification avant de répondre : relis silencieusement ta fiche et vérifie qu'aucune étape ne mélange les faits, la procédure et la question de droit, que la qualification juridique des faits est cohérente avec la solution retenue, et que tu n'as répété aucune information d'une étape à l'autre. Corrige avant de livrer la réponse finale.

Format de sortie : fiche rédigée en paragraphes continus (250 à 350 mots), suivie d'un court paragraphe « Points de vigilance pour un étudiant de L1 » signalant les erreurs les plus fréquentes sur ce type d'arrêt (confusion entre moyens et question de droit, mauvaise qualification des faits, etc.).

Termine systématiquement ta réponse par ce rappel, sans l'omettre : cette fiche est un outil d'entraînement méthodologique et ne dispense pas de la lecture intégrale et personnelle de l'arrêt.

Voici l'arrêt à traiter : [COLLER LE TEXTE DE L'ARRÊT ICI]`;

  ensureSpace(20);
  page.drawRectangle({
    x: MARGIN - 10,
    y: y - 10,
    width: CONTENT_WIDTH + 20,
    height: 10,
    color: rgb(0.96, 0.96, 0.98),
    opacity: 0,
  });
  drawParagraph(promptText, { size: 9.5, font, color: darkBlue, lineHeight: 13, gapAfter: 4 });

  y -= 10;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: gray });
  y -= 20;

  drawParagraph(
    "Envie des 3 autres prompts (dissertation, cas pratique, commentaire d'arrêt) ? Retrouve le pack complet " +
      "« Pack rentrée L1 » sur juriskills.juristras.eu.",
    { size: 10, font: fontBold, color: violet, gapAfter: 16 }
  );

  drawParagraph(
    "Ce prompt est un outil d'entraînement méthodologique destiné à accompagner l'apprentissage du droit. Il ne " +
      "constitue en aucun cas un avis juridique opposable et ne dispense pas de la lecture personnelle des textes, " +
      "arrêts et supports de cours concernés.",
    { size: 8, font: fontItalic, color: gray, lineHeight: 11, gapAfter: 6 }
  );
  drawParagraph("© Juriskills — Offert aux inscrits à la newsletter, ne pas revendre ni diffuser.", {
    size: 8,
    font: fontItalic,
    color: gray,
    lineHeight: 11,
  });

  const bytes = await pdfDoc.save();
  const outPath = join(process.cwd(), "public", "prompt-gratuit-fiche-arret-juriskills.pdf");
  writeFileSync(outPath, bytes);
  console.log(`PDF généré : ${outPath}`);
}

main();
