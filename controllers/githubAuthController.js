/* const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const express = require('express');
const User = require ('../models/User');

const router = express.Router();
require('dotenv').config();

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL:process.env.GITHUB_CALLBACK_URL
        },
        async(accessToken,refreshToken,profile,cb)=>{
            const user = await User.findOne({
                gitId: profile.id,
                provider:'github'
            });
            if(!user){
                console.log('Adding new github user to DB..');
                const user = new User({
                    gitId:profile.id,
                    name:profile.username,
                    email:profile.email,
                    image:profile.avatarUrl,
                    provider:profile.providerzz
                });
                await user.save();
                return cb(null,profile);
            }else{
                console.log('Github user already exist in DB..');
                return cb(null,profile);
            }
        }
    )
) */