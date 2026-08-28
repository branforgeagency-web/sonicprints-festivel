# -*- coding: utf-8 -*-
"""Sonic Festival — rotating chakra backdrops.

Every design is built as two layers so the product reads honestly on screen:

  <design>-frame.svg   the STILL outer frame — carved band, ornament, and the
                       warm LED ring that outlines the turning centre
  <design>.svg         the ROTATING centre chakra, perfectly radially
                       symmetric so the spin has no seam and no wobble

Both share one geometry: in frame units the rotating disc has radius RD and is
centred on (500,500), so the same CSS box works for all six designs and the
idol never shifts when the design changes.
"""
import math, os, io, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "out"
os.makedirs(OUT, exist_ok=True)

C = 500.0
RD = 340.0          # rotating disc radius, in frame units
LED = RD + 8.0      # warm ring, drawn over the disc's rim
RIN = RD + 16.0     # inner edge of a circular carved band
ROUT = 440.0        # outer edge of a circular carved band


def f(v):
    return ("%.2f" % v).rstrip("0").rstrip(".")


def P(r, deg):
    a = math.radians(deg - 90.0)
    return (C + r * math.cos(a), C + r * math.sin(a))


def pt(r, deg):
    return "%s %s" % tuple(f(v) for v in P(r, deg))


def _pc(c, r, phi):
    p = math.radians(phi)
    return (c[0] + r * math.cos(p), c[1] + r * math.sin(p))


def _fp(xy):
    return "%s %s" % (f(xy[0]), f(xy[1]))


# ---------------------------------------------------------------- primitives
def annulus(r0, r1, fill, extra=""):
    return ('<path fill-rule="evenodd" fill="%s" %s d="M %s A %s %s 0 1 1 %s A %s %s 0 1 1 %s Z '
            'M %s A %s %s 0 1 0 %s A %s %s 0 1 0 %s Z"/>') % (
        fill, extra,
        pt(r1, 0), f(r1), f(r1), pt(r1, 180), f(r1), f(r1), pt(r1, 360),
        pt(r0, 0), f(r0), f(r0), pt(r0, 180), f(r0), f(r0), pt(r0, 360))


def ring_line(r, stroke, w, extra=""):
    return '<circle cx="500" cy="500" r="%s" fill="none" stroke="%s" stroke-width="%s" %s/>' % (
        f(r), stroke, f(w), extra)


def petal(r0, r1, half_w, deg, fill, stroke=None, sw=1.2, sharp=0.55, belly=0.42, extra=""):
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


def teardrop_ring(n, r0, r1, half_w, fill, stroke=None, phase=0.0, sw=1.2):
    return petal_ring(n, r0, r1, half_w, fill, stroke, phase=phase, sharp=0.2, belly=0.55, sw=sw)


def bead_ring(n, r, rad, fill, phase=0.0, extra=""):
    out = []
    for i in range(n):
        x, y = P(r, phase + i * 360.0 / n)
        out.append('<circle cx="%s" cy="%s" r="%s" fill="%s" %s/>' % (f(x), f(y), f(rad), fill, extra))
    return "".join(out)


def ray_ring(n, r0, r1, w0, w1, fill, phase=0.0, extra=""):
    out = []
    for i in range(n):
        a = phase + i * 360.0 / n
        a0 = math.degrees(math.atan2(w0 / 2.0, r0))
        a1 = math.degrees(math.atan2(w1 / 2.0, r1))
        out.append('<path d="M %s L %s L %s L %s Z" fill="%s" %s/>'
                   % (pt(r0, a - a0), pt(r1, a - a1), pt(r1, a + a1), pt(r0, a + a0), fill, extra))
    return "".join(out)


