const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env.local") });
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jsonServer = require("json-server");

const server = jsonServer.create();
const { error } = require("console");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const port = 3000;
const { resend } = require("./src/lib/resend");
const { create } = require("domain");

// Génère un code à 6 caractères
const generateToken = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

// Utiliser les middlewares par défaut (logger, static, cors et no-cache)
server.use(middlewares);

// Pour pouvoir parser le body des requêtes en JSON
server.use(jsonServer.bodyParser);

// Middleware pour simuler un délai (optionnel)
server.use((req, res, next) => {
  setTimeout(next, 500);
});

// Configuration
const JWT_SECRET = "votre_clé_secrète";
const TOKEN_EXPIRY = "1h";
const REFRESH_SECRET = "votre_refresh_secret";
const REFRESH_EXPIRY = "7d";

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware d'autorisation
function authorize(roles = []) {
  return (req, res, next) => {
    const user = router.db.get("users").find({ id: req.user.userId }).value();
    if (!roles.includes(user.role)) return res.sendStatus(403);
    next();
  };
}

// Routes d'authentification
// -------------------------------------------------

// POST /api/auth/login
server.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });

  // Mise à jour du refresh token en base (simulé avec json-server)
  router.db.get("users").find({ id: user.id }).assign({ refreshToken }).write();

  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/refresh
