{-# LANGUAGE OverloadedStrings #-}
module Handlers.HandlerLista where

import qualified Api.Model as M
import Control.Monad (forM, when)
import Control.Monad.Except
import Control.Monad.IO.Class
import Database.PostgreSQL.Simple
import Database.PostgreSQL.Simple.Types (Only(..))
import Data.Time (Day)
import Data.Time.Format (defaultTimeLocale, parseTimeM)
import Servant
import Services.AuthService

parseListDate :: Maybe String -> Maybe Day
parseListDate = (>>= parseTimeM True defaultTimeLocale "%F")

requireUserId :: Maybe String -> Handler Int
requireUserId Nothing = throwError err401 { errBody = "Autorizacao ausente" }
requireUserId (Just authHeader) = do
    maybeUserId <- liftIO $ validateToken authHeader
    maybe (throwError err401 { errBody = "Token invalido" }) pure maybeUserId

loadGiftList :: Connection -> Int -> IO (Maybe M.GiftListResponse)
loadGiftList conn listId = do
    rows <- query conn
        "SELECT l.id, l.nome, u.nome_completo, l.descricao, CASE WHEN l.data_evento IS NULL THEN NULL ELSE to_char(l.data_evento, 'YYYY-MM-DD') END, to_char(l.criada_em, 'YYYY-MM-DD'), l.pix_eligivel FROM Lista l JOIN Usuario u ON u.id = l.usuario_id WHERE l.id = ?"
        (Only listId)
    case rows of
        [(lid, nome, owner, descricao, mData, criadaEm, pixElegivel)] -> do
            itens <- query conn
                "SELECT id, nome, preco, arrecadado, imagem FROM ListaItem WHERE lista_id = ? ORDER BY id"
                (Only listId)
            let mappedItens = map
                    (\(itemId, itemNome, itemPreco, itemArrecadado, itemImagem) ->
                        M.GiftItemResponse itemId itemNome itemPreco itemArrecadado itemImagem)
                    (itens :: [(Int, String, Double, Double, Maybe String)])
            pure $ Just (M.GiftListResponse lid nome owner descricao mData criadaEm pixElegivel mappedItens)
        _ -> pure Nothing

loadGiftLists :: Connection -> [Int] -> IO [M.GiftListResponse]
loadGiftLists conn ids = do
    lists <- forM ids (loadGiftList conn)
    pure (foldr (\row acc -> maybe acc (: acc) row) [] lists)

handlerListasPublicas :: Connection -> Maybe String -> Handler [M.GiftListResponse]
handlerListasPublicas conn mQuery = do
    let queryText = maybe "" Prelude.id mQuery
        like = "%" ++ queryText ++ "%"
        queryAll = query_ conn "SELECT id FROM Lista ORDER BY criada_em DESC" :: IO [Only Int]
        queryFiltered = query conn
            "SELECT l.id FROM Lista l JOIN Usuario u ON u.id = l.usuario_id WHERE l.nome ILIKE ? OR u.nome_completo ILIKE ? OR CAST(l.id AS TEXT) ILIKE ? ORDER BY l.criada_em DESC"
            (like, like, like) :: IO [Only Int]
    ids <- liftIO $ if null queryText then queryAll else queryFiltered
    liftIO $ loadGiftLists conn (map fromOnly ids)

handlerMinhasListas :: Connection -> Maybe String -> Handler [M.GiftListResponse]
handlerMinhasListas conn mAuth = do
    userId <- requireUserId mAuth
    ids <- liftIO $ (query conn "SELECT id FROM Lista WHERE usuario_id = ? ORDER BY criada_em DESC" (Only userId) :: IO [Only Int])
    liftIO $ loadGiftLists conn (map fromOnly ids)

handlerListaPorId :: Connection -> Int -> Maybe String -> Handler M.GiftListResponse
handlerListaPorId conn listId mAuth = do
    case mAuth of
        Nothing -> pure ()
        Just auth -> do
            _ <- liftIO $ validateToken auth
            pure ()
    maybeLista <- liftIO $ loadGiftList conn listId
    maybe (throwError err404 { errBody = "Lista nao encontrada" }) pure maybeLista

handlerListaPorIdPublic :: Connection -> Int -> Handler M.GiftListResponse
handlerListaPorIdPublic conn listId = do
    maybeLista <- liftIO $ loadGiftList conn listId
    maybe (throwError err404 { errBody = "Lista nao encontrada" }) pure maybeLista

handlerCriarLista :: Connection -> Maybe String -> M.GiftListRequest -> Handler M.GiftListResponse
handlerCriarLista conn mAuth (M.GiftListRequest listName listDesc listDate pixEligible items) = do
    userId <- requireUserId mAuth
    res <- liftIO $ (query conn
        "INSERT INTO Lista (usuario_id, nome, descricao, data_evento, pix_eligivel) VALUES (?,?,?,?,?) RETURNING id"
        (userId, listName, listDesc, parseListDate listDate, maybe True Prelude.id pixEligible) :: IO [Only Int])
    case res of
        [Only listId] -> do
            _ <- liftIO $ mapM (\(M.GiftItemRequest itemName itemImage itemPrice) ->
                    execute conn
                        "INSERT INTO ListaItem (lista_id, nome, imagem, preco, arrecadado) VALUES (?,?,?,?,0)"
                        (listId, itemName, itemImage, itemPrice)
                ) items
            maybeLista <- liftIO $ loadGiftList conn listId
            maybe (throwError err500) pure maybeLista
        _ -> throwError err500

handlerAtualizarLista :: Connection -> Int -> Maybe String -> M.GiftListRequest -> Handler M.GiftListResponse
handlerAtualizarLista conn listId mAuth (M.GiftListRequest listName listDesc listDate pixEligible items) = do
    userId <- requireUserId mAuth
    ownsList <- liftIO $ (query conn "SELECT id FROM Lista WHERE id = ? AND usuario_id = ?" (listId, userId) :: IO [Only Int])
    case ownsList of
        [] -> throwError err404 { errBody = "Lista nao encontrada" }
        _ -> do
            _ <- liftIO $ execute conn "DELETE FROM ListaItem WHERE lista_id = ?" (Only listId)
            _ <- liftIO $ execute conn
                "UPDATE Lista SET nome = ?, descricao = ?, data_evento = ?, pix_eligivel = ? WHERE id = ?"
                (listName, listDesc, parseListDate listDate, maybe True Prelude.id pixEligible, listId)
            _ <- liftIO $ mapM (\(M.GiftItemRequest itemName itemImage itemPrice) ->
                    execute conn
                        "INSERT INTO ListaItem (lista_id, nome, imagem, preco, arrecadado) VALUES (?,?,?,?,0)"
                        (listId, itemName, itemImage, itemPrice)
                ) items
            maybeLista <- liftIO $ loadGiftList conn listId
            maybe (throwError err500) pure maybeLista

handlerExcluirLista :: Connection -> Int -> Maybe String -> Handler NoContent
handlerExcluirLista conn listId mAuth = do
    userId <- requireUserId mAuth
    ownsList <- liftIO $ (query conn "SELECT id FROM Lista WHERE id = ? AND usuario_id = ?" (listId, userId) :: IO [Only Int])
    case ownsList of
        [] -> throwError err404 { errBody = "Lista nao encontrada" }
        _ -> do
            _ <- liftIO $ execute conn "DELETE FROM Lista WHERE id = ?" (Only listId)
            pure NoContent

handlerContribuirItem :: Connection -> Int -> Int -> M.ContributionRequest -> Handler M.ContributionResponse
handlerContribuirItem conn listId itemId (M.ContributionRequest amount) = do
    when (amount <= 0) $
        throwError err400 { errBody = "Valor invalido" }
    rows <- liftIO $ (query conn "SELECT id, preco, arrecadado FROM ListaItem WHERE id = ? AND lista_id = ?" (itemId, listId) :: IO [(Int, Double, Double)])
    case rows of
        [(foundItemId, price, raised)] -> do
            when (amount > max 0 (price - raised)) $
                throwError err400 { errBody = "Valor maior que o restante disponivel" }
            _ <- liftIO $ execute conn
                "INSERT INTO Contribuicao (lista_item_id, usuario_id, valor) VALUES (?,?,?)"
                (foundItemId, Nothing :: Maybe Int, amount)
            _ <- liftIO $ execute conn
                "UPDATE ListaItem SET arrecadado = LEAST(preco, arrecadado + ?) WHERE id = ?"
                (amount, foundItemId)
            contribIdRows <- liftIO $ (query_ conn "SELECT currval(pg_get_serial_sequence('Contribuicao','id'))" :: IO [Only Int])
            let contribId = case contribIdRows of
                    [Only value] -> value
                    _ -> 0
                paymentLink = "https://giftlist.local/pix/lista/" ++ show listId ++ "/item/" ++ show itemId ++ "?amount=" ++ show amount
            pure $ M.ContributionResponse contribId paymentLink paymentLink amount
        _ -> throwError err404 { errBody = "Presente nao encontrado" }