def diamond_ring(n, r0, r1, half_w, fill, phase=0.0, stroke=None, sw=1.0):
    out = []
    rm = (r0 + r1) / 2.0
    aw = math.degrees(math.atan2(half_w, rm))
    for i in range(n):
        a = phase + i * 360.0 / n
        s = '<path d="M %s L %s L %s L %s Z" fill="%s"' % (
            pt(r0, a), pt(rm, a - aw), pt(r1, a), pt(rm, a + aw), fill)
        if stroke:
            s += ' stroke="%s" stroke-width="%s"' % (stroke, f(sw))
        out.append(s + "/>")
    return "".join(out)


def curl_ring(n, r0, r1, fill, phase=0.0, sw=3.0, op=1.0):
    out = []
    step = 360.0 / n
    for i in range(n):
        a = phase + i * step
        out.append('<path d="M %s C %s %s %s" fill="none" stroke="%s" stroke-width="%s" '
                   'stroke-linecap="round" opacity="%s"/>'
                   % (pt(r0, a - step * 0.42), pt(r1, a - step * 0.30),
                      pt(r1, a + step * 0.30), pt(r0, a + step * 0.42), fill, f(sw), f(op)))
    return "".join(out)


def star(cx, cy, r, fill, points=5, inner=0.42, rot=0.0):
    pts = []
    for i in range(points * 2):
        rr = r if i % 2 == 0 else r * inner
        a = math.radians(rot + i * (180.0 / points) - 90.0)
        pts.append("%s,%s" % (f(cx + rr * math.cos(a)), f(cy + rr * math.sin(a))))
    return '<polygon points="%s" fill="%s"/>' % (" ".join(pts), fill)


def star_ring(n, r, size, fill, phase=0.0, points=6, inner=0.44):
    out = []
    for i in range(n):
        a = phase + i * 360.0 / n
        x, y = P(r, a)
        out.append(star(x, y, size, fill, points=points, inner=inner, rot=a))
    return "".join(out)


def crescent_path(cx, cy, R, bite=0.92, off=0.40, rot=0.0):
    r = R * bite
    d = R * off
    ca = max(-1.0, min(1.0, (d * d + R * R - r * r) / (2 * d * R)))
    a = math.degrees(math.acos(ca))
    t1 = _pc((cx, cy), R, rot - a)
    t2 = _pc((cx, cy), R, rot + a)
    return "M %s A %s %s 0 1 0 %s A %s %s 0 1 1 %s Z" % (
        _fp(t1), f(R), f(R), _fp(t2), f(r), f(r), _fp(t1))


def scallop_edge(n, r, rad, fill, phase=0.0, stroke=None, sw=1.0):
    out = []
    for i in range(n):
        x, y = P(r, phase + i * 360.0 / n)
        s = '<circle cx="%s" cy="%s" r="%s" fill="%s"' % (f(x), f(y), f(rad), fill)
        if stroke:
            s += ' stroke="%s" stroke-width="%s"' % (stroke, f(sw))
        out.append(s + "/>")
    return "".join(out)