server.post("/api/auth/refresh", (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.sendStatus(400);

  try {
    const decoded = jwt.verify(refresh_token, REFRESH_SECRET);
    const user = router.db.get("users").find({ id: decoded.userId }).value();

    if (!user || user.refreshToken !== refresh_token) {
      return res.sendStatus(403);
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({ access_token: newAccessToken });
  } catch (error) {
    res.sendStatus(403);
  }
});

// POST /api/auth/logout
server.post("/api/auth/logout", authenticateToken, (req, res) => {
  router.db
    .get("users")
    .find({ id: req.user.userId })
    .assign({ refreshToken: null })
    .write();

  res.json({ message: "Déconnexion réussie" });
});

// GET /api/auth/me
server.get("/api/auth/me", authenticateToken, (req, res) => {
  const user = router.db.get("users").find({ id: req.user.userId }).value();
  if (!user) return res.sendStatus(404);

  const { password, refreshToken, ...userData } = user;
  res.json(userData);
});

// Exemple 1: Route pour obtenir les utilisateurs
server.get("/api/users", (req, res) => {
  try {
    const { page = 1, pageSize = 5, gender, role } = req.query;

    let users = router.db.get("users").value();
    const usersArray = router.db.get("users").value();
    const branchArray = router.db.get("branch").value();
    console.log("Utilisateurs récupérés:", users ? users.length : 0);

    if (!users || users.length === 0) {
      console.log("Aucun utilisateur trouvé dans la base de données");
    }

    // Filtrage par genre
    if (gender) {
      const genders = gender.split(",");
      users = users.filter((user) => genders.includes(user.sexe));
    }

    // Filtrage par rôle (si vous voulez aussi filtrer côté serveur)
    if (role) {
      const roles = role.split(",");
      users = users.filter((user) => roles.includes(user.role));
    }

    if (role && role.split(",").includes("Parent")) {
      users = users.map((user) => {
        if (user.role === "Parent") {
          // Récupérer les étudiants liés à ce parent
          const students = user.studentArrayId
            .map((id) => usersArray.find((u) => u.id === id))
            .filter(Boolean) // Filtrer les étudiants non trouvés
            .map((student) => ({
              name: student.name,
              surname: student.surname,
              id: student.id,
              // Ajouter d'autres champs si nécessaire
            }));

          return {
            ...user,
            students, // Nouveau champ avec les données des étudiants
          };
        }
        return user;
      });
    }

    if (role && role.split(",").includes("Student")) {
      users = users.map((user) => {
        if (user.role === "Student") {
          // Récupérer la branch liés à ce
          const branch = branchArray.find((b) => b.id === user.branch);

          return {
            ...user,
            branchName: branch.name, // Nouveau champ avec les données des étudiants
          };
        }
        return user;
      });
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = users.slice(start, end);

    res.json({
      users: paginatedUsers,
      totalCount: users.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
});

//route pour un obtenir un user grace à l'email et telephone
server.get("/api/user/check-existing", (req, res) => {
  try {
    const { email, phone } = req.query;

    // Validation des paramètres
    if (!email && !phone) {
      return res.status(400).json({
        error: "Au moins un paramètre (email ou phone) est requis",
      });
    }

    const users = router.db.get("users").value();
    let exists = false;
    let existingField = null;

    // Recherche dans la base de données
    const existingUser = users.find((user) => {
      if (email && user.email === email) {
        existingField = "email";
        return true;
      }
      if (phone && user.phone === phone) {
        existingField = "phone";
        return true;
      }
      return false;
    });

    exists = Boolean(existingUser);

    // Logging pour le débogage
    console.log(
      `Vérification existance - Email: ${email}, Téléphone: ${phone}`
    );
    console.log(
      `Résultat: ${exists ? "Existe" : "Nexiste pas"}` +
        (existingField ? ` (Champ existant: ${existingField})` : "")
    );

    // Réponse structurée
    res.json({
      exists,
      existingField,
      user: exists
        ? {
            id: existingUser.id,
            email: existingUser.mail,
            phone: existingUser.telephone,
          }
        : null,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la vérification",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

//route pour un obtenir les users de role student
server.get("/api/userStudents", (req, res) => {
  try {
    const users = router.db.get("users").value();
    const userStudentArray = users.filter((user) => user.role == "Student");
    console.log(
      "Utilisateur récupéré:",
      userStudentArray ? userStudentArray.length : 0
    );

    if (!userStudentArray || userStudentArray.length === 0) {
      console.log("Aucun utilisateur trouvé dans la base de données");
    }
    const StudentData = userStudentArray.map((user) =>
      user.password ? delete user.password : user
    );

    res.json(StudentData || []);
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
  const email = payload.mail;
  const verificationCode = generateToken();
  const passwordHash = await bcrypt.hash(verificationCode, 10);
  // const token = jwt.sign({ email, code: verificationCode }, JWT_SECRET, {
  //   expiresIn: "1h",
  // });
  const userData = {
    ...payload,
    password: passwordHash,
    id: uuidv4(),
    verificationCode,
  };
  const { confirm_password, ...newUserData } = userData;
  users.push(newUserData).write();
  const getEmailTemplate = (validationLink) => `
    <div
      style="
        font-family: Arial, sans-serif;
        background-color: #f5f7fa;
        padding: 20px;
        color: #333;
      "
    >
      <div
        style="
          max-width: 600px;
          margin: auto;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        "
      >
        <div
          style="
            background-color: #007bff;
            padding: 20px;
            color: #fff;
            text-align: center;
          "
        >
          <h2 style="margin: 0">Bienvenue à CAbInfo!</h2>
        </div>

        <div style="padding: 30px">
          <p>Bonjour ${payload.surname},</p>
          <p>
            Nous avons créer votre compte avec succès. Nous sommes ravis de vous compter
            parmi nous.
          </p>
          <p>Nous vous prions de bien vouloir vous connecter à notre plateforme pour une meilleure expérience avec la formation</p>
          <p style="margin-top: 20px">pour ce faire, vous aurez besoin du mot de passe confidentiel ci-dessous pour vous connecter:</p>

          <table style="width: 100%; margin-top: 10px">
            <tr>
              <td><strong>Mot de passe:</strong></td>
              <td>${verificationCode}</td>
            </tr>
            <tr>
              <td>
                <a href="${validationLink}">Me connecter</a>
              </td>
            </tr>
          </table>

          <p style="margin-top: 30px">À très bientôt,<br />L'équipe</p>
        </div>

        <div
          style="
            background-color: #f0f0f0;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888;
          "
        >
          © ${new Date().getFullYear()} CabInfo_Edu! – Tous droits réservés
        </div>
      </div>
    </div>
  `;
  const sendEmail = async (email, validationLink) => {
    try {
      const data = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "djkarel92@gmail.com",
        // email,
        subject: "Validate Account",
        html: getEmailTemplate(validationLink),
      });
      console.log("Email sent successfully:", data);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };
  // Appelez sendEmail après la création de l'utilisateur
  const emailSent = await sendEmail(email, `http://localhost:5173/login`);
  if (!emailSent) {
    console.warn("Email could not be sent");
  }
  res.status(201).json(userData);
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
  try {
    const newUserData = req.body;
    const userID = req.params.id;
    const users = router.db.get("users");
    const currentUser = users.find({ id: userID }).value();

    if (!currentUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // 1. Cloner les nouvelles données
    const updatedUser = { ...newUserData, id: userID };

    // 2. Nettoyage spécifique lors du changement de rôle Parent
    if (currentUser.role === "Parent" && newUserData.role !== "Parent") {
      updatedUser.studentArrayId = undefined; // Suppression explicite
      console.log(`Nettoyage studentArrayId pour l'utilisateur ${userID}`);
    }

    // 3. Nettoyage spécifique lors du changement de rôle Student
    if (currentUser.role === "Student" && newUserData.role !== "Student") {
      updatedUser.branch = undefined;
    }

    // 4. Fusion avec les anciennes données
    const finalUser = {
      ...currentUser,
      ...updatedUser,
      // Protection des champs critiques
      password: currentUser.password, // Ne jamais écraser le mot de passe
    };
    console.log(currentUser.password);

    // 5. Mise à jour en base de données
    users.find({ id: userID }).assign(finalUser).write();

    res.status(200).json({
      success: true,
      user: users.find({ id: userID }).value(),
    });
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

//route pour modifier le password d'un user connecté
server.patch("/api/updatePassword/:userId", async (req, res) => {
  const { newPassword, currentPassword } = req.body;
  const { userId } = req.params;

  try {
    const users = router.db.get("users");
    const user = await users.find({ id: userId }).value();
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    hashedPassword = await bcrypt.hash(newPassword, 10);
    await users
      .find({ id: userId })
      .assign({ password: hashedPassword })
      .write();

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//route pour reset le password d'un compte
server.patch("/api/resetPassword/:userMail", async (req, res) => {
  const { userMail } = req.params;

  try {
    const users = router.db.get("users");
    const user = await users.find({ email: userMail }).value();
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const verificationCode = generateToken();
    const hashedPassword = await bcrypt.hash(verificationCode, 10);

    await users
      .find({ email: userMail })
      .assign({ password: hashedPassword })
      .write();

    const getEmailTemplate = (validationLink) => `
    <div
      style="
        font-family: Arial, sans-serif;
        background-color: #f5f7fa;
        padding: 20px;
        color: #333;
      "
    >
      <div
        style="
          max-width: 600px;
          margin: auto;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        "
      >
        <div
          style="
            background-color: #007bff;
            padding: 20px;
            color: #fff;
            text-align: center;
          "
        >
          <h2 style="margin: 0">Reset Password !</h2>
        </div>

        <div style="padding: 30px">
          <p>Bonjour ${user.surname},</p>
          <p>
           veuillez utiliser le mot de passe suivant afin de vous connectez à votre compte:
          </p>
          <p style="width: 100%; height: 20px, font-size: 20px, font-weight: bold">${verificationCode}</p>
          <p style="margin-top: 20px"><a href="${validationLink}">Me connecter</a></p>
          <p style="margin-top: 20px">Pour plus de sécurité, veuillez mettre à jour votre mot de passe dans votre session!</p>
          <p style="margin-top: 30px">À très bientôt,<br />L'équipe</p>
        </div>

        <div
          style="
            background-color: #f0f0f0;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888;
          "
        >
          © ${new Date().getFullYear()} CabInfo_Edu! – Tous droits réservés
        </div>
      </div>
    </div>
  `;
    const sendEmail = async (email, validationLink) => {
      try {
        const data = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "djkarel92@gmail.com",
          // email,
          subject: "Reset Password",
          html: getEmailTemplate(validationLink),
        });
        console.log("Email sent successfully:", data);
        return true;
      } catch (error) {
        console.error("Error sending email:", error);
        return false;
      }
    };
    // Appelez sendEmail après la création de l'utilisateur
    const emailSent = await sendEmail(
      user.email,
      `http://localhost:5173/login`
    );
    if (!emailSent) {
      console.warn("Email could not be sent");
    }

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//Route pour obtenir les branches avec filtre
server.get("/api/branchs", (req, res) => {
  try {
    const { page = 1, pageSize = 5 } = req.query;
    const branchs = router.db.get("branch").value();

    if (!branchs || branchs.length === 0) {
      console.log("Aucune branche trouvé dans la base de données");
    }
    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = branchs.slice(start, end);

    res.json({
      branchs: paginatedUsers,
      totalCount: branchs.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des branches:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des branches",
    });
  }
});

//Route pour obtenir toutes les branches
server.get("/api/branchs/all", (req, res) => {
  try {
    const branchs = router.db.get("branch").value();

    if (!branchs || branchs.length === 0) {
      console.log("Aucune branche trouvé dans la base de données");
    }

    res.json(branchs || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des branches:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des branches",
    });
  }
});

//route pour un obtenir une branch grace à son name
server.get("/api/branch/check-existing", (req, res) => {
  try {
    const { name } = req.query;

    // Validation des paramètres
    if (!name) {
      return res.status(400).json({
        error: "le paramètre (name) est requis",
      });
    }

    const branchs = router.db.get("branch").value();
    let exists = false;
    let existingField = null;

    // Recherche dans la base de données
    const existingBranch = branchs.find((branch) => {
      if (name && branch.name === name) {
        existingField = "name";
        return true;
      }
      return false;
    });

    exists = Boolean(existingBranch);

    // Logging pour le débogage
    console.log(`Vérification existance - Branch: ${name}`);
    console.log(
      `Résultat: ${exists ? "Existe" : "Nexiste pas"}` +
        (existingField ? ` (Champ existant: ${existingField})` : "")
    );

    // Réponse structurée
    res.json({
      exists,
      existingField,
      branch: exists
        ? {
            id: existingBranch.id,
            name: existingBranch.name,
          }
        : null,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la vérification",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

//methode POST branch
server.post("/api/branch", async (req, res) => {
  const newBranch = req.body;
  const branchs = router.db.get("branch");
  const branchData = {
    ...newBranch,
    id: uuidv4(),
    create_at: new Date().toISOString(),
  };
  branchs.push(branchData).write();
  res.status(201).json(branchData);
});

//route pour supprimer une branche specifique
server.delete("/api/deleteBranch/:id", (req, res) => {
  const branchID = req.params.id;

  const branchs = router.db.get("branch");

  // Récupérer le tableau complet pour vérification
  const branchsArray = branchs.value();

  // Vérifier les IDs existants et leur type
  const existingIds = branchsArray.map((u) => ({
    id: u.id,
    type: typeof u.id,
  }));

  // Trouver l'index directement dans le tableau (pas dans la chaîne lowdb)
  const branchIndex = branchsArray.findIndex(
    (branch) => branch.id === branchID
  );

  if (branchIndex == -1) {
    return res.status(404).json({ error: "branche non trouvée", id: branchID });
  }

  // Supprimer l'utilisateur spécifique en utilisant l'API lowdb
  const removedBranch = branchs.splice(branchIndex, 1).write();

  // Vérifier le résultat
  console.log("Utilisateur supprimé:", JSON.stringify(removedBranch));
  console.log(
    "Utilisateurs après suppression:",
    JSON.stringify(branchs.value())
  );

  res.status(200).json({ success: true, id: branchID, removed: removedBranch });
});

//route pour mettre à jour les données d'une branche spécifique
server.patch("/api/updatebranch/:id", (req, res) => {
  const newBranchData = req.body;
  const branchId = req.params.id; // Pas besoin de parseInt car les IDs sont des strings

  const branchs = router.db.get("branch");
  const branchsArray = branchs.value();

  // Trouver l'utilisateur par ID
  const branchIndex = branchsArray.findIndex(
    (branch) => branch.id === branchId
  );

  if (branchIndex == -1) {
    return res.status(404).json({ error: "branche non trouvée", id: branchId });
  }

  // Récupérer l'utilisateur actuel et fusionner les nouvelles données
  const currentBranch = branchsArray[branchIndex];
  const updatedBrach = { ...currentBranch, ...newBranchData };

  // Mettre à jour l'utilisateur dans l'objet lowdb
  branchs.splice(branchIndex, 1, updatedBrach).write();

  // Vérifier la mise à jour
  const afterUpdate = branchs.value()[branchIndex];

  res.status(200).json({ success: true, branch: updatedBrach });
});

// route pour recupérer les quizs en fonction d'une branche
server.get("/api/quiz/:userBranch", (req, res) => {
  try {
    const branchUser = req.params.userBranch;
    const quizs = router.db.get("quiz").value();
    const filteredQuizs = quizs.filter((quiz) =>
      quiz.branchId.includes(branchUser)
    );

    if (!filteredQuizs || quizs.length === 0) {
    }

    res.json(filteredQuizs || []);
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
  const newQuiz = { ...payload, id: uuidv4(), create_At: new Date() };
  quizs.push(newQuiz).write();
  res.status(201).json(newQuiz);
});

//methode pour supprimer un quiz donné
server.delete("/api/deleteQuiz/:id", (req, res) => {
  const quizID = req.params.id;

  const quizs = router.db.get("quiz");

  // Récupérer le tableau complet pour vérification
  const quizsArray = quizs.value();

  // Vérifier les IDs existants et leur type
  const existingIds = quizsArray.map((u) => ({ id: u.id, type: typeof u.id }));

  // Trouver l'index directement dans le tableau (pas dans la chaîne lowdb)
  const quizIndex = quizsArray.findIndex((quiz) => quiz.id === quizID);

  if (quizIndex == -1) {
    return res
      .status(404)
      .json({ error: "Utilisateur non trouvé", id: quizID });
  }

  // Supprimer l'utilisateur spécifique en utilisant l'API lowdb
  const removedQuiz = quizs.splice(quizIndex, 1).write();

  // Vérifier le résultat
  console.log("Utilisateur supprimé:", JSON.stringify(removedQuiz));
  console.log("Utilisateurs après suppression:", JSON.stringify(quizs.value()));

  res.status(200).json({ success: true, id: quizID, removed: removedQuiz });
});

//route pour update un quiz donné
server.patch("/api/updateQuiz/:id", (req, res) => {
  const newQuizData = req.body;
  const quizID = req.params.id; // Pas besoin de parseInt car les IDs sont des strings

  const quizs = router.db.get("quiz");
  const quizArray = quizs.value();

  // Trouver l'utilisateur par ID
  const quizIndex = quizArray.findIndex((quiz) => quiz.id === quizID);

  if (quizIndex == -1) {
    return res
      .status(404)
      .json({ error: "Utilisateur non trouvé", id: userID });
  }

  // Récupérer l'utilisateur actuel et fusionner les nouvelles données
  const currentQuiz = quizArray[quizIndex];
  const updatedQuiz = { ...currentQuiz, ...newQuizData };

  // Mettre à jour l'utilisateur dans l'objet lowdb
  quizs.splice(quizIndex, 1, updatedQuiz).write();

  // Vérifier la mise à jour
  const afterUpdate = quizs.value()[quizIndex];

  res.status(200).json({ success: true, quiz: updatedQuiz });
});

//route pour ajouter les questions dans un quiz donné
server.put("/api/addQuestions/:id", (req, res) => {
  const { quizQuestions } = req.body;
  console.log(quizQuestions);
  const quizId = req.params.id; // Pas besoin de parseInt car les IDs sont des strings
  const quizs = router.db.get("quiz");
  const quizArray = quizs.value();
  const quizIndex = quizArray.findIndex((quiz) => quiz.id == quizId);

  if (quizIndex == -1) {
    return res.status(404).json({ error: "quiz non trouvé", id: quizId });
  }

  const currentQuiz = quizArray[quizIndex];
  const updatedQuiz = { ...currentQuiz, quizQuestions };
  console.log(updatedQuiz);

  quizs.splice(quizIndex, 1, updatedQuiz).write();
  const afterUpdate = quizs.value()[quizIndex];

  res.status(200).json(updatedQuiz);
});

//route pour ajouter les resultats d'un quiz
server.post("/api/result", (req, res) => {
  try {
    const currentResult = req.body;
    const results = router.db("result.body").value();
    const newQUIZ = { ...currentResult, id: uuidv4() };
    results.push(newQUIZ).write();
    res.status(201).json(newQUIZ);
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

//route pour un obtenir les resultats d'un user grace à son id
server.get("/api/results/:userId", (req, res) => {
  try {
    const userId = req.params.userId;
    const results = router.db.get("results").value();
    console.log(results);
    const userResults = results.filter(
      (result) => result.studentId == userId && result.status == "complete"
    );
    console.log("user truver", userId);
    if (!userResults || userResults.length === 0) {
      console.log("Aucun resultat trouvé dans la base de données");
    }

    res.json(userResults || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des resultats:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des resultats",
    });
  }
});

//route pour avoir les resultats d'un quiz donné combiné aux noms des users correspondant à chaque resultat via le authorId
server.get("/api/results/quizId/authorId/:quizId/:authorId", (req, res) => {
  const { quizId, authorId } = req.params;
  console.log("Recherche de tous les résultats pour le quiz:", quizId);
  const results = router.db.get("results").value();
  const users = router.db.get("users").value();

  const quizResults = results.filter(
    (result) => result.quizId === quizId && result.authorId === authorId
  );
  console.log("Résultats trouvés:", quizResults.length);

  // Créer un Map des résultats groupés par studentId
  const resultsByStudentId = quizResults.reduce((acc, result) => {
    if (!acc[result.studentId]) {
      acc[result.studentId] = [];
    }
    acc[result.studentId].push(result);
    return acc;
  }, {});

  // Combiner avec les users
  const combinedData = users
    .filter((user) => resultsByStudentId[user.id])
    .map((user) => ({
      ...user,
      quizResults: resultsByStudentId[user.id] || [],
    }));

  if (combinedData.length === 0) {
    return res
      .status(404)
      .json({ message: "Aucun résultat trouvé pour ce quiz" });
  }

  res.json(combinedData);
  console.log(combinedData);
});

// Route pour afficher les résultats des students dans les comptes des parents
server.get("/api/results/parentId/:parentId", (req, res) => {
  const { parentId } = req.params;
  const results = router.db.get("results").value();
  const users = router.db.get("users").value();

  // Trouver le parent
  const parentUser = users.find((user) => user.id == parentId);

  if (!parentUser) {
    return res.status(404).json({ message: "Parent non trouvé" });
  }

  console.log("parent trouvé:", parentId);

  // Vérifier si le parent a des étudiants associés
  if (!parentUser.studentArrayId || parentUser.studentArrayId.length === 0) {
    return res
      .status(404)
      .json({ message: "Aucun étudiant associé à ce parent" });
  }

  // Récupérer tous les résultats des étudiants du parent
  let quizResults = [];
  parentUser.studentArrayId.forEach((studentId) => {
    const studentResults = results.filter(
      (result) => result.studentId === studentId && result.status === "complete"
    );
    quizResults = quizResults.concat(studentResults);
  });

  console.log("Nombre de résultats trouvés:", quizResults.length);

  // Créer un objet pour regrouper les résultats par studentId
  const resultsByStudentId = {};
  quizResults.forEach((result) => {
    if (!resultsByStudentId[result.studentId]) {
      resultsByStudentId[result.studentId] = [];
    }
    resultsByStudentId[result.studentId].push(result);
  });

  // Combiner avec les informations des users (étudiants)
  const combinedDataStudent = [];
  parentUser.studentArrayId.forEach((studentId) => {
    const student = users.find((user) => user.id === studentId);
    if (student) {
      combinedDataStudent.push({
        student: {
          id: student.id,
          name: student.name,
          surname: student.surname,
          telephone: student.telephone,
          // Ajoutez d'autres champs si nécessaire
        },
        quizResults: resultsByStudentId[studentId] || [],
      });
    }
  });

  if (combinedDataStudent.length === 0) {
    return res.status(404).json({
      message: "Aucun résultat trouvé pour les étudiants de ce parent",
    });
  }

  res.json(combinedDataStudent);
  console.log(combinedDataStudent);
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
