# 🚬 CigCounter

Contador diario de cigarrillos. Lo abrís desde el celular, tocás un botón cada
vez que fumás, y con un toque sincronizás todo a este repo de GitHub. Después,
desde la computadora (o desde Claude Code), hacés `git pull` y analizás los datos.

## Cómo funciona

```
[Celular]  tocás "Fumé uno"  →  se guarda al instante (local, offline)
                ↓  botón "Sincronizar"
        se guarda en GitHub  →  data/cigarettes.csv
                ↓  git pull
[Computadora / Claude Code]  →  análisis de los datos
```

- **Registro local:** cada cigarrillo se guarda en el navegador del celular
  (localStorage), así que funciona sin internet.
- **Sincronización:** el botón "Sincronizar" escribe los registros en
  `data/cigarettes.csv` usando la API de GitHub. Hace *merge por ID*, así que
  ni el celular ni ediciones desde la compu se pisan entre sí.

## Puesta en marcha (una sola vez)

### 1. Publicar en GitHub Pages
1. En el repo: **Settings → Pages**.
2. En **Source** elegí la rama (ej. `main`) y carpeta `/ (root)`.
3. Guardá. En un ratito la app queda en `https://pele-grunwaldt.github.io/cigcounter/`.

### 2. Generar un token de GitHub (gratis)
1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
   → **Fine-grained tokens** → **Generate new token**.
2. **Repository access:** *Only select repositories* → `cigcounter`.
3. **Permissions → Repository permissions → Contents:** *Read and write*.
4. Generalo y copialo (no se vuelve a mostrar).

### 3. Configurar la app en el celular
1. Abrí la URL de GitHub Pages en el celular.
2. (Opcional) *Agregar a pantalla de inicio* para que quede como una app.
3. Tocá el engranaje ⚙️ y completá owner, repo, branch, ruta y **pegá el token**.
   El token se guarda solo en tu celular, nunca se sube al repo.

## Formato de datos (`data/cigarettes.csv`)

| columna    | ejemplo                     | descripción                          |
|------------|-----------------------------|--------------------------------------|
| `id`       | `lz3k9a2b`                  | id único de cada cigarrillo          |
| `timestamp`| `2026-07-20T15:04:05-03:00` | fecha y hora locales (ISO 8601)      |
| `date`     | `2026-07-20`               | fecha local (para agrupar por día)   |
| `time`     | `15:04:05`                 | hora local                           |

## Análisis desde la computadora / Claude Code

```bash
git pull

# cigarrillos por día
cut -d, -f3 data/cigarettes.csv | tail -n +2 | sort | uniq -c
```

O pedile a Claude Code directamente: *"analizá cuántos cigarrillos fumé por día
esta semana"*.