# -------------------------------------------------------------------- shared
def defs(p):
    return """<defs>
 <radialGradient id="plate" gradientUnits="userSpaceOnUse" cx="500" cy="430" r="620">
  <stop offset="0" stop-color="%(plate1)s"/><stop offset=".62" stop-color="%(plate2)s"/>
  <stop offset="1" stop-color="%(plate3)s"/></radialGradient>
 <radialGradient id="gold" gradientUnits="userSpaceOnUse" cx="500" cy="405" r="600">
  <stop offset="0" stop-color="%(g1)s"/><stop offset=".45" stop-color="%(g2)s"/>
  <stop offset=".78" stop-color="%(g3)s"/><stop offset="1" stop-color="%(g4)s"/></radialGradient>
 <radialGradient id="goldHi" gradientUnits="userSpaceOnUse" cx="500" cy="380" r="560">
  <stop offset="0" stop-color="%(g1)s"/><stop offset=".55" stop-color="%(g1)s"/>
  <stop offset="1" stop-color="%(g3)s"/></radialGradient>
 <radialGradient id="accent" gradientUnits="userSpaceOnUse" cx="500" cy="420" r="600">
  <stop offset="0" stop-color="%(a1)s"/><stop offset="1" stop-color="%(a2)s"/></radialGradient>
 <linearGradient id="wood" x1=".1" y1="0" x2=".72" y2="1">
  <stop offset="0" stop-color="%(w1)s"/><stop offset=".38" stop-color="%(w2)s"/>
  <stop offset=".74" stop-color="%(w3)s"/><stop offset="1" stop-color="%(w4)s"/></linearGradient>
 <radialGradient id="lamp" cx="50%%" cy="50%%" r="50%%">
  <stop offset="0" stop-color="#fffdf2" stop-opacity=".95"/>
  <stop offset=".35" stop-color="%(glow)s" stop-opacity=".8"/>
  <stop offset="1" stop-color="%(glow)s" stop-opacity="0"/></radialGradient>
 <radialGradient id="halo" cx="50%%" cy="50%%" r="50%%">
  <stop offset=".55" stop-color="%(glow)s" stop-opacity="0"/>
  <stop offset=".82" stop-color="%(glow)s" stop-opacity=".34"/>
  <stop offset=".96" stop-color="%(glow)s" stop-opacity=".09"/>
  <stop offset="1" stop-color="%(glow)s" stop-opacity="0"/></radialGradient>
 <filter id="bevel" x="-12%%" y="-12%%" width="124%%" height="124%%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>
  <feSpecularLighting in="b" surfaceScale="4.5" specularConstant=".62" specularExponent="17"
   lighting-color="#fff6df" result="s"><fePointLight x="-2200" y="-3600" z="4200"/></feSpecularLighting>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="so"/>
  <feComposite in="SourceGraphic" in2="so" operator="arithmetic" k1="0" k2="1" k3=".9" k4="0"/></filter>
 <filter id="soft" x="-40%%" y="-40%%" width="180%%" height="180%%">
  <feGaussianBlur stdDeviation="11"/></filter>
</defs>""" % p


def write(name, body, p, label):
    path = os.path.join(OUT, name + ".svg")
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" '
           'height="1000" role="img" aria-label="%s">%s%s</svg>' % (label, defs(p), body))
    with io.open(path, "w", encoding="utf-8") as fh:
        fh.write(svg)
    return path


def led_ring(p, r=LED):
    """The warm concealed-LED ring that outlines the turning centre."""
    return "".join([
        '<circle cx="500" cy="500" r="%s" fill="none" stroke="%s" stroke-width="54" '
        'opacity=".62" filter="url(#soft)"/>' % (f(r), p["glow"]),
        '<circle cx="500" cy="500" r="%s" fill="none" stroke="%s" stroke-width="22" '
        'opacity=".6" filter="url(#soft)"/>' % (f(r), "#FFDF9E"),
        '<circle cx="500" cy="500" r="%s" fill="none" stroke="#FFE3A6" stroke-width="10"/>' % f(r),
        '<circle cx="500" cy="500" r="%s" fill="none" stroke="#FFF6DC" stroke-width="4.5"/>' % f(r),
        '<circle cx="500" cy="500" r="%s" fill="none" stroke="#FFFDF4" stroke-width="2.2"/>' % f(r),
    ])


def carved_band(p, rin=RIN, rout=ROUT):
    """The still carved-wood band every circular frame is built on."""
    return "".join([
        annulus(rin, rout, "url(#wood)"),
        ring_line(rout - 3, "url(#gold)", 6),
        ring_line(rin + 3, "url(#gold)", 6),
        ring_line(rout - 7, p["g4"], 2, 'opacity=".8"'),
        ring_line(rin + 7, p["g4"], 2, 'opacity=".8"'),
    ])


def disc_plate(p):
    return "".join([
        '<circle cx="500" cy="500" r="498" fill="url(#halo)"/>',
        '<circle cx="500" cy="500" r="492" fill="url(#plate)"/>',
        ring_line(486, p["g4"], 7),
    ])
