{-# LANGUAGE DeriveGeneric #-}
module Api.Model where

import Data.Aeson
import Data.Char (toLower)
import Data.List (stripPrefix)
import GHC.Generics

data Calculadora = Calculadora {
    n1 :: Int,
    n2 :: Int 
} deriving (Show, Generic)

instance FromJSON Calculadora where 
instance ToJSON Calculadora where 

data ResultadoResponse = ResultadoResponse {
    resultado :: Int
} deriving (Show, Generic)

instance ToJSON ResultadoResponse where 

data Cliente = Cliente {
    id :: Int,
    nome :: String,
    cpf :: String
} deriving (Show, Generic)

instance FromJSON Cliente where 
instance ToJSON Cliente where 

data ClienteResponse = ClienteResponse {
    clientes :: [Cliente]
} deriving (Show, Generic)

instance ToJSON ClienteResponse where

jsonOptions :: String -> Options
jsonOptions prefix =
    defaultOptions
        { fieldLabelModifier = dropPrefix }
  where
    dropPrefix field =
        case stripPrefix prefix field of
            Just (x:xs) -> toLower x : xs
            _ -> field

data CadastroRequest = CadastroRequest {
    cadastroNomeCompleto :: String,
    cadastroEmail :: String,
    cadastroSenha :: String,
    cadastroConfirmarSenha :: String
} deriving (Show, Generic)

instance FromJSON CadastroRequest where
    parseJSON = genericParseJSON (jsonOptions "cadastro")

data CadastroResponse = CadastroResponse {
    cadastroUsuarioId :: Int
} deriving (Show, Generic)

instance ToJSON CadastroResponse where
    toJSON = genericToJSON (jsonOptions "cadastro")

data LoginRequest = LoginRequest {
    loginEmail :: String,
    loginSenha :: String
} deriving (Show, Generic)

instance FromJSON LoginRequest where
    parseJSON = genericParseJSON (jsonOptions "login")

data TokenResponse = TokenResponse {
    token :: String
} deriving (Show, Generic)

instance ToJSON TokenResponse where

data UsuarioResponse = UsuarioResponse {
    usuarioId :: Int,
    usuarioNome :: String
} deriving (Show, Generic)

instance ToJSON UsuarioResponse where
    toJSON = genericToJSON (jsonOptions "usuario")
