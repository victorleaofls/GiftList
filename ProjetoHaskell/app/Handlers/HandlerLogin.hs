{-# LANGUAGE OverloadedStrings #-}
module Handlers.HandlerLogin where

import Services.AuthService
import Prelude hiding (exp)
import Api.Model
import Database.PostgreSQL.Simple
import Control.Monad.IO.Class
import Control.Monad.Except
import Servant

handlerLogin :: Connection -> LoginRequest -> Handler TokenResponse
handlerLogin conn req = do
    res <- liftIO $ query conn
        "SELECT id, senha_hash, senha_salt FROM Usuario WHERE email = ?"
        (Only $ loginEmail req)
    case res of
        [(uid, hashB64, saltB64)] ->
            if verifyPassword (loginSenha req) saltB64 hashB64
                then do
                    jwt <- liftIO $ makeJwtToken uid
                    pure (TokenResponse jwt)
                else throwError err401 { errBody = "Credenciais invalidas" }
        _ -> throwError err401 { errBody = "Credenciais invalidas" }