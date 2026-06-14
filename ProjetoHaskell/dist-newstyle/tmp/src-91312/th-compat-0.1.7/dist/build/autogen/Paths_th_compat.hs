{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
#if __GLASGOW_HASKELL__ >= 810
{-# OPTIONS_GHC -Wno-prepositive-qualified-module #-}
#endif
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module Paths_th_compat (
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
version = Version [0,1,7] []

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir `joinFileName` name)

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath




bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath
bindir     = "/home/victorleao/.cabal/store/ghc-9.6.7/th-compat-0.1.7-7f1b1d79d8c62ec3e895ddf9b40eb05d000fa5f3f21d9c8e4c5fcc240207b078/bin"
libdir     = "/home/victorleao/.cabal/store/ghc-9.6.7/th-compat-0.1.7-7f1b1d79d8c62ec3e895ddf9b40eb05d000fa5f3f21d9c8e4c5fcc240207b078/lib"
dynlibdir  = "/home/victorleao/.cabal/store/ghc-9.6.7/th-compat-0.1.7-7f1b1d79d8c62ec3e895ddf9b40eb05d000fa5f3f21d9c8e4c5fcc240207b078/lib"
datadir    = "/home/victorleao/.cabal/store/ghc-9.6.7/th-compat-0.1.7-7f1b1d79d8c62ec3e895ddf9b40eb05d000fa5f3f21d9c8e4c5fcc240207b078/share"
libexecdir = "/home/victorleao/.cabal/store/ghc-9.6.7/th-compat-0.1.7-7f1b1d79d8c62ec3e895ddf9b40eb05d000fa5f3f21d9c8e4c5fcc240207b078/libexec"
sysconfdir = "/home/victorleao/.cabal/store/ghc-9.6.7/th-compat-0.1.7-7f1b1d79d8c62ec3e895ddf9b40eb05d000fa5f3f21d9c8e4c5fcc240207b078/etc"

getBinDir     = catchIO (getEnv "th_compat_bindir")     (\_ -> return bindir)
getLibDir     = catchIO (getEnv "th_compat_libdir")     (\_ -> return libdir)
getDynLibDir  = catchIO (getEnv "th_compat_dynlibdir")  (\_ -> return dynlibdir)
getDataDir    = catchIO (getEnv "th_compat_datadir")    (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "th_compat_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "th_compat_sysconfdir") (\_ -> return sysconfdir)



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
