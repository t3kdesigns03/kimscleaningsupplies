# Download the original product photos from the old Squarespace CDN into
# images\products\.  Right-click this file > Run with PowerShell.
# Safe to re-run: files you already have are skipped.

$ErrorActionPreference = 'Continue'
Set-Location (Split-Path $PSScriptRoot -Parent)
New-Item -ItemType Directory -Force -Path 'images\products' | Out-Null

$base = 'https://147458827.cdn6.editmysite.com/uploads/1/4/7/4/147458827'

$files = @(
  '3WE6ZFHZ6L3CZCJ5ADX3BIEV.png',
  'V7KMXPSLGQLGOUUUODTY4CCT.png',
  'FCECSWD3IWVIL2JEHUPIU3TD.png',
  'HC7I2N6D6JKVRNEZ23RJFP3H.png',
  '4EK5OKNWSGAVNIT6IBLVE3WH.png',
  'MNF2D7WSEOHZVSSTYYJYV7MH.png',
  'A5ATN4JPJJTKB4DQ6JN2RB5O.png',
  '64NIUDQLZU4JRFFW6BYDZAFV.png',
  'SVNVXTDAXJJ5GE4MLVIO3B3P.png',
  'ULZJVS362RKARQVRIEXAHGYC.png',
  'QNVEEZAQVYGZJ5M4YW6UHQNE.png',
  'B4JFA4NLXALZ2332BWL6TGEW.png',
  'QD5PPQDRZV6HTAFM6QXVLAI4.png'
)

$got = 0; $had = 0; $missing = 0
foreach ($f in $files) {
  $out = "images\products\$f"
  if ((Test-Path $out) -and ((Get-Item $out).Length -gt 0)) {
    Write-Host "have    $f"; $had++; continue
  }
  try {
    Invoke-WebRequest -Uri "$base/$f" -OutFile $out -UseBasicParsing
    Write-Host "got     $f" -ForegroundColor Green; $got++
  } catch {
    if (Test-Path $out) { Remove-Item $out -Force }
    Write-Host "MISSING $f (skipping)" -ForegroundColor Yellow; $missing++
  }
}

Write-Host ''
Write-Host "downloaded $got, already had $had, missing $missing"
Write-Host 'Refresh the site - the real photos take over on their own.'
Read-Host 'Press Enter to close'
