"""Serveur de developpement local.

python3 -m http.server n'envoie aucun en-tete de cache : le navigateur decide
alors seul, et garde styles.css ou cta.js pendant qu'on les modifie. On a
plusieurs fois cru a un bug du site alors que la page tournait sur une
ancienne version. Ce serveur force no-store sur tout.

Rien de ceci ne part en production : Vercel sert le site avec ses propres
en-teces.
"""
import functools
import http.server
import sys


class SansCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    racine = sys.argv[2] if len(sys.argv) > 2 else "."
    gestionnaire = functools.partial(SansCache, directory=racine)
    http.server.ThreadingHTTPServer(("", port), gestionnaire).serve_forever()
