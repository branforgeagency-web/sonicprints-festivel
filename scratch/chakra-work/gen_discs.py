# -*- coding: utf-8 -*-
"""Generate seamless, radially-symmetric mandala chakra discs as SVG.

Each disc is transparent outside its rim, perfectly centred on 500,500 and
fully rotation-symmetric, so a CSS spin looks continuous and never wobbles.
Palettes are sampled from the product photography for each design.
"""
import math, os, io

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..",
                   "client", "public", "assets", "img", "chakra")
OUT = os.path.normpath(OUT)
os.makedirs(OUT, exist_ok=True)

C = 500.0  # centre


def P(r, deg):
    a = math.radians(deg - 90.0)
    return (C + r * math.cos(a), C + r * math.sin(a))


def f(v):
    return ("%.2f" % v).rstrip("0").rstrip(".")


def pt(r, deg):
    x, y = P(r, deg)
    return "%s %s" % (f(x), f(y))


# ---------------------------------------------------------------- primitives
def annulus(r0, r1, fill, extra=""):
    """Ring filled with `fill` (even-odd donut)."""
    return ('<path fill-rule="evenodd" fill="%s" %s d="M %s A %s %s 0 1 1 %s A %s %s 0 1 1 %s Z '
            'M %s A %s %s 0 1 0 %s A %s %s 0 1 0 %s Z"/>') % (
        fill, extra,
        pt(r1, 0), f(r1), f(r1), pt(r1, 180), f(r1), f(r1), pt(r1, 360),
        pt(r0, 0), f(r0), f(r0), pt(r0, 180), f(r0), f(r0), pt(r0, 360))


def ring_line(r, stroke, w, extra=""):
    return '<circle cx="500" cy="500" r="%s" fill="none" stroke="%s" stroke-width="%s" %s/>' % (
        f(r), stroke, f(w), extra)


def petal(r0, r1, half_w, deg, fill, stroke=None, sw=1.2, sharp=0.55, belly=0.42, extra=""):
    """One outward-pointing petal, drawn in polar space then emitted as a path."""
    L = r1 - r0
    aw = math.degrees(math.atan2(half_w, (r0 + r1) / 2.0))
    d = "M %s C %s %s %s C %s %s %s Z" % (
        pt(r0, deg),
        pt(r0 + L * belly, deg - aw), pt(r1 - L * sharp * 0.45, deg - aw * 0.42), pt(r1, deg),
        pt(r1 - L * sharp * 0.45, deg + aw * 0.42), pt(r0 + L * belly, deg + aw), pt(r0, deg))
    s = '<path d="%s" fill="%s"' % (d, fill)
    if stroke:
        s += ' stroke="%s" stroke-width="%s" stroke-linejoin="round"' % (stroke, f(sw))
    return s + " " + extra + "/>"


def petal_ring(n, r0, r1, half_w, fill, stroke=None, phase=0.0, **kw):
    step = 360.0 / n
    return "".join(petal(r0, r1, half_w, phase + i * step, fill, stroke, **kw) for i in range(n))


def bead_ring(n, r, rad, fill, phase=0.0, extra=""):
    out = []
    for i in range(n):
        x, y = P(r, phase + i * 360.0 / n)
        out.append('<circle cx="%s" cy="%s" r="%s" fill="%s" %s/>' % (f(x), f(y), f(rad), fill, extra))
    return "".join(out)


def ray_ring(n, r0, r1, w0, w1, fill, phase=0.0, extra=""):
    out = []
    step = 360.0 / n
    for i in range(n):
        a = phase + i * step
        a0 = math.degrees(math.atan2(w0 / 2.0, r0))
        a1 = math.degrees(math.atan2(w1 / 2.0, r1))
        d = "M %s L %s L %s L %s Z" % (pt(r0, a - a0), pt(r1, a - a1), pt(r1, a + a1), pt(r0, a + a0))
        out.append('<path d="%s" fill="%s" %s/>' % (d, fill, extra))
    return "".join(out)


def diamond_ring(n, r0, r1, half_w, fill, phase=0.0, stroke=None, sw=1.0):
    out = []
    step = 360.0 / n
    rm = (r0 + r1) / 2.0
    aw = math.degrees(math.atan2(half_w, rm))
    for i in range(n):
        a = phase + i * step
        d = "M %s L %s L %s L %s Z" % (pt(r0, a), pt(rm, a - aw), pt(r1, a), pt(rm, a + aw))
        s = '<path d="%s" fill="%s"' % (d, fill)
        if stroke:
            s += ' stroke="%s" stroke-width="%s"' % (stroke, f(sw))
        out.append(s + "/>")
    return "".join(out)


