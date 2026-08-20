# SQLite databases

`bootstrap-content.sqlite` is the versioned baseline for a clean installation.

- A new local or Docker installation copies it to the configured writable database path.
- An existing writable database is never overwritten.
- The bundled copy also provides read-only site content such as menus, pages, news, events and policies.
- Future structural changes to an existing production database still require an explicit migration and backup.

Do not edit the runtime database in `.data/` or the Docker volume as part of a build.
