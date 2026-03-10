import env from "@/utils/env";
import { Router } from "express";
import crypto from "crypto";

const router = Router();

router.get('/', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');

    res.cookie('oauth_state', state, { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', expires: new Date(Date.now() + 10 * 60 * 1000) }); // Expires in 10 minutes

    const params = new URLSearchParams({
        client_id: env.discordClientId,
        redirect_uri: env.discordRedirectUrl,
        response_type: 'code',
        scope: 'identify email',
        state: state
    });

    res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});

router.get('/discord/callback', (req, res) => {
    const { code, state } = req.query;
});

export default router;