def scallop_ring(n, r, rad, fill, phase=0.0, stroke=None, sw=1.0):
    out = []
    for i in range(n):
        x, y = P(r, phase + i * 360.0 / n)
        s = '<circle cx="%s" cy="%s" r="%s" fill="%s"' % (f(x), f(y), f(rad), fill)
        if stroke:
            s += ' stroke="%s" stroke-width="%s"' % (stroke, f(sw))
        out.append(s + "/>")
    return "".join(out)


def teardrop_ring(n, r0, r1, half_w, fill, stroke=None, phase=0.0, sw=1.2):
    """Rounded (paisley-ish) petal ring - fatter and blunter than `petal`."""
    return petal_ring(n, r0, r1, half_w, fill, stroke, phase=phase, sharp=0.2, belly=0.55, sw=sw)


def curl_ring(n, r0, r1, fill, phase=0.0, sw=3.0):
    """Thin filigree scroll ring - decorative strokes, no fill."""
    out = []
    step = 360.0 / n
    for i in range(n):
        a = phase + i * step
        d = "M %s C %s %s %s" % (pt(r0, a - step * 0.42), pt(r1, a - step * 0.30),
                                 pt(r1, a + step * 0.30), pt(r0, a + step * 0.42))
        out.append('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="round"/>'
                   % (d, fill, f(sw)))
    return "".join(out)


# ---------------------------------------------------------------- defs block
def defs(p):
    return """<defs>
 <radialGradient id="plate" gradientUnits="userSpaceOnUse" cx="500" cy="430" r="620">
  <stop offset="0" stop-color="%(plate1)s"/>
  <stop offset=".62" stop-color="%(plate2)s"/>
  <stop offset="1" stop-color="%(plate3)s"/>
 </radialGradient>
 <radialGradient id="gold" gradientUnits="userSpaceOnUse" cx="500" cy="405" r="600">
  <stop offset="0" stop-color="%(g1)s"/>
  <stop offset=".45" stop-color="%(g2)s"/>
  <stop offset=".78" stop-color="%(g3)s"/>
  <stop offset="1" stop-color="%(g4)s"/>
 </radialGradient>
 <radialGradient id="goldHi" gradientUnits="userSpaceOnUse" cx="500" cy="380" r="560">
  <stop offset="0" stop-color="%(g1)s"/>
  <stop offset=".55" stop-color="%(g1)s"/>
  <stop offset="1" stop-color="%(g3)s"/>
 </radialGradient>
 <radialGradient id="accent" gradientUnits="userSpaceOnUse" cx="500" cy="420" r="600">
  <stop offset="0" stop-color="%(a1)s"/>
  <stop offset="1" stop-color="%(a2)s"/>
 </radialGradient>
 <radialGradient id="lamp" cx="50%%" cy="50%%" r="50%%">
  <stop offset="0" stop-color="#fffdf2" stop-opacity=".95"/>
  <stop offset=".35" stop-color="%(glow)s" stop-opacity=".8"/>
  <stop offset="1" stop-color="%(glow)s" stop-opacity="0"/>
 </radialGradient>
 <radialGradient id="halo" cx="50%%" cy="50%%" r="50%%">
  <stop offset=".55" stop-color="%(glow)s" stop-opacity="0"/>
  <stop offset=".82" stop-color="%(glow)s" stop-opacity=".38"/>
  <stop offset=".96" stop-color="%(glow)s" stop-opacity=".10"/>
  <stop offset="1" stop-color="%(glow)s" stop-opacity="0"/>
 </radialGradient>
 <filter id="bevel" x="-12%%" y="-12%%" width="124%%" height="124%%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>
  <feSpecularLighting in="b" surfaceScale="4.5" specularConstant=".62" specularExponent="17"
      lighting-color="#fff6df" result="s"><fePointLight x="-2200" y="-3600" z="4200"/></feSpecularLighting>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="so"/>
  <feComposite in="SourceGraphic" in2="so" operator="arithmetic" k1="0" k2="1" k3=".9" k4="0"/>
 </filter>
 <filter id="soft" x="-30%%" y="-30%%" width="160%%" height="160%%">
  <feGaussianBlur stdDeviation="9"/>
 </filter>
 <filter id="tiny" x="-60%%" y="-60%%" width="220%%" height="220%%">
  <feGaussianBlur stdDeviation="4"/>
 </filter>
</defs>""" % p


