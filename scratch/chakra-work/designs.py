# -*- coding: utf-8 -*-
"""The six Sonic signature backdrops: a still frame and a turning centre each."""
import math
from gen import *  # noqa
from gen import _pc, _fp

BASE = dict(w1="#6E4E2C", w2="#4B3118", w3="#33200E", w4="#1F1308",
            g1="#FFEDBA", g2="#EEC madeup", g3="#BC8E3C", g4="#77531D",
            plate1="#48300F", plate2="#241704", plate3="#0D0702",
            a1="#5B3C18", a2="#241505", glow="#FFC864")
BASE["g2"] = "#EEC478"


def pal(**kw):
    p = dict(BASE)
    p.update(kw)
    return p


LOTUS  = pal()
TEMPLE = pal(w1="#71512E", w2="#4E3319", plate1="#503618", a1="#5E3F19", glow="#F7BE5E")
FLORAL = pal(plate1="#752413", plate2="#450F05", plate3="#1C0602",
             a1="#B33C1A", a2="#6B1E0C", glow="#F8B15C")
PREMIU = pal(g1="#FFF2CC", g2="#F0CE87", g3="#C89A45", g4="#87601F",
             plate1="#472B12", plate2="#2A1908", plate3="#0F0803", glow="#F6C766")
MOON   = pal(w1="#6E4E2C", plate1="#4C3316", g1="#FFE9B0", g2="#EDC271",
             g3="#B8842F", g4="#6E4A16", a1="#5E4018", a2="#241704", glow="#FFCF77")
DIVINE = pal(g1="#FFEEC0", g2="#F2CB7C", g3="#C4923B", g4="#7E5A1E",
             plate1="#513516", plate2="#2A1B07", plate3="#100902",
             a1="#6A4718", a2="#2A1A06", glow="#FFC濃")
DIVINE["glow"] = "#FFC濃"
DIVINE["glow"] = "#FFCB6E"


# ================================================================= 1. LOTUS
def lotus_frame():
    p = LOTUS
    b = [scallop_edge(26, ROUT - 2, 22, "url(#gold)", stroke=p["g4"], sw=1.6),
         carved_band(p),
         curl_ring(18, RIN + 16, ROUT - 16, p["g2"], sw=8),
         curl_ring(18, ROUT - 18, RIN + 18, p["g3"], sw=5, phase=10),
         bead_ring(18, (RIN + ROUT) / 2, 7, p["g1"], phase=10),
         led_ring(p)]
    return write("lotus-chakra-frame", "".join(b), p, "Lotus Chakra frame")


def lotus_disc():
    p = LOTUS
    b = [disc_plate(p),
         petal_ring(40, 420, 480, 19, "url(#gold)", stroke=p["g4"], sw=1, sharp=.62, belly=.36),
         bead_ring(40, 410, 5, p["g2"], phase=4.5),
         ring_line(400, p["g3"], 3.4),
         petal_ring(20, 246, 396, 54, "url(#gold)", stroke=p["g4"], sw=1.7, sharp=.68, belly=.34),
         petal_ring(20, 270, 374, 32, "url(#accent)", sharp=.68, belly=.34),
         petal_ring(20, 282, 358, 14, "url(#goldHi)", sharp=.68, belly=.34),
         petal_ring(20, 216, 306, 41, "url(#gold)", stroke=p["g4"], sw=1.3, phase=9,
                    sharp=.6, belly=.4),
         bead_ring(20, 234, 5.4, p["g1"], phase=9),
         ring_line(200, p["g2"], 4.4),
         annulus(174, 196, "url(#accent)"),
         curl_ring(24, 176, 196, p["g2"], sw=3.2),
         petal_ring(16, 70, 168, 41, "url(#goldHi)", stroke=p["g4"], sw=1.3, phase=11.25,
                    sharp=.6, belly=.42),
         petal_ring(16, 90, 150, 21, "url(#accent)", phase=11.25, sharp=.6, belly=.42),
         '<circle cx="500" cy="500" r="70" fill="url(#accent)"/>',
         bead_ring(16, 58, 5, p["g2"]),
         '<circle cx="500" cy="500" r="24" fill="url(#gold)"/>',
         '<circle cx="500" cy="500" r="9" fill="#FFFBEC"/>',
         '<circle cx="500" cy="500" r="240" fill="url(#lamp)" opacity=".34"/>']
    return write("lotus-chakra", "".join(b), p, "Lotus Chakra rotating chakra")


