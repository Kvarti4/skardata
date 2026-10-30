# Skärdata

En enkel webbapp (PWA) som räknar ut skärdata för CNC-bearbetning: **Borrning**, **Svarvning** och **Fräsning**.
Fyll i de värden du har, så räknas de övriga ut direkt. Framräknade fält visas i blått.

| Formel | |
|---|---|
| Varvtal | `n = Vc · 1000 / (π · D)` |
| Skärhastighet | `Vc = π · D · n / 1000` |
| Matningshastighet (borr/svarv) | `Vf = f · n` |
| Matningshastighet (fräs) | `Vf = fz · Z · n` |

Värdena sparas på telefonen, och appen fungerar även utan nät när den väl är installerad.

## Publicera på GitHub Pages

1. Logga in på [github.com](https://github.com) och skapa ett nytt **publikt** repo, till exempel `skardata`.
2. Klicka på **Add file → Upload files** och dra in alla filer och mappen `icons` från den här mappen. Klicka sedan på **Commit changes**.
3. Gå till **Settings → Pages**, välj **Branch: `main`** och mappen **`/ (root)`** och klicka på **Save**.
4. Efter någon minut ligger appen på `https://<ditt-användarnamn>.github.io/skardata/`.

## Spara som app på telefonen

- **iPhone (Safari):** öppna adressen, tryck på **Dela** och välj **Lägg till på hemskärmen**.
- **Android (Chrome):** öppna adressen, tryck på **⋮** och välj **Installera app** (eller **Lägg till på startskärmen**).

## Uppdatera appen

Ladda upp de ändrade filerna till repot. Nästa gång appen öppnas med nätuppkoppling hämtar telefonen den nya versionen.
