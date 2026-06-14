{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module PackageInfo_pem (
    name,
    version,
    synopsis,
    copyright,
    homepage,
  ) where

import Data.Version (Version(..))
import Prelude

name :: String
name = "pem"
version :: Version
version = Version [0,2,4] []

synopsis :: String
synopsis = "Privacy Enhanced Mail (PEM) format reader and writer."
copyright :: String
copyright = "Vincent Hanquez <vincent@snarc.org>"
homepage :: String
homepage = "http://github.com/vincenthz/hs-pem"
