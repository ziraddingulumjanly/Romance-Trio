from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
root=Path(__file__).parent/'public/images'
root.mkdir(parents=True,exist_ok=True)
im=Image.open('/mnt/data/image(20261015-132515).png').convert('RGBA')
# A reference-based scenic hero without the overlaid reference interface lettering.
W,H=1672,302
canvas=Image.new('RGBA',(W,H),(255,255,255,0))
for xstart,xend,side in [(0,464,'left'),(1212,W,'right')]:
  crop=im.crop((xstart,63,xend,365)).convert('RGBA')
  pix=crop.load(); cw,ch=crop.size
  for x in range(cw):
    frac=x/cw if side=='left' else (cw-1-x)/cw
    alpha=round(255*(1-min(1,max(0,(frac-.68)/.32)))**1.5)
    for y in range(ch):
      r,g,b,_=pix[x,y];pix[x,y]=(r,g,b,alpha)
  canvas.alpha_composite(crop,(xstart,0))
canvas.save(root/'hero-city.png', optimize=True)
# six photographed scene slivers retained from the chosen visual reference
positions=[(94,329),(344,579),(592,827),(842,1079),(1093,1330),(1345,1580)]
for name,(x0,x1) in zip(['travel','food','family','school','shopping','daily'],positions):
  crop=im.crop((x0,831,x1,894)).convert('RGB')
  # high-quality upscaling for card background texture
  crop=crop.resize((700,184),Image.Resampling.LANCZOS)
  crop.save(root/f'{name}.jpg',quality=91,optimize=True)
# tiny illustration from reference, for example vocabulary preview
im.crop((210,585,343,674)).resize((370,248),Image.Resampling.LANCZOS).convert('RGB').save(root/'house.jpg',quality=92)
# House photo might contain text boundary; crop content only, fallback in UI.
# Three colored arches, simple favicon matching first chosen logo direction
S=512
icon=Image.new('RGBA',(S,S),(0,0,0,0));d=ImageDraw.Draw(icon)
cols=[(35,121,232,255),(26,159,100,255),(229,79,72,255)]
for i,c in enumerate(cols):
 x=54+i*137;y=120 if i!=1 else 84
 d.rounded_rectangle((x,y,x+128,425),radius=64,fill=c)
 d.rectangle((x,y+66,x+128,425),fill=c)
# subtle center spine on green
icon.save(Path(__file__).parent/'public'/'icon.png',optimize=True)
icon.resize((64,64),Image.Resampling.LANCZOS).save(Path(__file__).parent/'public'/'favicon.png')
print('Assets created',list(root.iterdir()))
