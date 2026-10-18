import sharp from 'sharp';

await sharp('busybatleopard.webp')
    .negate({ alpha: false })
    .modulate({ hue: 180 })
    .webp({ quality: 80 })
    .toFile('busybatleopard-dark.webp');