# ================================================================ 2. TEMPLE
T_IN, T_OUT = RIN, 404.0


def gopuram(p, cx=500.0, base_y=176.0):
    """A carved gopuram crown, stacked tiers under a kalash finial."""
    tiers = [(base_y, base_y - 58, 172, 132), (base_y - 58, base_y - 108, 126, 86),
             (base_y - 108, base_y - 146, 80, 50)]
    b = []
    for y0, y1, w0, w1 in tiers:
        b.append('<path d="M %s %s L %s %s L %s %s L %s %s Z" fill="url(#wood)" '
                 'stroke="url(#gold)" stroke-width="6" stroke-linejoin="round"/>'
                 % (f(cx - w0), f(y0), f(cx - w1), f(y1), f(cx + w1), f(y1), f(cx + w0), f(y0)))
        b.append('<path d="M %s %s L %s %s" stroke="%s" stroke-width="4" opacity=".8"/>'
                 % (f(cx - w1 * .74), f((y0 + y1) / 2), f(cx + w1 * .74), f((y0 + y1) / 2), p["g3"]))
        n = 5
        for i in range(n):
            t = (i + .5) / n
            b.append('<path d="%s" fill="%s"/>'
                     % (crescent_path(cx + (t * 2 - 1) * w1 * 1.35, (y0 + y1) / 2 + 6, 9,
                                      .88, .44, -90), p["g2"]))
    y = base_y - 146
    b.append('<path d="M %s %s L %s %s L %s %s L %s %s Z" fill="url(#gold)"/>'
             % (f(cx - 34), f(y), f(cx - 22), f(y - 16), f(cx + 22), f(y - 16), f(cx + 34), f(y)))
    b.append('<circle cx="%s" cy="%s" r="19" fill="url(#gold)" stroke="%s" stroke-width="3"/>'
             % (f(cx), f(y - 32), p["g4"]))
    b.append('<path d="M %s %s L %s %s L %s %s Z" fill="url(#goldHi)"/>'
             % (f(cx - 9), f(y - 44), f(cx), f(y - 74), f(cx + 9), f(y - 44)))
    b.append(star(cx, y - 78, 17, "url(#goldHi)", points=8, inner=.3, rot=22.5))
    return "".join(b)


def wing(p, side=1):
    """Carved scroll bracket flanking the arch."""
    x0 = 500 + side * (T_OUT - 8)
    d = ("M %s 470 C %s 380 %s 330 %s 300 C %s 356 %s 402 %s 470 Z"
         % (f(x0), f(x0 + side * 96), f(x0 + side * 40), f(x0 + side * 16),
            f(x0 + side * 62), f(x0 + side * 74), f(x0)))
    b = ['<path d="%s" fill="url(#wood)" stroke="url(#gold)" stroke-width="5"/>' % d]
    for k in range(3):
        r = 15 - k * 3
        b.append('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="4"/>'
                 % (f(x0 + side * (26 + k * 16)), f(420 - k * 46), f(r), p["g2"]))
    return "".join(b)


def temple_frame():
    p = TEMPLE
    b = [gopuram(p),
         carved_band(p, T_IN, T_OUT),
         diamond_ring(30, T_IN + 8, T_OUT - 8, 15, "url(#gold)"),
         bead_ring(30, (T_IN + T_OUT) / 2, 5, p["w4"], phase=6),
         ray_ring(30, T_OUT - 4, T_OUT + 22, 11, 4, "url(#gold)", phase=6),
         led_ring(p)]
    return write("temple-aura-frame", "".join(b), p, "Temple Aura frame")


