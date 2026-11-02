# Cozy Flight – prototyp 0.1

Mały, przeglądarkowy prototyp 3D samolotu w klimacie cozy. Projekt korzysta z Three.js ładowanego z jsDelivr CDN – nie wymaga bundlera ani instalacji zależności.

## Uruchomienie lokalne
Najprościej uruchomić lokalny serwer HTTP w katalogu projektu, np.:

```bash
python -m http.server 8000
```

Następnie otwórz http://localhost:8000

Nie otwieraj `index.html` bezpośrednio przez `file://`, ponieważ przeglądarka może blokować moduły JavaScript.

## Publikacja na GitHub Pages
1. Utwórz repozytorium o nazwie `cozy-flight` na GitHubie.
2. Wgraj do repozytorium pliki `index.html`, `README.md` i folder `src`.
3. Wejdź w **Settings → Pages**.
4. W sekcji **Build and deployment** wybierz **Deploy from a branch**.
5. Wybierz gałąź `main` oraz folder `/ (root)` i kliknij Save.
6. Po chwili gra będzie dostępna pod adresem `https://TWOJ_LOGIN.github.io/cozy-flight/`.

## Sterowanie
- W / S lub strzałki góra/dół – pochylenie
- A / D lub strzałki lewo/prawo – przechylenie
- Q / E – ster kierunku
- Shift – zwiększ gaz
- Ctrl – zmniejsz gaz
- Space – hamulec
- R – powrót na pas
- Przytrzymaj i przeciągnij myszą – obracanie kamery

## Uwaga
To wczesny prototyp: uproszczona fizyka lotu, proceduralny model samolotu i teren. Muzyka jest prostym, generowanym syntezatorem ambientowym, a nie gotowym utworem lo-fi. Do działania wymagane jest połączenie z internetem, ponieważ Three.js jest pobierany z CDN.
