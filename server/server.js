const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = 3000;

// Utiliser les middlewares par défaut (logger, static, cors et no-cache)
server.use(middlewares);

// Pour pouvoir parser le body des requêtes en JSON
server.use(jsonServer.bodyParser);

// Middleware pour simuler un délai (optionnel)
server.use((req, res, next) => {
  setTimeout(next, 500);
});

// Routes personnalisées avant le routeur par défaut
// ------------------------------------------------


// route pour obtenir les utilisateurs

server.get("/api/users", (req, res) => {
  const users = router.db.get("users").value();
  res.json(users);
});

//route pour supprimer un user specifique
server.delete("/api/users/:id", (req,res)=>{
  const userId = parseInt(req.params.id)
  const
})

// Exemple 2: Route pour obtenir les produits en stock
server.get("/api/produits/disponibles", (req, res) => {
  const produits = router.db.get("produits").value();
  const disponibles = produits.filter((produit) => produit.stock > 0);
  res.json(disponibles);
});

// Exemple 3: Route pour obtenir les détails complets d'une commande (avec infos utilisateur et produits)
server.get("/api/commandes/details/:id", (req, res) => {
  const commandeId = parseInt(req.params.id);
  const commande = router.db.get("commandes").find({ id: commandeId }).value();

  if (!commande) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }

  // Récupérer les détails de l'utilisateur
  const utilisateur = router.db
    .get("utilisateurs")
    .find({ id: commande.utilisateurId })
    .value();

  // Récupérer les détails des produits
  const produitsCommande = router.db
    .get("produits")
    .filter((p) => commande.produits.includes(p.id))
    .value();

  // Calculer le total de la commande
  const total = produitsCommande.reduce(
    (sum, produit) => sum + produit.prix,
    0
  );

  // Retourner la commande enrichie
  res.json({
    ...commande,
    utilisateur,
    produits: produitsCommande,
    total,
  });
});

// Exemple 4: Route pour créer une nouvelle commande avec vérification de stock
server.post("/api/commandes/nouvelle", (req, res) => {
  const { utilisateurId, produits } = req.body;

  // Vérifier que l'utilisateur existe
  const utilisateur = router.db
    .get("utilisateurs")
    .find({ id: utilisateurId })
    .value();
  if (!utilisateur) {
    return res.status(400).json({ error: "Utilisateur inconnu" });
  }

  // Vérifier que tous les produits existent et sont en stock
  const produitsDB = router.db.get("produits").value();
  let produitsCommande = [];

  for (const produitId of produits) {
    const produit = produitsDB.find((p) => p.id === produitId);

    if (!produit) {
      return res
        .status(400)
        .json({ error: `Produit #${produitId} introuvable` });
    }

    if (produit.stock <= 0) {
      return res.status(400).json({
        error: `Produit #${produitId} (${produit.nom}) en rupture de stock`,
      });
    }

    produitsCommande.push(produit);
  }

  // Créer la nouvelle commande
  const commandes = router.db.get("commandes");
  const nouvelId =
    commandes.value().length > 0
      ? Math.max(...commandes.value().map((c) => c.id)) + 1
      : 1;

  const nouvelleCommande = {
    id: nouvelId,
    utilisateurId,
    produits: produits,
    date: new Date().toISOString().split("T")[0],
  };

  // Ajouter la commande à la base
  commandes.push(nouvelleCommande).write();

  // Mettre à jour le stock des produits
  produitsCommande.forEach((produit) => {
    router.db
      .get("produits")
      .find({ id: produit.id })
      .assign({ stock: produit.stock - 1 })
      .write();
  });

  // Retourner la commande créée avec détails
  res.status(201).json({
    ...nouvelleCommande,
    utilisateur,
    produits: produitsCommande,
    total: produitsCommande.reduce((sum, produit) => sum + produit.prix, 0),
  });
});

// Utiliser le routeur par défaut pour les routes REST standards
server.use("/api", router);

// Rediriger / vers /api
server.get("/", (req, res) => {
  res.redirect("/api");
});

// Démarrer le serveur
server.listen(port, () => {
  console.log(
    `JSON Server est en cours d'exécution sur http://localhost:${port}`
  );
  console.log(`Ressources disponibles sur http://localhost:${port}/api`);
  console.log(`Routes personnalisées :`);
  console.log(`- http://localhost:${port}/api/utilisateurs/age/:age`);
  console.log(`- http://localhost:${port}/api/produits/disponibles`);
  console.log(`- http://localhost:${port}/api/commandes/details/:id`);
  console.log(`- http://localhost:${port}/api/commandes/nouvelle (POST)`);
});
