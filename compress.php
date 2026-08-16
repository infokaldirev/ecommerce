<?php
// compress.php
// A local image compressor using PHP's native GD library to compress product images.
// Run this script locally using: php compress.php

$dir = __DIR__ . '/public/products';
if (!is_dir($dir)) {
    echo "Directory not found: $dir\n";
    exit(1);
}

$files = scandir($dir);
echo "Scanning products folder for heavy images...\n";

foreach ($files as $file) {
    if ($file === '.' || $file === '..') continue;
    $filePath = $dir . '/' . $file;
    if (!is_file($filePath)) continue;

    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    if ($ext !== 'png' && $ext !== 'jpg' && $ext !== 'jpeg') continue;

    $originalSize = filesize($filePath);
    // Only compress if size is larger than 100 KB
    if ($originalSize < 100000) {
        continue;
    }

    echo "Compressing $file (" . round($originalSize / 1024, 1) . " KB)... ";

    if ($ext === 'png') {
        $img = @imagecreatefrompng($filePath);
    } else {
        $img = @imagecreatefromjpeg($filePath);
    }

    if (!$img) {
        echo "Failed to load image structure.\n";
        continue;
    }

    $width = imagesx($img);
    $height = imagesy($img);

    // Limit maximum dimension to 600px
    $maxDim = 600;
    if ($width > $maxDim || $height > $maxDim) {
        if ($width > $height) {
            $newHeight = (int)round(($height * $maxDim) / $width);
            $newWidth = $maxDim;
        } else {
            $newWidth = (int)round(($width * $maxDim) / $height);
            $newHeight = $maxDim;
        }
        
        $resizedImg = imagecreatetruecolor($newWidth, $newHeight);
        
        // Preserve alpha transparency for PNG
        if ($ext === 'png') {
            imagealphablending($resizedImg, false);
            imagesavealpha($resizedImg, true);
        }
        
        imagecopyresampled($resizedImg, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($img);
        $img = $resizedImg;
    }

    $success = false;
    if ($ext === 'png') {
        // PNG compression level (0-9). 9 is maximum compression.
        $success = imagepng($img, $filePath, 9);
    } else {
        // JPEG quality (0-100). 75 is visually identical but extremely small.
        $success = imagejpeg($img, $filePath, 75);
    }

    if ($success) {
        clearstatcache();
        $newSize = filesize($filePath);
        echo "Done! -> " . round($newSize / 1024, 1) . " KB (Saved " . round((1 - ($newSize / $originalSize)) * 100) . "%)\n";
    } else {
        echo "Failed to write back optimized file.\n";
    }
    
    imagedestroy($img);
}

echo "All images processed!\n";