def wrap(body, p):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" '
            'height="1000" role="img" aria-label="%s rotating chakra disc">%s%s</svg>'
            % (p["label"], defs(p), body))


def write(name, body, p):
    path = os.path.join(OUT, name + ".svg")
    with io.open(path, "w", encoding="utf-8") as fh:
        fh.write(wrap(body, p))
    print("wrote", path, os.path.getsize(path), "bytes")


# ------------------------------------------------------------------ palettes
PREMIUM = dict(label="Premium Circle", plate1="#4A2E18", plate2="#33200F", plate3="#1E1208",
               g1="#FFF0C4", g2="#F0CE84", g3="#C89A45", g4="#8E6421",
               a1="#5C3A1C", a2="#2A1A0C", glow="#F6C766")
LOTUS   = dict(label="Lotus Chakra", plate1="#3A2412", plate2="#241608", plate3="#140C05",
               g1="#FFEFC0", g2="#F3CE80", g3="#CE9C41", g4="#8A5F1E",
               a1="#7A2E18", a2="#3D1608", glow="#FFC661")
TEMPLE  = dict(label="Temple Aura", plate1="#4B331C", plate2="#2E1E0F", plate3="#170E06",
               g1="#FFEDBE", g2="#E8C67C", g3="#BE8F3D", g4="#7E571C",
               a1="#5A3A1A", a2="#26160A", glow="#EDB95C")
FLORAL  = dict(label="Floral Mandala", plate1="#6E2415", plate2="#4A1509", plate3="#280A04",
               g1="#FFF1CB", g2="#F2D08A", g3="#CB9B4A", g4="#8B6023",
               a1="#B33C1A", a2="#6B1E0C", glow="#F8B15C")
MOON    = dict(label="Crescent Moon", plate1="#5A4020", plate2="#3A2710", plate3="#1D1307",
               g1="#FFF6DA", g2="#F6DA9C", g3="#D2A85A", g4="#95702C",
               a1="#6E4E22", a2="#2C1D0B", glow="#FFD98A")


def base_plate(rim=480, plate=452):
    """Shared backing: soft halo, gold rim, recessed plate."""
    return "".join([
        '<circle cx="500" cy="500" r="498" fill="url(#halo)"/>',
        '<circle cx="500" cy="500" r="%s" fill="url(#gold)" filter="url(#bevel)"/>' % f(rim),
        '<circle cx="500" cy="500" r="%s" fill="url(#plate)"/>' % f(plate),
    ])


def star(cx, cy, r, fill, points=5, inner=0.42, rot=0.0):
    pts = []
    for i in range(points * 2):
        rr = r if i % 2 == 0 else r * inner
        a = math.radians(rot + i * (180.0 / points) - 90.0)
        pts.append("%s,%s" % (f(cx + rr * math.cos(a)), f(cy + rr * math.sin(a))))
    return '<polygon points="%s" fill="%s"/>' % (" ".join(pts), fill)


