{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module PackageInfo_iproute (
    name,
    version,
    synopsis,
    copyright,
    homepage,
  ) where

import Data.Version (Version(..))
import Prelude

name :: String
name = "iproute"
version :: Version
version = Version [1,7,15] []

synopsis :: String
synopsis = "IP Routing Table"
copyright :: String
copyright = ""
homepage :: String
homepage = "http://www.mew.org/~kazu/proj/iproute/"
