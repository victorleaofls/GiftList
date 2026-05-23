module Services.AuthService where

import Prelude hiding (exp)
import qualified Crypto.KDF.Argon2 as Argon2
import Crypto.Error (CryptoFailable(..))
import Crypto.Random (getRandomBytes)
import Data.ByteArray (constEq)
import qualified Data.ByteString as B
import qualified Data.ByteString.Base64 as B64
import qualified Data.ByteString.Char8 as BS8
import Data.Maybe (fromMaybe)
import Data.Time.Clock.POSIX (getPOSIXTime)
import qualified Data.Text as T
import System.Environment (lookupEnv)
import Web.JWT (JWTClaimsSet(..), encodeSigned, hmacSecret, numericDate, stringOrURI, decodeAndVerifySignature, claims, toVerify, stringOrURIToText)

argon2Options :: Argon2.Options
argon2Options = Argon2.Options
    { Argon2.iterations = 3
    , Argon2.memory = 65536
    , Argon2.parallelism = 1
    , Argon2.variant = Argon2.Argon2id
    , Argon2.version = Argon2.Version13
    }

hashPassword :: String -> IO (Either String (String, String))
hashPassword password = do
    salt <- getRandomBytes 16
    let passwordBytes = BS8.pack password
    case (Argon2.hash argon2Options passwordBytes salt 32 :: CryptoFailable B.ByteString) of
        CryptoFailed err -> pure (Left $ show err)
        CryptoPassed digest ->
            let saltB64 = BS8.unpack (B64.encode salt)
                hashB64 = BS8.unpack (B64.encode digest)
            in pure (Right (hashB64, saltB64))

verifyPassword :: String -> String -> String -> Bool
verifyPassword password saltB64 hashB64 =
    case (B64.decode (BS8.pack saltB64), B64.decode (BS8.pack hashB64)) of
        (Right salt, Right expectedHash) ->
            case (Argon2.hash argon2Options (BS8.pack password) salt 32 :: CryptoFailable B.ByteString) of
                CryptoPassed actualHash -> constEq actualHash expectedHash
                _ -> False
        _ -> False

getJwtSecret :: IO T.Text
getJwtSecret = do
    mSecret <- lookupEnv "JWT_SECRET"
    pure $ T.pack (fromMaybe "dev-secret-change" mSecret)

makeJwtToken :: Int -> IO String
makeJwtToken userId = do
    secret <- getJwtSecret
    now <- getPOSIXTime
    let claimsSet = mempty
            { sub = stringOrURI (T.pack (show userId))
            , iat = numericDate now
            , exp = numericDate (now + 60 * 60 * 24)
            }
        tokenText = encodeSigned (hmacSecret secret) mempty claimsSet
    pure ("Bearer " <> T.unpack tokenText)

validateToken :: String -> IO (Maybe Int)
validateToken authHeader = do
    let bearer = BS8.pack "Bearer "
    if not (bearer `BS8.isPrefixOf` BS8.pack authHeader) 
        then pure Nothing
        else do
            let token = T.pack $ drop 7 authHeader
            secret <- getJwtSecret
            case decodeAndVerifySignature (toVerify (hmacSecret secret)) token of
                Nothing -> pure Nothing
                Just jwt -> 
                    let cs = claims jwt
                    in case sub cs of
                        Nothing -> pure Nothing
                        Just userIdStr -> 
                            let txt = stringOrURIToText userIdStr
                            in pure $ Just (read $ T.unpack txt)