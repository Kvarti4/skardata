# Skärdata

En enkel kalkylator för skärdata vid CNC-bearbetning: **borrning**, **svarvning** och **fräsning**.
Den fungerar i mobilen som en vanlig app, även utan nätuppkoppling.

**Öppna appen:** https://kvarti4.github.io/skardata/

## Installera på telefonen

- **iPhone:** öppna länken i **Safari**, tryck på **Dela** (fyrkanten med en pil) och välj **Lägg till på hemskärmen**.
- **Android:** öppna länken i **Chrome**, tryck på **⋮** och välj **Installera app** (eller **Lägg till på startskärmen**).

Appen får då en egen ikon och öppnas i helskärm.

## Så använder du den

1. Välj flik: **Borrning**, **Svarvning** eller **Fräsning**. Du byter flik genom att trycka på den eller svepa i sidled.
2. Fyll i de värden du har. De övriga räknas ut direkt medan du skriver.
3. Resultatet för **varvtal (n)** och **matningshastighet (Vf)** visas i de blå rutorna längst ner.

Det går att räkna åt båda hållen:

| Du fyller i | Appen räknar ut |
|---|---|
| Diameter + skärhastighet (Vc) | Varvtal (n) |
| Diameter + varvtal (n) | Skärhastighet (Vc) |
| Matning (f eller fz) + varvtal | Matningshastighet (Vf) |
| Matningshastighet (Vf) + varvtal | Matning (f eller fz) |

Fält som appen har räknat ut visas i blått.

### Exempel – borrning
Ett borr på Ø10 mm med Vc 50 m/min och f 0,12 mm/varv ger **n ≈ 1592 varv/min** och **Vf ≈ 191 mm/min**.

### Exempel – fräsning
En fräs på Ø10 mm med 4 skär, Vc 200 m/min och fz 0,05 mm/tand ger **n ≈ 6366 varv/min** och **Vf ≈ 1273 mm/min**.

### Bra att veta
- Du kan använda både komma och punkt som decimaltecken.
- **f(x)** uppe till höger visar formlerna för den flik du står på.
- **Papperskorgen** uppe till vänster tömmer fälten på den flik du står på.
- Appen kommer ihåg dina senaste värden till nästa gång du öppnar den.

## Formler

| Storhet | Formel | Enhet |
|---|---|---|
| Varvtal | `n = Vc · 1000 / (π · D)` | varv/min |
| Skärhastighet | `Vc = π · D · n / 1000` | m/min |
| Matningshastighet (borrning/svarvning) | `Vf = f · n` | mm/min |
| Matningshastighet (fräsning) | `Vf = fz · Z · n` | mm/min |

D = diameter (mm), f = matning per varv (mm/varv), fz = matning per tand (mm/tand), Z = antal skär.

> Värdena är teoretiska riktvärden. Kontrollera alltid verktygstillverkarens rekommendationer och maskinens begränsningar.

---

## För utvecklare

Appen är en statisk webbapp (HTML, CSS och JavaScript) utan byggsteg och publiceras med GitHub Pages från grenen `main`.

- `index.html`, `style.css` och `app.js` är själva appen.
- `manifest.webmanifest` och `sw.js` gör att den kan installeras och fungerar offline.
- `icons/` innehåller appikonerna.

När ändringar pushas till `main` uppdateras sidan inom någon minut. Telefonerna hämtar den nya versionen nästa gång appen öppnas med nätuppkoppling.
