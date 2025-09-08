// In a real application, you would use a database like Firestore, Redis, or a SQL database.
// For this demo, we use a simple in-memory Map to store the HTML content for each session.
// The data will be lost when the server restarts.
export const htmlStore = new Map<string, string>();
