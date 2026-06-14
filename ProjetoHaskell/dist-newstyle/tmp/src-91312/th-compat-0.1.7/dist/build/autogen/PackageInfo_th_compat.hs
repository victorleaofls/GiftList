{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module PackageInfo_th_compat (
    name,
    version,
    synopsis,
    copyright,
    homepage,
  ) where

import Data.Version (Version(..))
import Prelude

name :: String
name = "th_compat"
version :: Version
version = Version [0,1,7] []

synopsis :: String
synopsis = "Backward- (and forward-)compatible Quote and Code types"
copyright :: String
copyright = "(C) 2020 Ryan Scott"
homepage :: String
homepage = "https://github.com/haskell-compat/th-compat"