# ------------------------------------------------------------- 1. premium circle
def premium():
    p = PREMIUM
    b = [base_plate(480, 450)]
    b.append(ring_line(462, "url(#goldHi)", 7))
    b.append(petal_ring(36, 408, 452, 19, "url(#gold)", stroke=p["g4"], sw=1.1,
                        sharp=0.5, belly=0.4))
    b.append(bead_ring(36, 400, 4.6, p["g1"], phase=5))
    b.append(annulus(372, 396, "url(#accent)"))
    b.append(curl_ring(24, 374, 396, p["g2"], sw=3.4))
    b.append(ring_line(370, p["g3"], 2.6))
    b.append(ring_line(398, p["g3"], 2.6))
    b.append(petal_ring(24, 268, 362, 34, "url(#gold)", stroke=p["g4"], sw=1.3,
                        sharp=0.62, belly=0.36))
    b.append(petal_ring(24, 290, 344, 17, "url(#accent)", phase=0, sharp=0.62, belly=0.36))
    b.append(bead_ring(24, 300, 5.4, p["g1"]))
    b.append(petal_ring(16, 190, 286, 41, "url(#goldHi)", stroke=p["g4"], sw=1.4,
                        phase=11.25, sharp=0.55, belly=0.42))
    b.append(diamond_ring(32, 168, 196, 9, p["g2"]))
    b.append(annulus(150, 168, "url(#accent)"))
    b.append(petal_ring(12, 66, 148, 33, "url(#gold)", stroke=p["g4"], sw=1.2,
                        sharp=0.5, belly=0.45))
    b.append('<circle cx="500" cy="500" r="66" fill="url(#accent)"/>')
    b.append(petal_ring(12, 20, 62, 15, "url(#goldHi)", phase=15))
    b.append('<circle cx="500" cy="500" r="22" fill="url(#gold)"/>')
    b.append('<circle cx="500" cy="500" r="10" fill="%s"/>' % p["g1"])
    b.append('<circle cx="500" cy="500" r="150" fill="url(#lamp)" opacity=".28"/>')
    write("premium-circle", "".join(b), p)


# ---------------------------------------------------------------- 2. lotus chakra
def lotus():
    p = LOTUS
    b = [base_plate(480, 448)]
    # laser-cut scroll border
    b.append(annulus(430, 470, "url(#gold)", 'filter="url(#bevel)"'))
    b.append(curl_ring(28, 434, 468, p["plate3"], sw=5))
    b.append(ring_line(428, p["g3"], 3))
    # warm bulb ring - the LED look from the photograph
    b.append(bead_ring(48, 410, 15, "url(#lamp)"))
    b.append(bead_ring(48, 410, 5.2, "#FFF6DC"))
    b.append(ring_line(392, p["g4"], 2.4))
    # outer pointed lotus, two staggered layers
    b.append(petal_ring(20, 236, 386, 52, "url(#gold)", stroke=p["g4"], sw=1.6,
                        sharp=0.68, belly=0.34))
    b.append(petal_ring(20, 258, 366, 30, "url(#accent)", sharp=0.68, belly=0.34))
    b.append(petal_ring(20, 268, 352, 13, "url(#goldHi)", sharp=0.68, belly=0.34))
    b.append(petal_ring(20, 214, 300, 40, "url(#gold)", stroke=p["g4"], sw=1.3,
                        phase=9, sharp=0.6, belly=0.4))
    b.append(bead_ring(20, 232, 5, p["g1"], phase=9))
    # bulb ring 2
    b.append(bead_ring(32, 202, 11, "url(#lamp)"))
    b.append(bead_ring(32, 202, 4, "#FFF6DC"))
    b.append(ring_line(186, p["g2"], 3.4))
    # inner lotus
    b.append(petal_ring(16, 74, 180, 40, "url(#goldHi)", stroke=p["g4"], sw=1.3,
                        phase=11.25, sharp=0.6, belly=0.42))
    b.append(petal_ring(16, 92, 162, 20, "url(#accent)", phase=11.25, sharp=0.6, belly=0.42))
    # dark hub with the bright pin-light from the photo
    b.append('<circle cx="500" cy="500" r="78" fill="url(#plate)"/>')
    b.append(ring_line(62, p["g3"], 5))
    b.append(ring_line(44, p["g2"], 4))
    b.append('<circle cx="500" cy="500" r="26" fill="url(#gold)"/>')
    b.append('<circle cx="500" cy="500" r="9" fill="#FFFBEC"/>')
    write("lotus-chakra", "".join(b), p)


