{-# LANGUAGE OverloadedStrings #-}
module Handlers.HandlerUsuario where

import Api.Model
import Services.AuthService
import Database.PostgreSQL.Simple
import Control.Monad.IO.Class
import Control.Monad.Except
import Servant

handlerGetUsuario :: Connection -> Int -> Maybe String -> Handler UsuarioResponse
handlerGetUsuario conn targetId mAuth = do
    case mAuth of
        Nothing -> throwError err401
        Just authHeader -> do
            maybeUserId <- liftIO $ validateToken authHeader
            case maybeUserId of
                Nothing -> throwError err401
                Just _ -> do
                    -- Busca o usuário pelo ID
                    res <- liftIO $ query conn "SELECT id, nome_completo FROM Usuario WHERE id = ?" [targetId]
                    case res of
                        [(uid, uNome)] -> pure (UsuarioResponse uid uNome)
                        _ -> throwError err404
