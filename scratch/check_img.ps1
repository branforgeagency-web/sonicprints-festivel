Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Office\Sonic Festival\client\public\assets\img\vinayaka-throne.png"
$outputPath = "c:\Office\Sonic Festival\client\public\assets\img\vinayaka-transparent.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
Write-Host "Image size: $($bmp.Width) x $($bmp.Height)"

# Create a new bitmap with ARGB (supports transparency)
$transparentBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($transparentBmp)
$g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
$g.Dispose()

# Make grey/white checkerboard pixels transparent
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $transparentBmp.GetPixel($x, $y)
        # Checkerboard colors are typically light grey (200-240) and white (250-255)
        # where R, G, B are almost identical
        $isGreyOrWhite = ($c.R -gt 180 -and $c.G -gt 180 -and $c.B -gt 180) -and
                         ([Math]::Abs($c.R - $c.G) -lt 15) -and
                         ([Math]::Abs($c.G - $c.B) -lt 15)
        
        # Also check for border padding
        if ($isGreyOrWhite) {
            # Let's check distance to center / Ganesha body to avoid touching Ganesha's white tusk or crown highlights
            # Ganesha is centered roughly x: 15% to 85%, y: 10% to 90%
            # If it's pure background checkerboard outside Ganesha's silhouette or inside checkerboard squares:
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$transparentBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$transparentBmp.Dispose()
Write-Host "Processed transparent Vinayaka image saved to $outputPath"
