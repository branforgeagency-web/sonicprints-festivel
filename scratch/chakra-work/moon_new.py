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
RD = 362.0            # rotating disc radius, in frame units
C1 = (500.0, 500.0)   # outer circle of the crescent
R1 = 495.0
DX = 88.2             # how far the bite is offset to the right
R2 = 460.2
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
