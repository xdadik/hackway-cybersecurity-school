# Generates the website logo assets from the source image in /logo.
# Requires Windows PowerShell (System.Drawing / GDI+).
param(
  [string]$Source = (Join-Path $PSScriptRoot "..\logo\Gemini_Generated_Image_qyquhwqyquhwqyqu.jpg"),
  [string]$OutputDir = (Join-Path $PSScriptRoot "..\public\logo")
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$generator = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class HackwayLogo
{
    public static void Generate(string inputPath, string outputDir)
    {
        System.IO.Directory.CreateDirectory(outputDir);

        using (var source = new Bitmap(inputPath))
        {
            Rectangle bounds = FindContentBounds(source);

            using (var cropped = source.Clone(bounds, PixelFormat.Format32bppArgb))
            using (var logo = new Bitmap(cropped.Width, cropped.Height, PixelFormat.Format32bppArgb))
            {
                BuildTransparentLogo(cropped, logo);
                logo.Save(System.IO.Path.Combine(outputDir, "hackway-logo.png"), ImageFormat.Png);
                BuildOpenGraph(logo, System.IO.Path.Combine(outputDir, "hackway-og.png"));
                BuildMark(logo, System.IO.Path.Combine(outputDir, "hackway-mark.png"), 512, 380, 96);
                BuildMark(logo, System.IO.Path.Combine(outputDir, "hackway-apple.png"), 180, 132, 40);
            }
        }
    }

    static Rectangle FindContentBounds(Bitmap bitmap)
    {
        int minX = bitmap.Width;
        int minY = bitmap.Height;
        int maxX = -1;
        int maxY = -1;

        for (int y = 0; y < bitmap.Height; y++)
        {
            for (int x = 0; x < bitmap.Width; x++)
            {
                Color color = bitmap.GetPixel(x, y);
                int max = Math.Max(color.R, Math.Max(color.G, color.B));
                int min = Math.Min(color.R, Math.Min(color.G, color.B));
                bool isGreen = color.G > color.R + 18 && color.G > color.B + 18 && color.G > 60;
                bool isDark = max < 232;

                if (!isGreen && !isDark) continue;

                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }

        if (maxX < 0) throw new InvalidOperationException("No logo content found in source image.");

        int padding = 12;
        minX = Math.Max(0, minX - padding);
        minY = Math.Max(0, minY - padding);
        maxX = Math.Min(bitmap.Width - 1, maxX + padding);
        maxY = Math.Min(bitmap.Height - 1, maxY + padding);

        return Rectangle.FromLTRB(minX, minY, maxX + 1, maxY + 1);
    }

    static void BuildTransparentLogo(Bitmap source, Bitmap target)
    {
        for (int y = 0; y < source.Height; y++)
        {
            for (int x = 0; x < source.Width; x++)
            {
                Color color = source.GetPixel(x, y);
                int max = Math.Max(color.R, Math.Max(color.G, color.B));
                int min = Math.Min(color.R, Math.Min(color.G, color.B));
                int saturation = max - min;

                if (color.G > color.R + 18 && color.G > color.B + 18 && color.G > 60)
                {
                    int alpha = Math.Min(255, Math.Max(0, (saturation - 6) * 4));
                    if (alpha > 8)
                    {
                        target.SetPixel(x, y, Color.FromArgb(alpha, color.R, color.G, color.B));
                    }
                    continue;
                }

                int luminance = (color.R * 299 + color.G * 587 + color.B * 114) / 1000;
                int neutralAlpha = 255 - luminance;
                if (neutralAlpha < 10) continue;

                target.SetPixel(x, y, Color.FromArgb(neutralAlpha, 255, 255, 255));
            }
        }
    }

    static void BuildOpenGraph(Bitmap logo, string path)
    {
        const int width = 1200;
        const int height = 630;
        const int logoWidth = 760;

        using (var bitmap = new Bitmap(width, height, PixelFormat.Format32bppArgb))
        using (var graphics = Graphics.FromImage(bitmap))
        {
            graphics.Clear(Color.Black);
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.SmoothingMode = SmoothingMode.AntiAlias;
            graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;

            int logoHeight = (int)Math.Round(logo.Height * (logoWidth / (double)logo.Width));
            int left = (width - logoWidth) / 2;
            int top = (height - logoHeight) / 2 - 34;

            graphics.DrawImage(logo, new Rectangle(left, top, logoWidth, logoHeight));

            using (var font = new Font("Segoe UI", 21, FontStyle.Regular, GraphicsUnit.Pixel))
            using (var brush = new SolidBrush(Color.FromArgb(161, 161, 170)))
            using (var format = new StringFormat { Alignment = StringAlignment.Center })
            {
                graphics.DrawString(
                    "ONLINE CYBERSECURITY EDUCATION",
                    font,
                    brush,
                    new RectangleF(0, top + logoHeight + 38, width, 36),
                    format
                );
            }

            bitmap.Save(path, ImageFormat.Png);
        }
    }

    static void BuildMark(Bitmap logo, string path, int size, int logoWidth, int radius)
    {
        using (var bitmap = new Bitmap(size, size, PixelFormat.Format32bppArgb))
        using (var graphics = Graphics.FromImage(bitmap))
        {
            graphics.SmoothingMode = SmoothingMode.AntiAlias;
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.Clear(Color.Transparent);

            using (var rounded = RoundedRectangle(new Rectangle(0, 0, size, size), radius))
            using (var brush = new SolidBrush(Color.Black))
            {
                graphics.FillPath(brush, rounded);
            }

            int logoHeight = (int)Math.Round(logo.Height * (logoWidth / (double)logo.Width));
            int left = (size - logoWidth) / 2;
            int top = (size - logoHeight) / 2;

            graphics.DrawImage(logo, new Rectangle(left, top, logoWidth, logoHeight));
            bitmap.Save(path, ImageFormat.Png);
        }
    }

    static GraphicsPath RoundedRectangle(Rectangle bounds, int radius)
    {
        int diameter = radius * 2;
        var path = new GraphicsPath();
        path.AddArc(bounds.X, bounds.Y, diameter, diameter, 180, 90);
        path.AddArc(bounds.Right - diameter, bounds.Y, diameter, diameter, 270, 90);
        path.AddArc(bounds.Right - diameter, bounds.Bottom - diameter, diameter, diameter, 0, 90);
        path.AddArc(bounds.X, bounds.Bottom - diameter, diameter, diameter, 90, 90);
        path.CloseFigure();
        return path;
    }
}
"@

Add-Type -TypeDefinition $generator -ReferencedAssemblies System.Drawing

$sourcePath = (Resolve-Path -LiteralPath $Source).Path
$outputPath = [System.IO.Path]::GetFullPath($OutputDir)
[HackwayLogo]::Generate($sourcePath, $outputPath)

Get-ChildItem -LiteralPath $outputPath | Select-Object Name, Length
