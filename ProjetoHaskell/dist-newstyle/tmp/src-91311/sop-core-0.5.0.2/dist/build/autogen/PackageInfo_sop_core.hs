{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module PackageInfo_sop_core (
    name,
    version,
    synopsis,
    copyright,
    homepage,
  ) where

import Data.Version (Version(..))
import Prelude

name :: String
name = "sop_core"
version :: Version
version = Version [0,5,0,2] []

synopsis :: String
synopsis = "True Sums of Products"
copyright :: String
copyright = ""
homepage :: String
homepage = ""
