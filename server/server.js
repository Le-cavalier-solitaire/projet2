const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const { error } = require("console");
const router = jsonServer.router(path.join(__dirname, "db.json"));
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

// JWT Secret (à remplacer par une clé sécurisée en production)
const JWT_SECRET = "votre_clé_secrète";

// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401); // Non autorisé

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalide
    req.user = user;
    next();
  });
}

// Routes personnalisées avant le routeur par défaut
// ------------------------------------------------

// Route de connexion (POST /login)
server.post("/api/login", async (req, res) => {
  const { email } = req.body;
  const password = req.body.password;

  console.log("Tentative de connexion avec:", { email, password }); // Debug

  // Cherche l'utilisateur dans "db.json"
  const users = router.db.get("users").value();
  const user = users.find((u) => u.mail === email);

  console.log("Utilisateur trouvé:", user); // Debug

  if (!user) {
    console.log("Utilisateur non trouvé"); // Debug
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Mot de passe valide:", isPasswordValid); // Debug

  if (!isPasswordValid) {
    console.log("Mot de passe incorrect"); // Debug
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  // Génère un token JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Route protégée (GET /profile)
server.get("/api/profile", authenticateToken, (req, res) => {
  const user = router.db.get("users").find({ id: req.user.userId }).value();

  if (!user) return res.sendStatus(404);
  res.json({ username: user.username, email: user.email });
});

// Exemple 1: Route pour obtenir les utilisateurs
server.get("/api/users", (req, res) => {
  try {
    const users = router.db.get("users").value();
    console.log("Utilisateurs récupérés:", users ? users.length : 0);

    if (!users || users.length === 0) {
      console.log("Aucun utilisateur trouvé dans la base de données");
    }

    res.json(users || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
});

//route pour un obtenir un user grace à l'email
server.get("/api/user/mail/:email", (req, res) => {
  try {
    const userEmail = req.params.email;
    const users = router.db.get("users").value();
    const userData = users.find((user) => user.mail == userEmail);
    console.log("Utilisateur récupéré:", userData ? userData.length : 0);

    if (!userData || userData.length === 0) {
      console.log("Aucun utilisateur trouvé dans la base de données");
    }

    res.json(userData || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
});

//methode POST user
server.post("/api/user", async (req, res) => {
  const payload = req.body;
  const users = router.db.get("users");
  const password = payload.password;
  const passwordHash = await bcrypt.hash(password, 10);
  const userData = {
    id: uuidv4(),
    name: payload.name,
    password: passwordHash,
    surname: payload.surname,
    mail: payload.mail,
    telephone: payload.telephone,
    role: payload.role,
    brancnId: payload.brancnId,
    dob: payload.dob,
  };
  users.push(userData).write();
  res.status(201).json(payload);
});

//route pour supprimer un user specifique
server.delete("/api/deleteUser/:id", (req, res) => {
  const userID = req.params.id;

  const users = router.db.get("users");

  // Récupérer le tableau complet pour vérification
  const usersArray = users.value();

  // Vérifier les IDs existants et leur type
  const existingIds = usersArray.map((u) => ({ id: u.id, type: typeof u.id }));

  // Trouver l'index directement dans le tableau (pas dans la chaîne lowdb)
  const userIndex = usersArray.findIndex((user) => user.id === userID);

  if (userIndex == -1) {
    return res
      .status(404)
      .json({ error: "Utilisateur non trouvé", id: userID });
  }

  // Supprimer l'utilisateur spécifique en utilisant l'API lowdb
  const removedUser = users.splice(userIndex, 1).write();

  // Vérifier le résultat
  console.log("Utilisateur supprimé:", JSON.stringify(removedUser));
  console.log("Utilisateurs après suppression:", JSON.stringify(users.value()));

  res.status(200).json({ success: true, id: userID, removed: removedUser });
});

//route pour mettre à jour les données d'un user spécifique
server.patch("/api/updateUser/:id", (req, res) => {
  const newUserData = req.body;
  const userID = req.params.id; // Pas besoin de parseInt car les IDs sont des strings

  const users = router.db.get("users");
  const usersArray = users.value();

  // Trouver l'utilisateur par ID
  const userIndex = usersArray.findIndex((user) => user.id === userID);

  if (userIndex == -1) {
    return res
      .status(404)
      .json({ error: "Utilisateur non trouvé", id: userID });
  }

  // Récupérer l'utilisateur actuel et fusionner les nouvelles données
  const currentUser = usersArray[userIndex];
  const updatedUser = { ...currentUser, ...newUserData };

  // Mettre à jour l'utilisateur dans l'objet lowdb
  users.splice(userIndex, 1, updatedUser).write();

  // Vérifier la mise à jour
  const afterUpdate = users.value()[userIndex];

  res.status(200).json({ success: true, user: updatedUser });
});

// route pour recupérer les quizs
server.get("/api/quiz", (req, res) => {
  try {
    const quizs = router.db.get("quiz").value();

    if (!quizs || quizs.length === 0) {
    }

    res.json(quizs || []);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
});

//recupérer un quiz donné
server.get("/api/quiz/id/:id", (req, res) => {
  try {
    const quizId = req.params.id;
    console.log(quizId);
    const quizs = router.db.get("quiz").value();
    const currentQUiz = quizs.find((quiz) => quiz.id == quizId);
    console.log(currentQUiz);

    if (!quizs || quizs.length === 0) {
      console.log("le at.........");
    }
    res.json(currentQUiz || []);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
});

// route pour recupérer les quizs d'un user donnée
server.get("/api/quiz/authorId/:userId", (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Recherche des quizs pour l'utilisateur:", userId);

    // Vérifier si l'utilisateur existe
    const users = router.db.get("users").value();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const quizs = router.db.get("quiz").value();
    console.log("Tous les quizs:", quizs);

    const quizsUserId = quizs.filter((quiz) => {
      // Ne pas inclure les quizs sans authorId
      if (!quiz.authorId) {
        return false;
      }
      console.log("Comparaison:", {
        quizAuthorId: quiz.authorId,
        userId: userId,
        typeQuizAuthorId: typeof quiz.authorId,
        typeUserId: typeof userId,
        match: quiz.authorId === userId,
      });
      return quiz.authorId === userId;
    });

    console.log("Quizs trouvés:", quizsUserId);

    if (!quizsUserId || quizsUserId.length === 0) {
      console.log("Aucun quiz trouvé pour cet utilisateur");
    }

    res.json(quizsUserId || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des quizs:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des quizs",
    });
  }
});

//methode POST quiz
server.post("/api/quiz", (req, res) => {
  const payload = req.body;
  const quizs = router.db.get("quiz");
  const newQuiz = { ...payload, id: uuidv4() };
  quizs.push(newQuiz).write();
  res.status(201).json(payload);
});

//route pour ajouter les questions dans un quiz donné
server.put("/api/addQuestions/:id", (req, res) => {
  const formQuestions = req.body;
  console.log(formQuestions);
  const quizId = req.params.id; // Pas besoin de parseInt car les IDs sont des strings
  const quizs = router.db.get("quiz");
  const quizArray = quizs.value();
  const quizIndex = quizArray.findIndex((quiz) => quiz.id == quizId);

  if (quizIndex == -1) {
    return res.status(404).json({ error: "quiz non trouvé", id: quizId });
  }

  const currentQuiz = quizArray[quizIndex];
  const updatedQuiz = { ...currentQuiz, ...formQuestions };
  console.log(updatedQuiz);

  quizs.splice(quizIndex, 1, updatedQuiz).write();
  const afterUpdate = quizs.value()[quizIndex];

  res.status(200).json({ success: true, quiz: updatedQuiz });
});

//route pour ajouter les resultats d'un quiz
server.post("/api/result", (req, res) => {
  try {
    const currentResult = req.body;
    const results = router.db("result.body").value();
    results.push(currentResult).write();
    res.status(201).json(currentResult);
  } catch (error) {
    console.error("Erreur lors de la récupération des quizs:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des quizs",
    });
  }
});

//route pour mettre à jour les données d'un resultat à jour apres avoir completé la sauvegarde
server.patch("/api/result/:userId/:quizId/", (req, res) => {
  const newresultData = req.body;
  const { userId, quizId } = req.params;
  const results = router.db.get("results").value();

  const resultIndex = results.findIndex(
    (result) => result.studentId === userId && result.quizId === quizId
  );

  if (resultIndex === -1) {
    return res.status(404).json({ error: "Résultat non trouvé", id: quizId });
  }

  const currentResult = results[resultIndex];
  
  const updatedResult = {
    ...currentResult,
    ...newresultData,
  };

  // Correction : utiliser lowdb pour la mise à jour
  router.db.get("results").splice(resultIndex, 1, updatedResult).write();

  res.status(200).json({ success: true, result: updatedResult });
});

// Route pour récupérer tous les résultats d'un quiz spécifique
server.get("/api/results/quizId/:quizId", (req, res) => {
  const { quizId } = req.params;
  console.log("Recherche de tous les résultats pour le quiz:", quizId);
  const results = router.db.get("results").value();

  const quizResults = results.filter((result) => result.quizId === quizId);
  console.log("Résultats trouvés:", quizResults.length);

  if (quizResults.length === 0) {
    return res
      .status(404)
      .json({ message: "Aucun résultat trouvé pour ce quiz" });
  }

  res.json(quizResults);
});

//route pour recuperer un resultat avec les filtres userId et quizId
server.get("/api/results/:userId/:quizId", (req, res) => {
  const { userId, quizId } = req.params;
  console.log("Recherche de résultats pour:", { userId, quizId });
  const results = router.db.get("results").value();
  console.log("Résultats disponibles:", results);
  console.log("Recherche avec studentId:", userId, "et quizId:", quizId);
  console.log(
    "Résultats disponibles:",
    results.map((r) => ({ studentId: r.studentId, quizId: r.quizId }))
  );

  const quizPassedByUser = results.find((result) => {
    const studentIdMatch = result.studentId === userId;
    const quizIdMatch = result.quizId === quizId;
    console.log("Comparaison:", {
      resultStudentId: result.studentId,
      studentIdMatch,
      resultQuizId: result.quizId,
      quizIdMatch,
    });
    return studentIdMatch && quizIdMatch;
  });

  console.log("Résultat trouvé:", quizPassedByUser);
  if (quizPassedByUser) {
    res.json(quizPassedByUser); // Renvoyer directement le résultat
  } else {
    res.status(404).json({ error: "aucun resultat disponible pour le moment" });
  }
});
//route pour obtenir les resultats d'un quiz donné
server.get("/api/results/quizId/:singleQuizID", (req, res) => {
  try {
    const quizId = req.params.singleQuizID;
    console.log("ID reçu du client:", {
      id: quizId,
      type: typeof quizId,
      length: quizId.length,
    });

    const results = router.db.get("results").value();

    // Afficher les détails de chaque ID de quiz dans les résultats
    results.forEach((result) => {
      if (result.quizId) {
        console.log("ID dans la base:", {
          id: result.quizId,
          type: typeof result.quizId,
          length: result.quizId.length,
        });
      }
    });

    const resultsData = results.filter((result) => {
      if (!result.quizId) return false;

      // Vérifier si les IDs sont exactement identiques
      const exactMatch = result.quizId === quizId;
      console.log(
        `Comparaison exacte entre ${result.quizId} et ${quizId}: ${exactMatch}`
      );

      return exactMatch;
    });

    console.log("Résultats filtrés:", resultsData);

    if (!resultsData || resultsData.length === 0) {
      console.log("Aucun résultat trouvé dans la base de données");
      return res
        .status(404)
        .json({ error: "Aucun résultat disponible pour ce quiz" });
    }

    res.json(resultsData || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des resultat:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
});

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

// Route pour obtenir un utilisateur spécifique par ID
server.get("/api/users/:id", (req, res) => {
  try {
    const userId = req.params.id;
    const users = router.db.get("users").value();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password, confirm_password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération de l'utilisateur",
    });
  }
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
});