# ----------------------------------------------------------------- 3. temple aura
def temple():
    p = TEMPLE
    b = [base_plate(480, 452)]
    b.append(ray_ring(48, 396, 470, 20, 7, "url(#gold)"))
    b.append(bead_ring(48, 470, 6, p["g1"]))
    b.append(annulus(360, 396, "url(#accent)"))
    b.append(ring_line(360, p["g3"], 3))
    b.append(ring_line(396, p["g3"], 3))
    b.append(diamond_ring(40, 362, 394, 12, "url(#goldHi)"))
    b.append(bead_ring(40, 378, 3.6, p["plate3"], phase=4.5))
    # gopuram arch band
    b.append(petal_ring(20, 244, 350, 44, "url(#gold)", stroke=p["g4"], sw=1.6,
                        sharp=0.34, belly=0.5))
    b.append(petal_ring(20, 264, 330, 26, "url(#accent)", sharp=0.34, belly=0.5))
    b.append(petal_ring(20, 274, 318, 11, "url(#goldHi)", sharp=0.34, belly=0.5))
    b.append(ring_line(238, p["g2"], 4))
    b.append(annulus(214, 232, "url(#accent)"))
    b.append(curl_ring(30, 216, 232, p["g2"], sw=2.8))
    b.append(ray_ring(60, 140, 210, 9, 3.4, "url(#goldHi)"))
    b.append(ring_line(136, p["g3"], 3.4))
    b.append(petal_ring(12, 46, 132, 32, "url(#gold)", stroke=p["g4"], sw=1.2,
                        sharp=0.45, belly=0.46))
    b.append('<circle cx="500" cy="500" r="48" fill="url(#accent)"/>')
    b.append(bead_ring(12, 34, 6, p["g2"]))
    b.append('<circle cx="500" cy="500" r="18" fill="url(#gold)"/>')
    b.append('<circle cx="500" cy="500" r="7" fill="%s"/>' % p["g1"])
    b.append('<circle cx="500" cy="500" r="180" fill="url(#lamp)" opacity=".22"/>')
    write("temple-aura", "".join(b), p)


# --------------------------------------------------------------- 4. floral mandala
def floral():
    p = FLORAL
    b = [base_plate(480, 450)]
    b.append(scallop_ring(30, 452, 30, "url(#gold)", stroke=p["g4"], sw=1.4))
    b.append(scallop_ring(30, 452, 15, "url(#accent)"))
    b.append('<circle cx="500" cy="500" r="428" fill="url(#gold)" filter="url(#bevel)"/>')
    b.append('<circle cx="500" cy="500" r="404" fill="url(#plate)"/>')
    b.append(teardrop_ring(18, 250, 396, 66, "url(#accent)", stroke=p["g2"], sw=3.2))
    b.append(teardrop_ring(18, 276, 372, 40, "url(#gold)", stroke=p["g4"], sw=1.4))
    b.append(teardrop_ring(18, 296, 350, 19, "url(#accent)"))
    b.append(bead_ring(18, 316, 6, p["g1"]))
    b.append(teardrop_ring(18, 214, 292, 52, "url(#gold)", stroke=p["g4"], sw=1.4, phase=10))
    b.append(teardrop_ring(18, 232, 274, 27, "url(#accent)", phase=10))
    b.append(ring_line(206, p["g2"], 5))
    b.append(annulus(180, 202, "url(#accent)"))
    b.append(curl_ring(24, 182, 202, p["g2"], sw=3))
    b.append(teardrop_ring(14, 62, 174, 44, "url(#goldHi)", stroke=p["g4"], sw=1.4, phase=12.85))
    b.append(teardrop_ring(14, 84, 156, 22, "url(#accent)", phase=12.85))
    b.append('<circle cx="500" cy="500" r="58" fill="url(#accent)"/>')
    b.append(teardrop_ring(14, 16, 54, 16, "url(#gold)"))
    b.append('<circle cx="500" cy="500" r="20" fill="url(#gold)"/>')
    b.append('<circle cx="500" cy="500" r="8" fill="%s"/>' % p["g1"])
    write("floral-mandala", "".join(b), p)


# ---------------------------------------------------------------- 5. crescent moon
MOON_D = dict(label="Crescent Moon", plate1="#4C3316", plate2="#30200C", plate3="#170E05",
              g1="#FFE9B0", g2="#EFC madeup", g3="#B8842F", g4="#6E4A16",
              a1="#5E4018", a2="#241704", glow="#FFCF77")
MOON_D["g2"] = "#EDC271"


