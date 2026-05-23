{-# LANGUAGE OverloadedStrings #-}
module Handlers.HandlerCadastro where

import Services.AuthService
import Prelude hiding (exp)
import Api.Model
import Database.PostgreSQL.Simple
import Control.Monad (when)
import Control.Monad.IO.Class
import Control.Monad.Except
import Servant

handlerCadastro :: Connection -> CadastroRequest -> Handler CadastroResponse
handlerCadastro conn req = do
    when (cadastroSenha req /= cadastroConfirmarSenha req) $
        throwError err400 { errBody = "Senha e confirmarSenha nao conferem" }
    existing <- liftIO
        (query conn "SELECT id FROM Usuario WHERE email = ?" (Only $ cadastroEmail req) :: IO [Only Int])
    case existing of
        (_ : _) -> throwError err409 { errBody = "Email ja cadastrado" }
        [] -> do
            hashed <- liftIO $ hashPassword (cadastroSenha req)
            case hashed of
                Left _ -> throwError err500 { errBody = "Falha ao gerar hash da senha" }
                Right (hashB64, saltB64) -> do
                    res <- liftIO $ query conn
                        "INSERT INTO Usuario (nome_completo, email, senha_hash, senha_salt) VALUES (?,?,?,?) RETURNING id"
                        (cadastroNomeCompleto req, cadastroEmail req, hashB64, saltB64)
                    case res of
                        [Only novoId] -> pure (CadastroResponse novoId)
                        _ -> throwError err500