"""Gera as artes recortadas (fundo transparente) usadas no "Ver na minha parede".

As imagens do catálogo são mockups em ambientes: aqui extraímos só os quadros.
Cada painel é um retângulo (x0, y0, x1, y1) ou um quadrilátero [tl, tr, br, bl]
que é endireitado por perspectiva. Painéis "auto" são detectados pelas faixas
claras entre as peças. Nomes em IGUAIS têm painéis do mesmo tamanho na vida real,
mas a foto em ângulo encolhe o mais distante: lá todos são igualados ao maior. Uso: python3 scripts/recortar-artes.py
"""
from PIL import Image
import os

ORIGEM = 'src/assets/img'
DESTINO = 'src/assets/img/arte'
LADO_MAX = 1200

R = lambda *c: tuple(c)
PAINEIS = {
    'nov-18': [R(75, 125, 733, 780)],
    'nov-19-20': [R(178, 64, 334, 297), R(350, 64, 505, 297), R(522, 64, 677, 297)],
    'nov-21': [R(155, 77, 403, 410), R(438, 77, 685, 410)],
    'nov-22': [[(373, 107), (948, 60), (948, 408), (373, 400)]],
    'nov-23-24': [R(362, 37, 624, 373), R(661, 37, 922, 373)],
    'nov-25-26': [R(265, 13, 557, 373), R(565, 13, 860, 373)],
    'nov-27-28': [R(248, 17, 512, 370), R(520, 17, 785, 370)],
    'nov-30-p7': [R(192, 30, 480, 408), R(482, 30, 766, 408)],
    'nov-31-p7': [[(389, 163), (525, 137), (525, 403), (389, 406)],
                  [(561, 129), (748, 94), (748, 418), (562, 413)],
                  [(787, 86), (1048, 37), (1049, 425), (788, 418)]],
    'nov-32': [R(400, 61, 913, 813)],
    'nov-41': [R(177, 115, 330, 345), R(348, 115, 500, 345), R(519, 115, 672, 345)],
    'nov-42': [[(83, 24), (236, 39), (236, 239), (83, 232)], [(240, 41), (362, 55), (362, 239), (240, 239)]],
    'nov-43': [[(5, 117), (155, 135), (155, 308), (5, 310)], [(158, 137), (274, 152), (274, 306), (158, 308)]],
    'nov-44': [R(262, 64, 752, 347)],
    'nov-45': [R(253, 0, 420, 322), R(425, 10, 590, 322), R(596, 10, 763, 322)],
    'nov-46-47': [R(366, 37, 633, 387), R(668, 37, 935, 387)],
    'nov-48-49': [R(305, 95, 457, 361), R(478, 95, 629, 361)],
    # Imagens que já são só a arte
    'nov-29': 'inteira', 'nov-33': 'inteira', 'nov-34': 'inteira', 'nov-35': 'inteira', 'nov-36': 'inteira',
    'nov-50': 'inteira', 'nov-51': 'inteira', 'nov-52': 'inteira', 'nov-53': 'inteira',
    'nov-30-31-p6': 'auto', 'nov-37-38': 'auto', 'nov-39-40': 'auto',
}


IGUAIS = {'nov-31-p7', 'nov-42', 'nov-43'}


def coeficientes(origem, destino):
    """Coeficientes de Image.PERSPECTIVE que levam pontos de destino à origem."""
    import numpy as np
    a = []
    for (x, y), (u, v) in zip(destino, origem):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    b = [c for p in origem for c in p]
    return np.linalg.solve(np.array(a, float), np.array(b, float)).tolist()


def endireitar(im, quad):
    tl, tr, br, bl = quad
    largura = int(round(((tr[0] - tl[0]) + (br[0] - bl[0])) / 2))
    altura = int(round(((bl[1] - tl[1]) + (br[1] - tr[1])) / 2))
    destino = [(0, 0), (largura, 0), (largura, altura), (0, altura)]
    return im.transform((largura, altura), Image.PERSPECTIVE, coeficientes(quad, destino), Image.BICUBIC)


def detectar_paineis(im):
    """Painéis lado a lado separados por faixa vertical clara e uniforme."""
    cinza = im.convert('L')
    w, h = cinza.size
    px = cinza.load()
    clara = []
    for x in range(w):
        col = [px[x, y] for y in range(0, h, 4)]
        clara.append(min(col) > 200)
    paineis, inicio = [], None
    for x, c in enumerate(clara + [True]):
        if not c and inicio is None:
            inicio = x
        elif c and inicio is not None:
            if x - inicio > w * 0.15:
                paineis.append((inicio, 0, x, h))
            inicio = None
    return paineis or [(0, 0, w, h)]


def gerar(nome, regra):
    im = Image.open(os.path.join(ORIGEM, nome + '.webp')).convert('RGBA')
    if regra == 'inteira':
        paineis = [(0, 0, im.width, im.height)]
    elif regra == 'auto':
        paineis = detectar_paineis(im)
    else:
        paineis = regra
    pecas = []
    for p in paineis:
        if isinstance(p, tuple):
            pecas.append((p[0], p[1], im.crop(p)))
        else:
            pecas.append((min(x for x, _ in p), min(y for _, y in p), endireitar(im, p)))
    if nome in IGUAIS:
        largura = max(i.width for _, _, i in pecas)
        altura = max(i.height for _, _, i in pecas)
        vao = round(largura * 0.05)
        pecas = [(k * (largura + vao), 0, i.resize((largura, altura), Image.LANCZOS)) for k, (_, _, i) in enumerate(pecas)]
    x0 = min(x for x, _, _ in pecas)
    y0 = min(y for _, y, _ in pecas)
    x1 = max(x + i.width for x, _, i in pecas)
    y1 = max(y + i.height for _, y, i in pecas)
    tela = Image.new('RGBA', (x1 - x0, y1 - y0), (0, 0, 0, 0))
    for x, y, i in pecas:
        tela.paste(i, (x - x0, y - y0))
    tela.thumbnail((LADO_MAX, LADO_MAX), Image.LANCZOS)
    tela.save(os.path.join(DESTINO, nome + '.webp'), quality=88, method=6)
    return len(pecas), tela.size


if __name__ == '__main__':
    os.makedirs(DESTINO, exist_ok=True)
    for nome, regra in PAINEIS.items():
        print(nome, *gerar(nome, regra))