def moon():
    """Only the centre turns: the warm gold lotus rosette that nests inside the
    still crescent. Sized so its rim tucks just under the crescent's inner edge."""
    p = MOON_D
    b = ['<circle cx="500" cy="500" r="498" fill="url(#halo)"/>']
    b.append('<circle cx="500" cy="500" r="486" fill="url(#plate)"/>')
    b.append(ring_line(480, p["g4"], 6))
    # fine outer garland
    b.append(petal_ring(44, 414, 474, 18, "url(#gold)", stroke=p["g4"], sw=1,
                        sharp=0.6, belly=0.38))
    b.append(bead_ring(44, 404, 4.6, p["g2"], phase=4.1))
    b.append(ring_line(394, p["g3"], 3))
    # the broad lotus layer that reads from across a room
    b.append(petal_ring(22, 244, 390, 50, "url(#gold)", stroke=p["g4"], sw=1.6,
                        sharp=0.64, belly=0.36))
    b.append(petal_ring(22, 268, 368, 27, "url(#accent)", sharp=0.64, belly=0.36))
    b.append(petal_ring(22, 280, 352, 12, "url(#goldHi)", sharp=0.64, belly=0.36))
    # staggered inner layer
    b.append(petal_ring(22, 214, 312, 38, "url(#goldHi)", stroke=p["g4"], sw=1.2,
                        phase=360.0 / 44, sharp=0.6, belly=0.4))
    b.append(bead_ring(22, 230, 5.2, p["g1"], phase=360.0 / 44))
    b.append(ring_line(204, p["g2"], 4))
    b.append(annulus(178, 200, "url(#accent)"))
    b.append(curl_ring(24, 180, 200, p["g2"], sw=3.2))
    # rosette
    b.append(petal_ring(16, 68, 172, 42, "url(#gold)", stroke=p["g4"], sw=1.3,
                        phase=11.25, sharp=0.58, belly=0.42))
    b.append(petal_ring(16, 90, 152, 21, "url(#accent)", phase=11.25, sharp=0.58, belly=0.42))
    b.append('<circle cx="500" cy="500" r="72" fill="url(#accent)"/>')
    b.append(bead_ring(16, 60, 5, p["g2"]))
    b.append(petal_ring(8, 16, 54, 18, "url(#goldHi)", phase=22.5))
    b.append('<circle cx="500" cy="500" r="19" fill="url(#gold)"/>')
    b.append('<circle cx="500" cy="500" r="7.5" fill="#FFFDF0"/>')
    b.append('<circle cx="500" cy="500" r="250" fill="url(#lamp)" opacity=".24"/>')
    write("crescent-moon", "".join(b), p)


# ------------------------------------------------- crescent moon: still frame
# Authored so the rotating disc's centre lands on (500,500) with radius RD.
# Everything else is derived, so the crescent always hugs the disc exactly.
RD = 340.0            # rotating disc radius, in frame units
C1 = (500.0, 500.0)   # outer circle of the crescent
R1 = 495.0
DX = 108.3            # how far the bite is offset to the right
R2 = 454.3
C2 = (C1[0] + DX, C1[1])
LED = RD - 4.0        # the warm ring that outlines the turning centre


def _pc(c, r, phi_deg):
    phi = math.radians(phi_deg)
    return (c[0] + r * math.cos(phi), c[1] + r * math.sin(phi))


def _fp(xy):
    return "%s %s" % (f(xy[0]), f(xy[1]))


def _inner_r(phi_deg):
    """Distance from C1 out to the crescent's bitten inner edge along `phi`."""
    phi = math.radians(phi_deg)
    s = DX * math.sin(phi)
    return DX * math.cos(phi) + math.sqrt(max(R2 * R2 - s * s, 0.0))


def crescent(cx, cy, R, bite=0.92, off=0.40, rot=0.0):
    """A crescent of outer radius R, opening towards `rot` degrees."""
    r = R * bite
    d = R * off
    ca = (d * d + R * R - r * r) / (2 * d * R)
    ca = max(-1.0, min(1.0, ca))
    a = math.degrees(math.acos(ca))
    t1 = _pc((cx, cy), R, rot - a)
    t2 = _pc((cx, cy), R, rot + a)
    return "M %s A %s %s 0 1 0 %s A %s %s 0 1 1 %s Z" % (
        _fp(t1), f(R), f(R), _fp(t2), f(r), f(r), _fp(t1))


