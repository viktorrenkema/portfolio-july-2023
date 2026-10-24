"""Stitch the unmodified 800x800 source and estimated-camera render for review."""
from pathlib import Path
from PIL import Image, ImageDraw
root = Path(__file__).resolve().parents[1]
photo = Image.open(root / 'docs/reference.jpg').convert('RGB')
model = Image.open(root / 'docs/screenshots/matched-perspective.png').convert('RGB')
assert photo.size == model.size == (800, 800), (photo.size, model.size)
image = Image.new('RGB', (1616, 840), '#ffffff')
draw = ImageDraw.Draw(image)
draw.text((18, 14), 'Maze source photo / oak / original product', fill='#52634b')
draw.text((834, 14), 'Parametric model / birch approximation / estimated camera', fill='#52634b')
image.paste(photo, (0,40))
image.paste(model, (816,40))
image.save(root / 'docs/screenshots/comparison.png')
print(root / 'docs/screenshots/comparison.png')
