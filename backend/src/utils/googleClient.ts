import { OAuth2Client } from "google-auth-library";

export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
