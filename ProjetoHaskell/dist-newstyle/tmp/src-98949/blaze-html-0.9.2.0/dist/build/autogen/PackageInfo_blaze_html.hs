{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module PackageInfo_blaze_html (
    name,
    version,
    synopsis,
    copyright,
    homepage,
  ) where

import Data.Version (Version(..))
import Prelude

name :: String
name = "blaze_html"
version :: Version
version = Version [0,9,2,0] []

synopsis :: String
synopsis = "A blazingly fast HTML combinator library for Haskell"
copyright :: String
copyright = ""
homepage :: String
homepage = "http://jaspervdj.be/blaze"
