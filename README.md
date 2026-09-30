# el-nino-dashboard
El Niño in Coastal California: Data &amp; Visualization Dashboard

## Authenticated PMEL moorings

The shore-station archive build also downloads CCE1 and CCE2 SST observations from
PMEL. Each source has distinct credentials; set these environment variables before
running `npm run build:shore-station-data`:

- `PMEL_CCE1_USERNAME`
- `PMEL_CCE1_PASSWORD`
- `PMEL_CCE2_USERNAME`
- `PMEL_CCE2_PASSWORD`

For GitHub Actions, save all four values as repository Actions secrets with the
same names and pass them to the build step. Do not commit their values to this
repository.

CCE1 and CCE2 are downloaded only from their configured authenticated PMEL ASCII
URLs; they do not use ERDDAP.
