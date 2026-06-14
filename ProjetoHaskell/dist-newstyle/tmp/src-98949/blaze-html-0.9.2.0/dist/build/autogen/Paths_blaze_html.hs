{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
#if __GLASGOW_HASKELL__ >= 810
{-# OPTIONS_GHC -Wno-prepositive-qualified-module #-}
#endif
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module Paths_blaze_html (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where


import qualified Control.Exception as Exception
import qualified Data.List as List
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude


#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,9,2,0] []

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir `joinFileName` name)

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath




bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath
bindir     = "/home/victorleao/.cabal/store/ghc-9.6.7/blaze-html-0.9.2.0-a6b0a2a45c3588afbed2291ab0470519e6d68f9642a41c30936d23bd60ddde0f/bin"
libdir     = "/home/victorleao/.cabal/store/ghc-9.6.7/blaze-html-0.9.2.0-a6b0a2a45c3588afbed2291ab0470519e6d68f9642a41c30936d23bd60ddde0f/lib"
dynlibdir  = "/home/victorleao/.cabal/store/ghc-9.6.7/blaze-html-0.9.2.0-a6b0a2a45c3588afbed2291ab0470519e6d68f9642a41c30936d23bd60ddde0f/lib"
datadir    = "/home/victorleao/.cabal/store/ghc-9.6.7/blaze-html-0.9.2.0-a6b0a2a45c3588afbed2291ab0470519e6d68f9642a41c30936d23bd60ddde0f/share"
libexecdir = "/home/victorleao/.cabal/store/ghc-9.6.7/blaze-html-0.9.2.0-a6b0a2a45c3588afbed2291ab0470519e6d68f9642a41c30936d23bd60ddde0f/libexec"
sysconfdir = "/home/victorleao/.cabal/store/ghc-9.6.7/blaze-html-0.9.2.0-a6b0a2a45c3588afbed2291ab0470519e6d68f9642a41c30936d23bd60ddde0f/etc"

getBinDir     = catchIO (getEnv "blaze_html_bindir")     (\_ -> return bindir)
getLibDir     = catchIO (getEnv "blaze_html_libdir")     (\_ -> return libdir)
getDynLibDir  = catchIO (getEnv "blaze_html_dynlibdir")  (\_ -> return dynlibdir)
getDataDir    = catchIO (getEnv "blaze_html_datadir")    (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "blaze_html_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "blaze_html_sysconfdir") (\_ -> return sysconfdir)



joinFileName :: String -> String -> FilePath
joinFileName ""  fname = fname
joinFileName "." fname = fname
joinFileName dir ""    = dir
joinFileName dir fname
  | isPathSeparator (List.last dir) = dir ++ fname
  | otherwise                       = dir ++ pathSeparator : fname

pathSeparator :: Char
pathSeparator = '/'

isPathSeparator :: Char -> Bool
isPathSeparator c = c == '/'
