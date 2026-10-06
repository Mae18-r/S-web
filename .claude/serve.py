"""Serveur de developpement local.

python3 -m http.server n'envoie aucun en-tete de cache : le navigateur decide
alors seul, et garde styles.css ou cta.js pendant qu'on les modifie. On a
plusieurs fois cru a un bug du site alors que la page tournait sur une
ancienne version. Ce serveur force no-store sur tout.

Il reproduit aussi le cleanUrls de vercel.json : les liens internes du site
s'ecrivent sans .html, et sans cette regle le serveur local renverrait 404 la
ou la production sert la page.

Rien de ceci ne part en production : Vercel sert le site avec ses propres
en-tetes.
"""
import functools
import http.server
import os
import sys


class SansCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    # Memes redirections que vercel.json : la page de reservation a fusionne
    # avec la page Contact. Sans ca, l'ancienne adresse renvoie 404 en local
    # alors qu'elle redirige en production, et on croit a une regression.
    REDIRECTIONS = {
        "/reserver-un-appel": "/contact#reserver",
        "/en/book-a-call": "/en/contact#reserver",
    }

    def do_GET(self):
        cible = self.REDIRECTIONS.get(self.path.rstrip("/"))
        if cible:
            self.send_response(301)
            self.send_header("Location", cible)
            self.end_headers()
            return
        super().do_GET()

    def translate_path(self, path):
        chemin = super().translate_path(path)
        if not os.path.exists(chemin) and os.path.isfile(chemin + ".html"):
            return chemin + ".html"
        return chemin


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    racine = sys.argv[2] if len(sys.argv) > 2 else "."
    gestionnaire = functools.partial(SansCache, directory=racine)
    http.server.ThreadingHTTPServer(("", port), gestionnaire).serve_forever()
