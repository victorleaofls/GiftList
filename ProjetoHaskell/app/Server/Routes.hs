{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE OverloadedStrings #-}
module Server.Routes where 

import Api.Model
import Data.Proxy
import Network.HTTP.Types (status200, status403)
import Network.Wai
import Servant.API
import Servant.Server
import Database.PostgreSQL.Simple
import Control.Monad.IO.Class
import Control.Monad.Except
import Handlers.HandlerCadastro
import Handlers.HandlerLogin
import qualified Handlers.HandlerLista as Lista
import Handlers.HandlerUsuario

type API = 
         "hello" :> Get '[PlainText] String 
    :<|> "soma" :> ReqBody '[JSON] Calculadora :> Post '[JSON] ResultadoResponse
    :<|> "soma"  :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "cliente" :> ReqBody '[JSON] Cliente :> Post '[JSON] ResultadoResponse 
    :<|> "cliente"  :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "clientes" :> Get '[JSON] ClienteResponse
    :<|> "usuario" :> ReqBody '[JSON] Cliente :> Post '[JSON] ResultadoResponse
    :<|> "usuario" :> Capture "id" Int :> Header "Authorization" String :> Get '[JSON] UsuarioResponse
    :<|> "usuario" :> Capture "id" Int :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "cadastro" :> ReqBody '[JSON] CadastroRequest :> Post '[JSON] CadastroResponse
    :<|> "cadastro" :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "login" :> ReqBody '[JSON] LoginRequest :> Post '[JSON] TokenResponse
    :<|> "login" :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "listas" :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "listas" :> QueryParam "query" String :> Get '[JSON] [GiftListResponse]
    :<|> "listas" :> Header "Authorization" String :> ReqBody '[JSON] GiftListRequest :> Post '[JSON] GiftListResponse
    :<|> "listas" :> Capture "id" Int :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "listas" :> Capture "id" Int :> Get '[JSON] GiftListResponse
    :<|> "listas" :> Capture "id" Int :> Header "Authorization" String :> Get '[JSON] GiftListResponse
    :<|> "listas" :> Capture "id" Int :> Header "Authorization" String :> ReqBody '[JSON] GiftListRequest :> Put '[JSON] GiftListResponse
    :<|> "listas" :> Capture "id" Int :> Header "Authorization" String :> DeleteNoContent
    :<|> "listas" :> "minhas" :> Header "Authorization" String :> Get '[JSON] [GiftListResponse]
    :<|> "listas" :> Capture "listId" Int :> "itens" :> Capture "itemId" Int :> "contribuir" :> Verb 'OPTIONS 200 '[JSON] ()
    :<|> "listas" :> Capture "listId" Int :> "itens" :> Capture "itemId" Int :> "contribuir" :> Header "Authorization" String :> ReqBody '[JSON] ContributionRequest :> Post '[JSON] ContributionResponse
    :<|> "listas" :> Capture "listId" Int :> "contribuicoes" :> Get '[JSON] [ContributionDetailResponse]

handlerClienteTodos :: Connection -> Handler ClienteResponse
handlerClienteTodos conn = do 
    res <- liftIO $ query_ conn "SELECT id, nome, cpf FROM Cliente" 
    let result = map (\(id', nome', cpf') -> Cliente id' nome' cpf') res
    pure (ClienteResponse result)

handlerCliente :: Connection -> Cliente -> Handler ResultadoResponse
handlerCliente conn cli = do 
    res <- liftIO $ query conn "INSERT INTO Cliente (nome,cpf) VALUES (?,?) RETURNING id" (nome cli, cpf cli)
    case res of 
        [Only novoId] -> pure (ResultadoResponse $ novoId)
        _ -> throwError err500

handlerSoma :: Calculadora -> Handler ResultadoResponse
handlerSoma (Calculadora x y) = pure (ResultadoResponse $ x + y)

options :: Handler ()
options = pure ()

optionsWithId :: Int -> Handler ()
optionsWithId _ = options

optionsWithListAndItemId :: Int -> Int -> Handler ()
optionsWithListAndItemId _ _ = options

optionsNoContent :: Handler NoContent
optionsNoContent = pure NoContent

-- Handler eh uma Monada que tem IO embutido
handlerHello :: Handler String 
handlerHello = pure "Ola, mundo!"

server :: Connection -> Server API 
server conn = handlerHello 
            :<|> handlerSoma 
            :<|> options 
            :<|> handlerCliente conn 
            :<|> options 
            :<|> handlerClienteTodos conn
            :<|> handlerCliente conn            
            :<|> handlerGetUsuario conn            
            :<|> optionsWithId
            :<|> handlerCadastro conn
            :<|> options
            :<|> handlerLogin conn
            :<|> options
            :<|> options
            :<|> Lista.handlerListasPublicas conn
            :<|> Lista.handlerCriarLista conn
            :<|> optionsWithId
            :<|> Lista.handlerListaPorIdPublic conn
            :<|> Lista.handlerListaPorId conn
            :<|> Lista.handlerAtualizarLista conn
            :<|> Lista.handlerExcluirLista conn
            :<|> Lista.handlerMinhasListas conn
            :<|> optionsWithListAndItemId
            :<|> Lista.handlerContribuirItem conn
            :<|> Lista.handlerListarContribuicoes conn

addCorsHeader :: Middleware
addCorsHeader app' req resp =
    let originHeader = lookup "Origin" (requestHeaders req)
        origin = case originHeader of
                    Just o -> o
                    Nothing -> ""
        isAllowed = origin `elem` ["http://localhost:3000"]
    in if requestMethod req == "OPTIONS"
           then if isAllowed
                    then resp $ responseLBS status200
                        [ ("Access-Control-Allow-Origin", origin)
                        , ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                        , ("Access-Control-Allow-Headers", "Content-Type, Authorization")
                        , ("Access-Control-Allow-Credentials", "true")
                        ] mempty
                    else resp $ responseLBS status403
                        [ ("Access-Control-Allow-Origin", origin)
                        , ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                        , ("Access-Control-Allow-Headers", "Content-Type, Authorization")
                        ] mempty
           else if isAllowed
                    then app' req $ \res ->
                            resp $ mapResponseHeaders
                                    (\hs -> [ ("Access-Control-Allow-Origin", origin)
                                            , ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                                            , ("Access-Control-Allow-Headers", "Content-Type, Authorization")
                                            , ("Access-Control-Allow-Credentials", "true")
                                            ] ++ hs)
                            res
                    else app' req resp

app :: Connection -> Application 
app conn = addCorsHeader (serve (Proxy @API) (server conn))