def crescent_frame():
    p = MOON_D
    a_tip = math.degrees(math.acos((DX * DX + R1 * R1 - R2 * R2) / (2 * DX * R1)))
    tip_top = _pc(C1, R1, -a_tip)
    tip_bot = _pc(C1, R1, a_tip)
    body = "M %s A %s %s 0 1 0 %s A %s %s 0 1 1 %s Z" % (
        _fp(tip_top), f(R1), f(R1), _fp(tip_bot), f(R2), f(R2), _fp(tip_top))

    b = ['<defs><linearGradient id="wood" x1=".1" y1="0" x2=".7" y2="1">'
         '<stop offset="0" stop-color="#6E4E2C"/>'
         '<stop offset=".38" stop-color="#4B3118"/>'
         '<stop offset=".72" stop-color="#33200E"/>'
         '<stop offset="1" stop-color="#201408"/></linearGradient></defs>']

    # ---- carved crescent body
    b.append('<clipPath id="cres"><path d="%s"/></clipPath>' % body)
    b.append('<path d="%s" fill="url(#wood)"/>' % body)
    b.append('<g clip-path="url(#cres)">')
    b.append('<path d="%s" fill="none" stroke="%s" stroke-width="30" opacity=".38"/>'
             % (body, p["g4"]))

    span = 360.0 - 2 * a_tip
    n = 17
    for i in range(n + 1):
        phi = -a_tip - span * i / float(n)
        rin = _inner_r(phi)
        th = R1 - rin
        if th < 40:
            continue
        rm = (R1 + rin) / 2.0
        x, y = _pc(C1, rm, phi)
        sz = min(th * 0.26, 30.0)
        if i % 2 == 0:
            b.append(star(x, y, sz, "url(#goldHi)", points=6, inner=0.46, rot=phi))
            b.append('<circle cx="%s" cy="%s" r="%s" fill="#FFF7E0"/>'
                     % (f(x), f(y), f(sz * 0.19)))
        else:
            b.append('<path d="%s" fill="%s"/>'
                     % (crescent(x, y, sz * 1.02, 0.9, 0.42, phi + 168), p["g2"]))
    # vine scrollwork woven between the ornaments
    for i in range(n):
        phi = -a_tip - span * (i + 0.5) / float(n)
        rin = _inner_r(phi)
        th = R1 - rin
        if th < 46:
            continue
        sp = span / n
        for sign, col, w in ((1, p["g2"], 5.0), (-1, p["g3"], 3.6)):
            r0 = rin + th * (0.26 if sign > 0 else 0.5)
            r1 = rin + th * (0.74 if sign > 0 else 0.5)
            b.append('<path d="M %s C %s %s %s" fill="none" stroke="%s" stroke-width="%s" '
                     'stroke-linecap="round" opacity=".9"/>'
                     % (_fp(_pc(C1, r0, phi - sp * 0.44)),
                        _fp(_pc(C1, r1, phi - sp * 0.16)),
                        _fp(_pc(C1, r0, phi + sp * 0.16)),
                        _fp(_pc(C1, r1, phi + sp * 0.44)), col, f(w)))
    b.append("</g>")
    # crisp gold edges on both curves
    b.append('<path d="%s" fill="none" stroke="url(#gold)" stroke-width="9"/>' % body)
    b.append('<path d="%s" fill="none" stroke="%s" stroke-width="2.4" opacity=".95"/>'
             % (body, p["g1"]))

    # ---- warm LED ring outlining the turning centre, drawn over the crescent
    b.append('<circle cx="500" cy="500" r="%s" fill="none" stroke="#FFDFA0" '
             'stroke-width="26" opacity=".45" filter="url(#soft)"/>' % f(LED))
    b.append('<circle cx="500" cy="500" r="%s" fill="none" stroke="#FFEFC8" '
             'stroke-width="8"/>' % f(LED))
    b.append('<circle cx="500" cy="500" r="%s" fill="none" stroke="#FFFCF0" '
             'stroke-width="2.8"/>' % f(LED))

    # ---- star finials on the horns
    for tip, sz in ((tip_top, 44), (tip_bot, 24)):
        b.append('<circle cx="%s" cy="%s" r="%s" fill="url(#lamp)" opacity=".9"/>'
                 % (f(tip[0]), f(tip[1]), f(sz * 2.4)))
        b.append(star(tip[0], tip[1], sz, "url(#goldHi)", points=8, inner=0.26, rot=22.5))
        b.append(star(tip[0], tip[1], sz * 0.46, "#FFFCEC", points=8, inner=0.34, rot=22.5))
    fp = dict(MOON_D)
    fp["label"] = "Crescent moon frame"
    write("crescent-moon-frame", "".join(b), fp)


if __name__ == "__main__":
    premium(); lotus(); temple(); floral(); moon(); crescent_frame()
