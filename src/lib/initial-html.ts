export const initialHtml = `
<!DOCTYPE html>
<!-- Attribut lang manquant -->
<html>
<head>
  <title>Conférence sur l'Avenir du Web</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; margin: 0; }
    .container { max-width: 960px; margin: auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 1rem; text-align: center; }
    .nav { background: #333; padding: 0.5rem; text-align: center; }
    .nav span { color: white; margin: 0 15px; cursor: pointer; }
    .hero { text-align: center; padding: 50px 20px; background: #eee; }
    .schedule-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
    .session { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
    .session-title { font-size: 1.2em; color: #0056b3; }
    .speaker-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; float: left; margin-right: 15px;}
    /* Bouton avec mauvais contraste */
    .register-btn { background-color: #87CEEB; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .footer { text-align: center; margin-top: 40px; padding: 20px; background: #1a1a1a; color: white; font-size: 0.9em; }
    .form-section { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 8px; }
    .form-section input[type=email] { padding: 8px; width: 250px; margin-right: 10px; border: 1px solid #ccc; border-radius: 4px; }
    .form-section input[type=submit] { padding: 8px 15px; background: #0056b3; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .clearfix::after { content: ""; clear: both; display: table; }
  </style>
</head>
<body>

  <div class="header">
    <h1>Conférence sur l'Avenir du Web</h1>
    <p>Façonner la prochaine génération d'expériences web</p>
  </div>

  <div class="nav">
    <span>Accueil</span>
    <span>Programme</span>
    <span>Intervenants</span>
    <span>S'inscrire</span>
  </div>

  <div class="container">
    <div class="main-content">
      <div class="hero">
        <h2>Rejoignez-nous dans le Cloud !</h2>
        <p>Une conférence virtuelle de deux jours pour les développeurs, designers et leaders technologiques.</p>
        <br>
        <div onclick="alert('La page d'inscription n'est pas encore implémentée !')" class="register-btn">Inscrivez-vous maintenant !</div>
      </div>
      
      <h3><b>Sessions à la une</b></h3>
      
      <div class="schedule-grid">
        <div class="session clearfix">
          <!-- Image sans texte alternatif -->
          <img src="https://picsum.photos/100/100" data-ai-hint="personne portrait" class="speaker-img">
          <div class="session-title">L'approche "L'accessibilité d'abord"</div>
          <p>Intervenant : <i>Alex Doe</i></p>
          <p>Découvrez pourquoi l'accessibilité n'est pas une réflexion après coup et comment créer des applications web inclusives dès le départ.</p>
        </div>
        <div class="session clearfix">
          <img src="https://picsum.photos/101/101" data-ai-hint="personne portrait" class="speaker-img">
          <div class="session-title">Les Server Components en action</div>
          <p>Intervenante : <i>Jane Smith</i></p>
          <p>Une plongée en profondeur dans les React Server Components et comment ils changent le paysage du développement web.</p>
        </div>
      </div>
      
      <div class="form-section">
        <h4>Abonnez-vous à notre newsletter</h4>
        <!-- Champs de saisie sans étiquettes -->
        <input type="email" placeholder="Entrez votre email">
        <input type="submit" value="S'abonner">
      </div>
    </div>
  </div>

  <div class="footer">
    <p>&copy; 2024 Conférence sur l'Avenir du Web. Tous droits réservés.</p>
  </div>

</body>
</html>
`;