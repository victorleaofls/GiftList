{-# LANGUAGE OverloadedStrings #-}
module Main (main) where

import Server.Routes
import Network.Wai.Handler.Warp
import Database.PostgreSQL.Simple
import qualified Data.ByteString.Char8 as BS
import System.Environment (lookupEnv)

main :: IO ()
main = do 
    putStrLn "Servidor rodando na porta 8080"

    mConnStr <- lookupEnv "DATABASE_URL"
    let connStr = case mConnStr of
            Just cs -> cs
            Nothing -> "host=postgres port=5432 dbname=haskads user=haskads_user password=haskads_password sslmode=disable"
    conn <- connectPostgreSQL (BS.pack connStr)

    run 8080 (app conn)
