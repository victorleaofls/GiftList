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

lookupEnvOr :: String -> String -> IO String
lookupEnvOr env def = do
    mv <- lookupEnv env
    case mv of
        Just v  -> pure v
        Nothing -> pure def

main :: IO ()
main = do 
    putStrLn "Servidor rodando na porta 8080"

    host <- lookupEnvOr "PGHOST" "postgres"
    port <- lookupEnvOr "PGPORT" "5432"
    dbname <- lookupEnvOr "PGDATABASE" "haskads"
    user <- lookupEnvOr "PGUSER" "haskads_user"
    password <- lookupEnvOr "PGPASSWORD" "haskads_password"
    conn <- connectPostgreSQL $ "host=" ++ host ++ " port=" ++ port ++ " dbname=" ++ dbname ++ " user=" ++ user ++ " password=" ++ password ++ " sslmode=disable"

    runMigration conn "migration.sql"

    run 8080 (app conn)
