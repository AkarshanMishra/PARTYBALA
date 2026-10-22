Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\pc\OneDrive\Desktop\PARTY BALA FORMS\assets\images\mehndi-design-reference.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)
$w = $img.Width
$h = $img.Height
Write-Host "Source Image Size: $w x $h"

# Helper to crop a rectangle and save
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

# 1. Traditional Mehndi Card: approximately x: 2.8% to 26%, y: 68% to 81%
Crop-Image 0.028 0.680 0.230 0.125 "style-traditional.jpg"

# 2. Arabic Mehndi Card: approximately x: 26.8% to 50%, y: 68% to 81%
Crop-Image 0.268 0.680 0.230 0.125 "style-arabic.jpg"

# 3. Bridal Mehndi Card: approximately x: 50.8% to 74%, y: 68% to 81%
Crop-Image 0.508 0.680 0.230 0.125 "style-bridal.jpg"

# 4. Modern & Minimal Card: approximately x: 74.5% to 97.5%, y: 68% to 81%
Crop-Image 0.745 0.680 0.230 0.125 "style-minimal.jpg"

# 5. Hero Right Henna Hand artwork: approximately x: 48% to 100%, y: 5.5% to 51.5%
Crop-Image 0.480 0.055 0.520 0.460 "hero-mehndi-hand.jpg"

# 6. Gold Badge "Traditional to Trendy": approximately x: 78% to 99%, y: 38% to 51%
Crop-Image 0.780 0.380 0.210 0.130 "gold-badge.jpg"

$img.Dispose()