def temple_disc():
    p = TEMPLE
    b = [disc_plate(p),
         ray_ring(56, 396, 480, 20, 7, "url(#gold)"),
         bead_ring(56, 480, 6, p["g1"]),
         annulus(356, 392, "url(#accent)"),
         ring_line(356, p["g3"], 3), ring_line(392, p["g3"], 3),
         diamond_ring(40, 358, 390, 12, "url(#goldHi)"),
         bead_ring(40, 374, 3.6, p["plate3"], phase=4.5),
         petal_ring(20, 240, 348, 44, "url(#gold)", stroke=p["g4"], sw=1.6, sharp=.34, belly=.5),
         petal_ring(20, 260, 328, 26, "url(#accent)", sharp=.34, belly=.5),
         petal_ring(20, 270, 316, 11, "url(#goldHi)", sharp=.34, belly=.5),
         ring_line(234, p["g2"], 4),
         annulus(210, 228, "url(#accent)"),
         curl_ring(30, 212, 228, p["g2"], sw=2.8),
         ray_ring(60, 138, 206, 9, 3.4, "url(#goldHi)"),
         ring_line(134, p["g3"], 3.4),
         petal_ring(12, 46, 130, 32, "url(#gold)", stroke=p["g4"], sw=1.2, sharp=.45, belly=.46),
         '<circle cx="500" cy="500" r="48" fill="url(#accent)"/>',
         bead_ring(12, 34, 6, p["g2"]),
         '<circle cx="500" cy="500" r="19" fill="url(#gold)"/>',
         '<circle cx="500" cy="500" r="7" fill="%s"/>' % p["g1"],
         '<circle cx="500" cy="500" r="190" fill="url(#lamp)" opacity=".34"/>']
    return write("temple-aura", "".join(b), p, "Temple Aura rotating chakra")


# ================================================================ 3. FLORAL
def floral_frame():
    p = FLORAL
    b = [scallop_edge(20, ROUT - 4, 26, "url(#gold)", stroke=p["g4"], sw=1.7),
         scallop_edge(20, ROUT - 4, 13, "url(#accent)"),
         carved_band(p),
         curl_ring(24, RIN + 12, ROUT - 12, p["g2"], sw=6, phase=7.5),
         curl_ring(24, ROUT - 14, RIN + 14, p["g3"], sw=4, phase=7.5)]
    rm = (RIN + ROUT) / 2
    for i in range(12):
        a = i * 30.0
        x, y = P(rm, a)
        b.append('<circle cx="%s" cy="%s" r="17" fill="url(#gold)" stroke="%s" stroke-width="2"/>'
                 % (f(x), f(y), p["g4"]))
        b.append('<circle cx="%s" cy="%s" r="8" fill="url(#accent)"/>' % (f(x), f(y)))
    b.append(led_ring(p))
    return write("floral-mandala-frame", "".join(b), p, "Floral Mandala frame")


def floral_disc():
    p = FLORAL
    b = [disc_plate(p),
         teardrop_ring(18, 252, 480, 74, "url(#accent)", stroke=p["g2"], sw=3.4),
         teardrop_ring(18, 280, 452, 44, "url(#gold)", stroke=p["g4"], sw=1.5),
         teardrop_ring(18, 302, 424, 21, "url(#accent)"),
         bead_ring(18, 330, 6.4, p["g1"]),
         teardrop_ring(18, 216, 296, 53, "url(#gold)", stroke=p["g4"], sw=1.4, phase=10),
         teardrop_ring(18, 234, 278, 28, "url(#accent)", phase=10),
         ring_line(208, p["g2"], 5),
         annulus(182, 204, "url(#accent)"),
         curl_ring(24, 184, 204, p["g2"], sw=3),
         teardrop_ring(14, 62, 176, 45, "url(#goldHi)", stroke=p["g4"], sw=1.4, phase=12.85),
         teardrop_ring(14, 84, 158, 23, "url(#accent)", phase=12.85),
         '<circle cx="500" cy="500" r="58" fill="url(#accent)"/>',
         teardrop_ring(14, 16, 54, 16, "url(#gold)"),
         '<circle cx="500" cy="500" r="21" fill="url(#gold)"/>',
         '<circle cx="500" cy="500" r="8" fill="%s"/>' % p["g1"]]
    return write("floral-mandala", "".join(b), p, "Floral Mandala rotating chakra")


