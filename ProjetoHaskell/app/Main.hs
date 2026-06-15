{-# LANGUAGE OverloadedStrings #-}
module Main (main) where

import Server.Routes
import Network.Wai.Handler.Warp
import Control.Monad
import Database.PostgreSQL.Simple
import Database.PostgreSQL.Simple.Types 
import qualified Data.ByteString.Char8 as BS
import System.Environment (lookupEnv)

runMigration :: Connection -> FilePath -> IO ()
runMigration conn fp = do
  sql <- readFile fp
  void $ execute_ conn (Query $ BS.pack sql)

main :: IO ()
main = do 
    putStrLn "Servidor rodando na porta 8080"

    mConnStr <- lookupEnv "DATABASE_URL"
    let connStr = case mConnStr of
            Just cs -> cs
            Nothing -> "host=postgres port=5432 dbname=haskads user=haskads_user password=haskads_password sslmode=disable"
    conn <- connectPostgreSQL (BS.pack connStr)

    runMigration conn "migration.sql"

    run 8080 (app conn)
