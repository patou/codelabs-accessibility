export const initialHtml = `
<!DOCTYPE html>
<!-- Missing lang attribute -->
<html>
<head>
  <title>Future of Web Conf</title>
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
    /* Bad contrast button */
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
    <h1>Future of Web Conf</h1>
    <p>Shaping the next generation of web experiences</p>
  </div>

  <div class="nav">
    <span>Home</span>
    <span>Schedule</span>
    <span>Speakers</span>
    <span>Register</span>
  </div>

  <div class="container">
    <div class="main-content">
      <div class="hero">
        <h2>Join Us in the Cloud!</h2>
        <p>A two-day virtual conference for developers, designers, and tech leaders.</p>
        <br>
        <div onclick="alert('Registration page is not implemented yet!')" class="register-btn">Register Now!</div>
      </div>
      
      <h3><b>Featured Sessions</b></h3>
      
      <div class="schedule-grid">
        <div class="session clearfix">
          <!-- Image without alt text -->
          <img src="https://picsum.photos/100/100" data-ai-hint="person portrait" class="speaker-img">
          <div class="session-title">The Accessibility First Approach</div>
          <p>Speaker: <i>Alex Doe</i></p>
          <p>Learn why accessibility isn't an afterthought and how to build inclusive web apps from the ground up.</p>
        </div>
        <div class="session clearfix">
          <img src="https://picsum.photos/101/101" data-ai-hint="person portrait" class="speaker-img">
          <div class="session-title">Server Components in the Wild</div>
          <p>Speaker: <i>Jane Smith</i></p>
          <p>A deep dive into React Server Components and how they are changing the landscape of web development.</p>
        </div>
      </div>
      
      <div class="form-section">
        <h4>Subscribe to our Newsletter</h4>
        <!-- Inputs without labels -->
        <input type="email" placeholder="Enter your email">
        <input type="submit" value="Subscribe">
      </div>
    </div>
  </div>

  <div class="footer">
    <p>&copy; 2024 Future of Web Conf. All rights reserved.</p>
  </div>

</body>
</html>
`;