# =========================================================== 4. CRESCENT MOON
M_R1, M_DX, M_R2 = 495.0, 100.5, 456.5
M_C1 = (500.0, 500.0)


def _moon_inner(phi):
    s = M_DX * math.sin(math.radians(phi))
    return M_DX * math.cos(math.radians(phi)) + math.sqrt(max(M_R2 ** 2 - s * s, 0.0))


def moon_frame():
    p = MOON
    a = math.degrees(math.acos((M_DX ** 2 + M_R1 ** 2 - M_R2 ** 2) / (2 * M_DX * M_R1)))
    t_top, t_bot = _pc(M_C1, M_R1, -a), _pc(M_C1, M_R1, a)
    body = "M %s A %s %s 0 1 0 %s A %s %s 0 1 1 %s Z" % (
        _fp(t_top), f(M_R1), f(M_R1), _fp(t_bot), f(M_R2), f(M_R2), _fp(t_top))

    b = ['<clipPath id="cres"><path d="%s"/></clipPath>' % body,
         '<path d="%s" fill="url(#wood)"/>' % body,
         '<g clip-path="url(#cres)">',
         '<path d="%s" fill="none" stroke="%s" stroke-width="30" opacity=".38"/>' % (body, p["g4"])]
    span, n = 360.0 - 2 * a, 17
    for i in range(n + 1):
        phi = -a - span * i / float(n)
        rin = _moon_inner(phi)
        th = M_R1 - rin
        if th < 40:
            continue
        x, y = _pc(M_C1, (M_R1 + rin) / 2, phi)
        sz = min(th * .26, 30.0)
        if i % 2 == 0:
            b.append(star(x, y, sz, "url(#goldHi)", points=6, inner=.46, rot=phi))
            b.append('<circle cx="%s" cy="%s" r="%s" fill="#FFF7E0"/>' % (f(x), f(y), f(sz * .19)))
        else:
            b.append('<path d="%s" fill="%s"/>'
                     % (crescent_path(x, y, sz * 1.02, .9, .42, phi + 168), p["g2"]))
    for i in range(n):
        phi = -a - span * (i + .5) / float(n)
        rin = _moon_inner(phi)
        th = M_R1 - rin
        if th < 46:
            continue
        sp = span / n
        for sign, col, w in ((1, p["g2"], 5.0), (-1, p["g3"], 3.6)):
            r0 = rin + th * (.26 if sign > 0 else .5)
            r1 = rin + th * (.74 if sign > 0 else .5)
            b.append('<path d="M %s C %s %s %s" fill="none" stroke="%s" stroke-width="%s" '
                     'stroke-linecap="round" opacity=".9"/>'
                     % (_fp(_pc(M_C1, r0, phi - sp * .44)), _fp(_pc(M_C1, r1, phi - sp * .16)),
                        _fp(_pc(M_C1, r0, phi + sp * .16)), _fp(_pc(M_C1, r1, phi + sp * .44)),
                        col, f(w)))
    b.append("</g>")
    b.append('<path d="%s" fill="none" stroke="url(#gold)" stroke-width="9"/>' % body)
    b.append('<path d="%s" fill="none" stroke="%s" stroke-width="2.4" opacity=".95"/>'
             % (body, p["g1"]))
    b.append(led_ring(p))
    for tip, sz in ((t_top, 44), (t_bot, 24)):
        b.append('<circle cx="%s" cy="%s" r="%s" fill="url(#lamp)" opacity=".9"/>'
                 % (f(tip[0]), f(tip[1]), f(sz * 2.4)))
        b.append(star(tip[0], tip[1], sz, "url(#goldHi)", points=8, inner=.26, rot=22.5))
        b.append(star(tip[0], tip[1], sz * .46, "#FFFCEC", points=8, inner=.34, rot=22.5))
    return write("crescent-moon-frame", "".join(b), p, "Crescent Moon frame")


