{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
#if __GLASGOW_HASKELL__ >= 810
{-# OPTIONS_GHC -Wno-prepositive-qualified-module #-}
#endif
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module Paths_th_abstraction (
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
version = Version [0,7,2,0] []

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir `joinFileName` name)

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath




bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath
bindir     = "/home/victorleao/.cabal/store/ghc-9.6.7/th-abstraction-0.7.2.0-674bb23d421dbc5174b05f001b86ed25bc971180e0e5aafe40bd57bceeca4896/bin"
libdir     = "/home/victorleao/.cabal/store/ghc-9.6.7/th-abstraction-0.7.2.0-674bb23d421dbc5174b05f001b86ed25bc971180e0e5aafe40bd57bceeca4896/lib"
dynlibdir  = "/home/victorleao/.cabal/store/ghc-9.6.7/th-abstraction-0.7.2.0-674bb23d421dbc5174b05f001b86ed25bc971180e0e5aafe40bd57bceeca4896/lib"
datadir    = "/home/victorleao/.cabal/store/ghc-9.6.7/th-abstraction-0.7.2.0-674bb23d421dbc5174b05f001b86ed25bc971180e0e5aafe40bd57bceeca4896/share"
libexecdir = "/home/victorleao/.cabal/store/ghc-9.6.7/th-abstraction-0.7.2.0-674bb23d421dbc5174b05f001b86ed25bc971180e0e5aafe40bd57bceeca4896/libexec"
sysconfdir = "/home/victorleao/.cabal/store/ghc-9.6.7/th-abstraction-0.7.2.0-674bb23d421dbc5174b05f001b86ed25bc971180e0e5aafe40bd57bceeca4896/etc"

getBinDir     = catchIO (getEnv "th_abstraction_bindir")     (\_ -> return bindir)
getLibDir     = catchIO (getEnv "th_abstraction_libdir")     (\_ -> return libdir)
getDynLibDir  = catchIO (getEnv "th_abstraction_dynlibdir")  (\_ -> return dynlibdir)
getDataDir    = catchIO (getEnv "th_abstraction_datadir")    (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "th_abstraction_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "th_abstraction_sysconfdir") (\_ -> return sysconfdir)



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
