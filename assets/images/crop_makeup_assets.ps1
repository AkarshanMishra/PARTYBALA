Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\pc\OneDrive\Desktop\PARTY BALA FORMS\assets\images\makeup-design-reference.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)
$w = $img.Width
$h = $img.Height
Write-Host "Makeup Reference Dimensions: $w x $h"

function Crop-Image($xPct, $yPct, $wPct, $hPct, $outName) {
    $rect = New-Object System.Drawing.Rectangle(
        [int]($w * $xPct),
        [int]($h * $yPct),
        [int]($w * $wPct),
        [int]($h * $hPct)
    )
    $bmp = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $rect.Width, $rect.Height)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $outPath = "c:\Users\pc\OneDrive\Desktop\PARTY BALA FORMS\assets\images\$outName"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Saved: $outPath ($($rect.Width)x$($rect.Height))"
}

# 1. Hero Bride: approx x: 50% to 100%, y: 5.8% to 50%
Crop-Image 0.500 0.058 0.500 0.440 "hero-makeup-bride.jpg"

# 2. Rosette Gold Badge: approx x: 77% to 99%, y: 32.5% to 46.5%
Crop-Image 0.770 0.325 0.220 0.140 "makeup-gold-badge.jpg"

# 3. Five Service Cards (y is approx 52.5% to 69.5%)
# Card 1: Bridal Makeup (approx x: 2% to 21%)
Crop-Image 0.020 0.525 0.190 0.170 "service-bridal.jpg"

# Card 2: Party Makeup (approx x: 21.5% to 40.5%)
Crop-Image 0.215 0.525 0.190 0.170 "service-party.jpg"

# Card 3: Engagement Makeup (approx x: 41% to 60%)
Crop-Image 0.410 0.525 0.190 0.170 "service-engagement.jpg"

# Card 4: Pre-Wedding Shoot Makeup (approx x: 60.5% to 79.5%)
Crop-Image 0.605 0.525 0.190 0.170 "service-prewedding.jpg"

# Card 5: Simple & Elegant Makeup (approx x: 80% to 99%)
Crop-Image 0.800 0.525 0.190 0.170 "service-elegant.jpg"

# 4. Vanity Brushes & Compact from Banner: approx x: 81% to 100%, y: 79.5% to 92.5%
Crop-Image 0.810 0.795 0.190 0.130 "vanity-brushes.jpg"

$img.Dispose()