def moon_disc():
    p = MOON
    b = [disc_plate(p),
         petal_ring(44, 418, 480, 18, "url(#gold)", stroke=p["g4"], sw=1, sharp=.6, belly=.38),
         bead_ring(44, 408, 4.6, p["g2"], phase=4.1),
         ring_line(398, p["g3"], 3),
         petal_ring(22, 246, 394, 51, "url(#gold)", stroke=p["g4"], sw=1.6, sharp=.64, belly=.36),
         petal_ring(22, 270, 372, 27, "url(#accent)", sharp=.64, belly=.36),
         petal_ring(22, 282, 356, 12, "url(#goldHi)", sharp=.64, belly=.36),
         petal_ring(22, 214, 314, 38, "url(#goldHi)", stroke=p["g4"], sw=1.2,
                    phase=360.0 / 44, sharp=.6, belly=.4),
         bead_ring(22, 230, 5.2, p["g1"], phase=360.0 / 44),
         ring_line(204, p["g2"], 4),
         annulus(178, 200, "url(#accent)"),
         curl_ring(24, 180, 200, p["g2"], sw=3.2),
         petal_ring(16, 68, 172, 42, "url(#gold)", stroke=p["g4"], sw=1.3, phase=11.25,
                    sharp=.58, belly=.42),
         petal_ring(16, 90, 152, 21, "url(#accent)", phase=11.25, sharp=.58, belly=.42),
         '<circle cx="500" cy="500" r="72" fill="url(#accent)"/>',
         bead_ring(16, 60, 5, p["g2"]),
         petal_ring(8, 16, 54, 18, "url(#goldHi)", phase=22.5),
         '<circle cx="500" cy="500" r="19" fill="url(#gold)"/>',
         '<circle cx="500" cy="500" r="7.5" fill="#FFFDF0"/>',
         '<circle cx="500" cy="500" r="250" fill="url(#lamp)" opacity=".34"/>']
    return write("crescent-moon", "".join(b), p, "Crescent Moon rotating chakra")


# ========================================================== 5. PREMIUM CIRCLE
def premium_frame():
    p = PREMIU
    b = [annulus(RIN, ROUT, "url(#gold)", 'filter="url(#bevel)"'),
         annulus(RIN + 22, ROUT - 22, "url(#wood)"),
         ring_line(RIN + 22, p["g4"], 3), ring_line(ROUT - 22, p["g4"], 3),
         bead_ring(60, (RIN + ROUT) / 2, 7.5, "url(#goldHi)"),
         ring_line(ROUT - 6, p["g1"], 2.4, 'opacity=".85"'),
         ring_line(RIN + 6, p["g1"], 2.4, 'opacity=".85"'),
         led_ring(p)]
    return write("premium-circle-frame", "".join(b), p, "Premium Circle frame")


def premium_disc():
    p = PREMIU
    b = [disc_plate(p),
         petal_ring(36, 434, 480, 20, "url(#gold)", stroke=p["g4"], sw=1.1, sharp=.5, belly=.4),
         bead_ring(36, 424, 4.6, p["g1"], phase=5),
         annulus(392, 418, "url(#accent)"),
         curl_ring(24, 394, 418, p["g2"], sw=3.4),
         ring_line(390, p["g3"], 2.6), ring_line(420, p["g3"], 2.6),
         petal_ring(24, 272, 384, 35, "url(#gold)", stroke=p["g4"], sw=1.3, sharp=.62, belly=.36),
         petal_ring(24, 294, 364, 17, "url(#accent)", sharp=.62, belly=.36),
         bead_ring(24, 304, 5.4, p["g1"]),
         petal_ring(16, 190, 288, 42, "url(#goldHi)", stroke=p["g4"], sw=1.4, phase=11.25,
                    sharp=.55, belly=.42),
         diamond_ring(32, 168, 196, 9, p["g2"]),
         annulus(150, 168, "url(#accent)"),
         petal_ring(12, 66, 148, 33, "url(#gold)", stroke=p["g4"], sw=1.2, sharp=.5, belly=.45),
         '<circle cx="500" cy="500" r="66" fill="url(#accent)"/>',
         petal_ring(12, 20, 62, 15, "url(#goldHi)", phase=15),
         '<circle cx="500" cy="500" r="22" fill="url(#gold)"/>',
         '<circle cx="500" cy="500" r="10" fill="%s"/>' % p["g1"],
         '<circle cx="500" cy="500" r="160" fill="url(#lamp)" opacity=".34"/>']
    return write("premium-circle", "".join(b), p, "Premium Circle rotating chakra")


# ============================================================= 6. DIVINE LOTUS
def divine_frame():
    p = DIVINE
    b = [petal_ring(22, ROUT - 30, ROUT + 34, 34, "url(#gold)", stroke=p["g4"], sw=1.7,
                    sharp=.42, belly=.46),
         carved_band(p),
         petal_ring(22, RIN + 12, ROUT - 12, 22, "url(#gold)", sharp=.5, belly=.42),
         petal_ring(22, RIN + 21, ROUT - 21, 10, "url(#wood)", sharp=.5, belly=.42),
         bead_ring(22, RIN + 8, 5.4, p["g1"], phase=360.0 / 44),
         led_ring(p)]
    return write("divine-lotus-frame", "".join(b), p, "Divine Lotus frame")


def divine_disc():
    p = DIVINE
    b = [disc_plate(p),
         petal_ring(32, 300, 482, 26, "url(#gold)", stroke=p["g4"], sw=1.2, sharp=.72, belly=.3),
         petal_ring(32, 322, 460, 12, "url(#accent)", sharp=.72, belly=.3),
         bead_ring(32, 292, 5.4, p["g2"], phase=360.0 / 64),
         ring_line(284, p["g3"], 3.4),
         petal_ring(16, 168, 278, 52, "url(#gold)", stroke=p["g4"], sw=1.6, phase=11.25,
                    sharp=.6, belly=.38),
         petal_ring(16, 192, 256, 28, "url(#accent)", phase=11.25, sharp=.6, belly=.38),
         petal_ring(16, 200, 244, 12, "url(#goldHi)", phase=11.25, sharp=.6, belly=.38),
         petal_ring(16, 150, 214, 34, "url(#goldHi)", stroke=p["g4"], sw=1.2, sharp=.55, belly=.42),
         ring_line(142, p["g2"], 4),
         annulus(118, 138, "url(#accent)"),
         curl_ring(20, 120, 138, p["g2"], sw=3),
         petal_ring(10, 30, 112, 30, "url(#gold)", stroke=p["g4"], sw=1.2, sharp=.5, belly=.45),
         '<circle cx="500" cy="500" r="40" fill="url(#accent)"/>',
         bead_ring(10, 30, 4.4, p["g2"], phase=18),
         '<circle cx="500" cy="500" r="17" fill="url(#gold)"/>',
         '<circle cx="500" cy="500" r="6.5" fill="#FFFDF0"/>',
         '<circle cx="500" cy="500" r="270" fill="url(#lamp)" opacity=".34"/>']
    return write("divine-lotus", "".join(b), p, "Divine Lotus rotating chakra")


ALL = [lotus_frame, lotus_disc, temple_frame, temple_disc, floral_frame, floral_disc,
       moon_frame, moon_disc, premium_frame, premium_disc, divine_frame, divine_disc]

if __name__ == "__main__":
    for fn in ALL:
        print("wrote", fn())
